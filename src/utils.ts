import { TAGS } from "./baseEntities/constants"
import { ISOXMLManager } from "./ISOXMLManager"
import {
    AttributeDescription,
    AttributesDescription,
    Entity,
    EntityConstructor,
    ISOXMLReference,
    ReferencesDescription,
    XMLElement
} from "./types"

type AttributeGenerator = (value: any, attrDescription: AttributeDescription, isoxmlManager: ISOXMLManager) => string
type AttributeParser = (value: string, attrDescription: AttributeDescription, isoxmlManager: ISOXMLManager) => any

function idrefParser (
    value: string,
    attrDescription: AttributeDescription,
    isoxmlManager: ISOXMLManager
): ISOXMLReference {
    return isoxmlManager.registerEntity(null, value)
}

function integerParser (value: string): number {
    return parseInt(value, 10)
}

function floatParser (value: string): number {
    return parseFloat(value)
}

function dateTimeParser (value: string): Date {
    return new Date(value)
}

function idrefGenerator (value: ISOXMLReference): string {
    return value.xmlId
}

function numberGenerator (value: number, attrDescription: AttributeDescription): string {
    if ('fractionDigits' in attrDescription) {
        return parseFloat(value.toFixed(attrDescription.fractionDigits)).toString()
    } else {
        return value.toString()
    }
}

function dateTimeGenerator (value: Date): string {
    return value.toISOString()
}

const PARSERS: {[xsdType: string]: AttributeParser} = {
    'xs:IDREF': idrefParser,
    'xs:unsignedByte': integerParser,
    'xs:long': integerParser,
    'xs:unsignedShort': integerParser,
    'xs:unsignedLong': integerParser,
    'xs:decimal': floatParser,
    'xs:double': floatParser,
    'xs:dateTime': dateTimeParser
}

const GENERATORS: {[xsdType: string]: AttributeGenerator} = {
    'xs:IDREF': idrefGenerator,
    'xs:unsignedByte': numberGenerator,
    'xs:long': numberGenerator,
    'xs:unsignedShort': numberGenerator,
    'xs:unsignedLong': numberGenerator,
    'xs:decimal': numberGenerator,
    'xs:double': numberGenerator,
    'xs:dateTime': dateTimeGenerator
}

const PROPRIETARY_NAME = /^P\d+_/

function xml2attrs(
    xml: XMLElement,
    attributesDescription: AttributesDescription,
    isoxmlManager: ISOXMLManager,
    internalId: string
): any {
    const result = {}
    Object.keys(xml._attributes || {}).forEach(xmlAttr => {
        const attrDescription = attributesDescription[xmlAttr]
        if (!attrDescription) {
            if (xmlAttr.match(PROPRIETARY_NAME)) {
                result['ProprietaryAttributes'] = result['ProprietaryAttributes'] || []
                result['ProprietaryAttributes'][xmlAttr] = xml._attributes[xmlAttr]
            } else {
                // warn about unknown non-proprietary attributes
                isoxmlManager.addWarning(`[${internalId}] Unknown attribute "${xmlAttr}"`)
            }
            return 
        }
        if (attrDescription.isPrimaryId) {
            return
        }
        const parser = PARSERS[attrDescription.type]
        result[attrDescription.name] = parser
            ? parser(xml._attributes[xmlAttr] as string, attrDescription, isoxmlManager)
            : xml._attributes[xmlAttr]
    })

    // validation
    Object.keys(attributesDescription).forEach(xmlAttr => {
        if (!attributesDescription[xmlAttr].isOptional && (!xml._attributes || !(xmlAttr in xml._attributes))) {
            isoxmlManager.addWarning(`[${internalId}] Missing required attribute "${xmlAttr}"`)
        }
    })

    return result
}

function attrs2xml(
    entity: Entity,
    attributesDescription: AttributesDescription,
): {[xmlId: string]: string} {
    const version = entity.isoxmlManager.options.version

    const result = {
        ...entity.attributes.ProprietaryAttributes
    }

    const primaryXmlId = Object.keys(attributesDescription).find(xmlTag => attributesDescription[xmlTag].isPrimaryId)

    if (primaryXmlId && !(version === 3 && attributesDescription[primaryXmlId].isOnlyV4)) {
        const ref = entity.isoxmlManager.getReferenceByEntity(entity)
        if (ref) {
            result[primaryXmlId] = ref.xmlId
        }
    }

    Object.keys(entity.attributes).forEach(attrName => {
        const xmlAttr = Object.keys(attributesDescription).find(xmlId => attributesDescription[xmlId].name === attrName)
        const attrDescription = attributesDescription[xmlAttr]
        if (!attrDescription || (version === 3 && attrDescription.isOnlyV4)) {
            return
        }
        const generator = GENERATORS[attrDescription.type]
        result[xmlAttr] = generator
            ? generator(entity.attributes[attrName], attrDescription, entity.isoxmlManager)
            : entity.attributes[attrName]
    })

    return result
}

export async function xml2ChildTags(
    xml: XMLElement,
    referencesDescription: ReferencesDescription,
    isoxmlManager: ISOXMLManager,
    internalId: string
): Promise<{[tag: string]: Entity[]}> {
    const result = {}
    for (const tagName in xml) {
        const refDescription = referencesDescription[tagName]
        if (!refDescription) {
            if (tagName.match(PROPRIETARY_NAME)) {
                result['ProprietaryTags'] = result['ProprietaryTags'] || {}
                result['ProprietaryTags'][tagName] = result['ProprietaryTags'][tagName] || []
                result['ProprietaryTags'][tagName].push(...xml[tagName])
            }
            continue 
        }
        result[refDescription.name] = []
        for (const idx in xml[tagName]) {
            const childInternalId = `${internalId}->${tagName}[${idx}]`
            const childXml = xml[tagName][idx]
            result[refDescription.name].push(
                await isoxmlManager.createEntityFromXML(tagName as TAGS, childXml, childInternalId)
            )
        }
    }
    return result 
}

export function childTags2Xml(
    entity: Entity,
    referencesDescription: ReferencesDescription,
): {[tag: string]: any} {
    const version = entity.isoxmlManager.options.version
    const result = {
        ...entity.attributes.ProprietaryTags
    }
    Object.keys(entity.attributes).forEach(attrName => {
        const tagName = Object.keys(referencesDescription).find(tag => referencesDescription[tag].name === attrName)
        const refDescription = referencesDescription[tagName]
        if (!refDescription || (version === 3 && refDescription.isOnlyV4)) {
            return 
        }

        result[tagName] = (entity.attributes[attrName] as Entity[]).map(entity => entity.toXML())
    })
    return result 
}

export async function fromXML(
    xml: XMLElement,
    isoxmlManager: ISOXMLManager,
    entityClass: EntityConstructor,
    attributesDescription: AttributesDescription,
    referencesDescription: ReferencesDescription,
    internalId?: string
): Promise<Entity> {
    const idAttr = Object.keys(attributesDescription).find(attrId => attributesDescription[attrId].isPrimaryId)
    const xmlId = idAttr ? xml._attributes[idAttr] as string : null

    const updatedInternalId = xmlId || internalId

    const children = await xml2ChildTags(xml, referencesDescription, isoxmlManager, updatedInternalId)
    const entity = new entityClass({
        ...xml2attrs(xml, attributesDescription, isoxmlManager, updatedInternalId),
        ...children
    }, isoxmlManager, updatedInternalId)
    xmlId && entity.isoxmlManager.registerEntity(entity, xmlId)

    return entity
}

export function toXML(
    entity: Entity,
    attributesDescription: AttributesDescription,
    referencesDescription: ReferencesDescription
): XMLElement {
    return {
        _attributes: attrs2xml(entity, attributesDescription),
        ...childTags2Xml(entity, referencesDescription)
    }
}

export function DDIToString(DDI: number): string {
    return ('0000' + DDI.toString(16).toUpperCase()).slice(-4)
}
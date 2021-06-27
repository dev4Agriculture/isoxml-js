import { ElementCompact } from "xml-js";
import { ISOXMLManager } from "./ISOXMLManager";
import { AttributesDescription, Entity, EntityConstructor, ISOXMLReference, ReferencesDescription } from "./types";


function idrefParser (value: string, isoxmlManager: ISOXMLManager): ISOXMLReference {
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

function numberGenerator (value: number): string {
    return value.toString()
}

function dateTimeGenerator (value: Date): string {
    return value.toISOString()
}

const PARSERS: {[xsdType: string]: {(value: string, isoxmlManager: ISOXMLManager): any}} = {
    'xs:IDREF': idrefParser,
    'xs:unsignedByte': integerParser,
    'xs:long': integerParser,
    'xs:unsignedShort': integerParser,
    'xs:unsignedLong': integerParser,
    'xs:decimal': floatParser,
    'xs:double': floatParser,
    'xs:dateTime': dateTimeParser
}

const GENERATORS: {[xsdType: string]: {(value: any, isoxmlManager: ISOXMLManager): string}} = {
    'xs:IDREF': idrefGenerator,
    'xs:unsignedByte': numberGenerator,
    'xs:long': numberGenerator,
    'xs:unsignedShort': numberGenerator,
    'xs:unsignedLong': numberGenerator,
    'xs:decimal': numberGenerator,
    'xs:double': numberGenerator,
    'xs:dateTime': dateTimeGenerator
}

function xml2attrs(
    xml: ElementCompact,
    attributesDescription: AttributesDescription,
    isoxmlManager: ISOXMLManager
): any {
    const result = {}
    Object.keys(xml._attributes || {}).forEach(xmlAttr => {
        const attrDescription = attributesDescription[xmlAttr]
        if (!attrDescription) {
            return // allow unknown attributes
        }
        if (attrDescription.isPrimaryId) {
            return
        }
        const parser = PARSERS[attrDescription.type]
        result[attrDescription.name] = parser
            ? parser(xml._attributes[xmlAttr] as string, isoxmlManager)
            : xml._attributes[xmlAttr]
    })

    return result
}

function attrs2xml(
    entity: Entity,
    attributesDescription: AttributesDescription,
): {[xmlId: string]: string} {
    const result = {}

    const primaryXmlId = Object.keys(attributesDescription).find(xmlTag => attributesDescription[xmlTag].isPrimaryId)

    if (primaryXmlId) {
        const ref = entity.isoxmlManager.getReferenceByEntity(entity)
        if (ref) {
            result[primaryXmlId] = ref.xmlId
        }
    }

    Object.keys(entity.attributes).forEach(attrName => {
        const xmlAttr = Object.keys(attributesDescription).find(xmlId => attributesDescription[xmlId].name === attrName)
        const attrDescription = attributesDescription[xmlAttr]
        if (!attrDescription) {
            return
        }
        const generator = GENERATORS[attrDescription.type]
        result[xmlAttr] = generator
            ? generator(entity.attributes[attrName], entity.isoxmlManager)
            : entity.attributes[attrName]
    })

    return result
}

export function xml2ChildTags(
    xml: ElementCompact,
    referencesDescription: ReferencesDescription,
    isoxmlManager: ISOXMLManager
) {
    const result = {}
    Object.keys(xml).forEach(tagName => {
        const refDescription = referencesDescription[tagName]
        if (!refDescription) {
            return 
        }

        result[refDescription.name] = xml[tagName].map(childXml => isoxmlManager.createEntityFromXML(tagName, childXml))
    })
    return result 
}

export function childTags2Xml(
    entity: Entity,
    referencesDescription: ReferencesDescription,
) {
    const result = {}
    Object.keys(entity.attributes).forEach(attrName => {
        const tagName = Object.keys(referencesDescription).find(tag => referencesDescription[tag].name === attrName)
        const refDescription = referencesDescription[tagName]
        if (!refDescription) {
            return 
        }

        result[tagName] = (entity.attributes[attrName] as Entity[]).map(entity => entity.toXML())
    })
    return result 
}

export function fromXML(
    xml: ElementCompact,
    isoxmlManager: ISOXMLManager,
    entityClass: EntityConstructor,
    attributesDescription: AttributesDescription,
    referencesDescription: ReferencesDescription
): Entity {
    const entity = new entityClass({
        ...xml2attrs(xml, attributesDescription, isoxmlManager),
        ...xml2ChildTags(xml, referencesDescription, isoxmlManager)
    }, isoxmlManager)

    const idAttr = Object.keys(attributesDescription).find(attrId => attributesDescription[attrId].isPrimaryId)
    const xmlId = idAttr ? xml._attributes[idAttr] as string : null
    xmlId && entity.isoxmlManager.registerEntity(entity, xmlId)

    return entity
}

export function toXML(
    entity: Entity,
    attributesDescription: AttributesDescription,
    referencesDescription: ReferencesDescription
): ElementCompact {
    return {
        _attributes: attrs2xml(entity, attributesDescription),
        ...childTags2Xml(entity, referencesDescription)
    }
}
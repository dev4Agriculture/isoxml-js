import { ElementCompact } from "xml-js";
import { ISOXMLManager } from "./ISOXMLManager";
import { AttributesDescription, Entity, EntityConstructor, ISOXMLReference, ReferencesDescription } from "./types";


function idrefParser (value: string, isoxmlManager: ISOXMLManager): ISOXMLReference {
    return isoxmlManager.registerXMLReference(value)
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

function idrefGenerator (value: ISOXMLReference, isoxmlManager: ISOXMLManager): string {
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
        const parser = PARSERS[attrDescription.type]
        result[attrDescription.name] = parser
            ? parser(xml._attributes[xmlAttr] as string, isoxmlManager)
            : xml._attributes[xmlAttr]
    })

    return result
}

function attrs2xml(
    attrs: {[name: string]: any},
    attributesDescription: AttributesDescription,
    isoxmlManager: ISOXMLManager
): {[xmlId: string]: string} {
    const result = {}
    Object.keys(attrs).forEach(attrName => {
        const xmlAttr = Object.keys(attributesDescription).find(xmlId => attributesDescription[xmlId].name === attrName)
        const attrDescription = attributesDescription[xmlAttr]
        if (!attrDescription) {
            return
        }
        const generator = GENERATORS[attrDescription.type]
        result[xmlAttr] = generator
            ? generator(attrs[attrName], isoxmlManager)
            : attrs[attrName]
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

        result[refDescription.name] = xml[tagName].map(childXml => isoxmlManager.createEntity(tagName, childXml))
    })
    return result 
}

export function childTags2Xml(
    attrs: {[name: string]: any},
    referencesDescription: ReferencesDescription,
    isoxmlManager: ISOXMLManager
) {
    const result = {}
    Object.keys(attrs).forEach(attrName => {
        const tagName = Object.keys(referencesDescription).find(tag => referencesDescription[tag].name === attrName)
        const refDescription = referencesDescription[tagName]
        if (!refDescription) {
            return 
        }

        result[tagName] = (attrs[attrName] as Entity[]).map(entity => entity.toXML(isoxmlManager))
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
    })

    const idAttr = Object.keys(attributesDescription).find(attrId => attributesDescription[attrId].type === 'xs:ID')

    if (idAttr) {
        isoxmlManager.registerEntity(entity)
    }

    return entity
}

export function toXML(
    attributes: {[name: string]: any},
    isoxmlManager: ISOXMLManager,
    attributesDescription: AttributesDescription,
    referencesDescription: ReferencesDescription
): ElementCompact {
    return {
        _attributes: attrs2xml(attributes, attributesDescription, isoxmlManager),
        ...childTags2Xml(attributes, referencesDescription, isoxmlManager)
    }
}
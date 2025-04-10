import {XMLBuilder, XmlBuilderOptionsOptional, XMLParser, X2jOptionsOptional} from 'fast-xml-parser'
import { XMLElement } from './types'

const XML_PARSE_OPTIONS: X2jOptionsOptional = {
    textNodeName: '_text',
    attributeNamePrefix: '',
    ignoreAttributes: false,
    attributesGroupName: '_attributes',
    parseTagValue: false,
    parseAttributeValue: false,
    isArray: (tagName: string, jPath: string, isLeafNode: boolean, isAttribute: boolean) => !isAttribute,
    attributeValueProcessor: (name: string, value: string) =>
        value.replace(/&amp;/g, '&')
          .replace(/&apos;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
}
const XML_BUILD_OPTIONS: XmlBuilderOptionsOptional = {
    textNodeName: '_text',
    attributeNamePrefix: '',
    ignoreAttributes: false,
    attributesGroupName: '_attributes',
    format: true,
    attributeValueProcessor: (name: string, value: string) =>
        value.replace(/&/g, '&amp;')
          .replace(/'/g, '&apos;')
          .replace(/"/g, '&quot;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
}

export function js2xml(json: XMLElement): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
${new XMLBuilder(XML_BUILD_OPTIONS).build(json)}`
}

export function xml2js(xml: string): XMLElement {
    return new XMLParser(XML_PARSE_OPTIONS).parse(xml)
}
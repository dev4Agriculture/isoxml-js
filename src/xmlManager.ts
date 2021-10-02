import xmlParser from 'fast-xml-parser'
import { XMLElement } from './types'

const XML_PARSE_OPTIONS: xmlParser.X2jOptionsOptional = {
    textNodeName: '_text',
    attributeNamePrefix: '',
    ignoreAttributes: false,
    attrNodeName: '_attributes',
    parseNodeValue: false,
    parseAttributeValue: false,
    arrayMode: true,
    attrValueProcessor: (value: string) => 
        value.replace(/&amp;/g, '&')
          .replace(/&apos;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
}
const XML_GENERATE_OPTIONS: xmlParser.J2xOptionsOptional = {
    textNodeName: '_text',
    attributeNamePrefix: '',
    ignoreAttributes: false,
    attrNodeName: '_attributes',
    format: true,
    attrValueProcessor: (value: string) => 
        value.replace(/&/g, '&amp;')
          .replace(/'/g, '&apos;')
          .replace(/"/g, '&quot;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
}

export function js2xml(json: XMLElement): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
${new xmlParser.j2xParser(XML_GENERATE_OPTIONS).parse(json)}`
}

export function xml2js(xml: string): XMLElement {
    return xmlParser.parse(xml, XML_PARSE_OPTIONS)
}
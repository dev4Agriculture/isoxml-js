import {readFileSync, mkdirSync, writeFileSync, rmSync} from 'fs'
import {join} from 'path'
import Handlebars from 'handlebars'
import xmlParser from 'fast-xml-parser'

Handlebars.registerHelper('ifnoteq', function(arg1, arg2, options) {
    return arg1 !== arg2 ? options.fn(this) : options.inverse(this)
})

Handlebars.registerHelper('toString', function(x) {
    return '' + x
})

Handlebars.registerHelper('isdefined', function (value) {
  return value !== undefined
})

const XSD2TS: {[xsdType: string]: string} = {
    'xs:IDREF': 'ISOXMLReference',
    'xs:ID': 'string',
    'xs:string': 'string',
    'xs:NMTOKEN': 'string',
    'xs:token': 'string',
    'xs:unsignedByte': 'number',
    'xs:long': 'number',
    'xs:unsignedShort': 'number',
    'xs:unsignedLong': 'number',
    'xs:decimal': 'number',
    'xs:double': 'number',
    'xs:hexBinary': 'string',
    'xs:dateTime': 'string',
    'xs:anyURI': 'string',
    'xs:language': 'string'
}

function capitalize(word: string): string {
    return word[0].toUpperCase() + word.slice(1)
}

function normalizeEnumValue (text: string): string {
    const normalizedSpaces = text.toString()
        .replace(/[,()-.]/g, ' ')
        .replace('+', 'Plus')
        .replace(/\s+/g, ' ')
        .trim()

    return normalizedSpaces.split(' ').map(capitalize).join('')
}

function normalizeText (text: string): string {
    return text.toString().replace(/\s|,/g, '')
}


const entityTemplate = Handlebars.compile(
    readFileSync('./generation/templates/Entity.hbs', 'utf-8'
))
const indexTemplate = Handlebars.compile(
    readFileSync('./generation/templates/index.hbs', 'utf-8'
))

const constantsTemplate = Handlebars.compile(
    readFileSync('./generation/templates/constants.hbs', 'utf-8'
))

function parseClassesFromFile(filename: string): any[] {
    const schema = xmlParser.parse(readFileSync(filename, 'utf-8'), {
        textNodeName: '_text',
        attributeNamePrefix: '',
        ignoreAttributes: false,
        attrNodeName: '_attributes',
        arrayMode: true
    })

    const elements = schema['xs:schema'][0]['xs:element']

    const tags = elements.map((elem: any) => {
        const tag = elem._attributes?.name
        const name = normalizeText(elem['xs:annotation'][0]['xs:documentation'][0]._text)

        const attributes = (elem['xs:complexType'][0]['xs:attribute'] || []).map((attr: any) => {
            try {
                const xmlName = attr._attributes?.name
                const attrName = attr['xs:annotation']
                    ? normalizeText(attr['xs:annotation'][0]['xs:documentation'][0]._text)
                    : xmlName

                const isOptional = attr._attributes?.use === 'optional'

                let xsdType: string

                let restrictions
                if (attr._attributes?.type) {
                    xsdType = attr._attributes?.type as string
                } else {
                    restrictions = 
                        attr['xs:simpleType'][0]['xs:restriction'] ||
                        attr['xs:simpleType'][0]['xs:union'][0]['xs:simpleType'][0]['xs:restriction']
                    xsdType = restrictions[0]._attributes.base
                }

                if (!xsdType) {
                    console.log('missing type definition', tag, attr)
                    return
                }

                if (!(xsdType in XSD2TS)) {
                    console.log('Unknown type', xsdType)
                }

                let typeEnum = null
                if (xsdType === 'xs:NMTOKEN') {
                    typeEnum = restrictions[0]['xs:enumeration'].map(enumElem => {
                        const value = enumElem._attributes.value
                        return {
                            value,
                            name: enumElem['xs:annotation']
                                ? normalizeEnumValue(enumElem['xs:annotation'][0]['xs:documentation'][0]._text)
                                : `Value${value}`
                        }
                    })
                    // detect duplicate names
                    const namesCount = {}
                    typeEnum.forEach(item => {
                        namesCount[item.name] = (namesCount[item.name] || 0) + 1
                    })

                    typeEnum.forEach(item => {
                        if (namesCount[item.name] > 1) {
                            item.name += item.value
                        }
                    })
                }

                const isPrimaryId = xsdType === 'xs:ID' && attrName === `${name}Id`

                const type = XSD2TS[xsdType]

                const numericalRestrictions = {} as any
                if (restrictions?.[0]['xs:minInclusive']) {
                    numericalRestrictions.minValue =
                        parseFloat(restrictions[0]['xs:minInclusive'][0]._attributes['value'])
                }
                if (restrictions?.[0]['xs:maxInclusive']) {
                    numericalRestrictions.maxValue =
                        parseFloat(restrictions[0]['xs:maxInclusive'][0]._attributes['value'])
                }
                if (restrictions?.[0]['xs:fractionDigits']) {
                    numericalRestrictions.fractionDigits =
                        parseFloat(restrictions[0]['xs:fractionDigits'][0]._attributes['value'])
                }
                return {
                    xmlName,
                    name: attrName,
                    type,
                    xsdType,
                    isOptional,
                    isPrimaryId,
                    typeEnum,
                    numericalRestrictions
                }
            } catch (e) {
                console.log('Error parsing attribute', attr, elem)
                console.log(e)
            }
        }).filter((e: any) => e)

        let children = []

        if (elem['xs:complexType'][0]['xs:choice'] && elem['xs:complexType'][0]['xs:choice'][0]['xs:element']) {
            children = elem['xs:complexType'][0]['xs:choice'][0]['xs:element'].map((children: any) => {
                const name = children['xs:annotation'] && children['xs:annotation'][0]['xs:documentation']
                    ? normalizeText(children['xs:annotation'][0]['xs:documentation'][0]._text)
                    : null
                return {tag: children._attributes?.ref, name}
            })
        }

        return {
            tag, name, attributes, children,
            includeReference: !!attributes.find(attr => attr.type === 'ISOXMLReference')
        }
    })

    return tags
}


const classesV4 = [
    ...parseClassesFromFile('./generation/xsd/ISO11783_Common_V4-3.xsd'),
    ...parseClassesFromFile('./generation/xsd/ISO11783_TaskFile_V4-3.xsd'),
    ...parseClassesFromFile('./generation/xsd/ISO11783_LinkListFile_V4-3.xsd'),
    ...parseClassesFromFile('./generation/xsd/ISO11783_ExternalFile_V4-3.xsd')
]

classesV4.forEach(cls => {
    cls.children.forEach(child => {
        child.className = classesV4.find(cls => cls.tag === child.tag).name
        if (!child.name) {
            console.log(`Missing child name: ${cls.tag}->${child.tag}`)
            child.name = child.className
        }
    })
})

console.log('------- Analysis of ISO1173-10:2009 (v3.3) -------')

const classesV3 = parseClassesFromFile('./generation/xsd/ISO11783_TaskFile_V3-3.xsd')
const tagsV4 = classesV4.map(cls => cls.tag)
const tagsV3 = classesV3.map(cls => cls.tag)

const removedTags = tagsV3.filter(tag => !tagsV4.includes(tag))
const newTags = tagsV4.filter(tag => !tagsV3.includes(tag))

console.log('New tags', newTags)
removedTags.length && console.log('Removed tags', removedTags)

classesV4.forEach(clsv4 => {
    const clsv3 = classesV3.find(clsv3 => clsv3.tag === clsv4.tag)
    if (!clsv3) {
        return
    }


    const attrXMLNamesV4 = clsv4.attributes.map(attr => attr.xmlName)
    const attrXMLNamesV3 = clsv3.attributes.map(attr => attr.xmlName)

    const removedAttrs = attrXMLNamesV3.filter(name => !attrXMLNamesV4.includes(name))
    const newAttrs = attrXMLNamesV4.filter(name => !attrXMLNamesV3.includes(name))

    const childTagsV4 = clsv4.children.map(cld => cld.tag)
    const childTagsV3 = clsv3.children.map(cld => cld.tag)

    const removedChildren = childTagsV3.filter(tag => !childTagsV4.includes(tag))
    const newChildren = childTagsV4.filter(tag => !childTagsV3.includes(tag))

    if (removedAttrs.length || newAttrs.length || removedChildren.length || newChildren.length) {
        console.log(`Class ${clsv4.name} (${clsv4.tag})`)
        newAttrs.length && console.log('  New attributes', newAttrs)
        removedAttrs.length && console.log('  Removed attributes', removedAttrs)
        newChildren.length && console.log('  New children', newChildren)
        removedChildren.length && console.log('  Removed children', removedChildren)
    }

    clsv4.attributes.forEach(attr => {
        attr.isOnlyV4 = !attrXMLNamesV3.includes(attr.xmlName)
    })

    clsv4.children.forEach(child => {
        child.isOnlyV4 = !childTagsV3.includes(child.tag)
    })
})


rmSync('./src/baseEntities', {recursive: true, force: true})
mkdirSync('./src/baseEntities', {recursive: true})


classesV4.forEach((cls: any) => {
    const classDefinition = entityTemplate(cls)
    writeFileSync(join('src/baseEntities', `${cls.name}.ts`), classDefinition)
})

writeFileSync('src/baseEntities/index.ts', indexTemplate({tags: classesV4}))
writeFileSync('src/baseEntities/constants.ts', constantsTemplate({tags: classesV4}))
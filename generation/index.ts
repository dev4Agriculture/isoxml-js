import {readFileSync, mkdirSync, writeFileSync, rmSync} from 'fs'
import {join} from 'path'
import {compile, registerHelper} from 'handlebars'
import {ElementCompact, xml2js} from 'xml-js'

registerHelper('ifnoteq', function(arg1, arg2, options) {
    return arg1 !== arg2 ? options.fn(this) : options.inverse(this)
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

function normalizeText (text) {
    return text.toString().trim().replace(/,|\s/g, '')
}


const entityTemplate = compile(
    readFileSync('./generation/templates/Entity.hbs', 'utf-8'
))
const indexTemplate = compile(
    readFileSync('./generation/templates/index.hbs', 'utf-8'
))

function parseClassesFromFile(filename: string): any[] {
    const schema = xml2js(
        readFileSync(filename, 'utf-8'), 
        {compact: true, alwaysArray: true}
    ) as ElementCompact

    const elements = schema['xs:schema'][0]['xs:element']

    const tags = elements.map((elem: ElementCompact) => {
        const tag = elem._attributes?.name
        const name = normalizeText(elem['xs:annotation'][0]['xs:documentation'][0]._text)

        const attributes = (elem['xs:complexType'][0]['xs:attribute'] || []).map((attr: ElementCompact) => {
            try {
                const xmlName = attr._attributes?.name
                const name = attr['xs:annotation']
                    ? normalizeText(attr['xs:annotation'][0]['xs:documentation'][0]._text)
                    : xmlName

                const isOptional = attr._attributes?.use === 'optional'

                let xsdType: string

                if (attr._attributes?.type) {
                    xsdType = attr._attributes?.type as string
                } else {
                    const restrictions = 
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

                const type = XSD2TS[xsdType]
                return {xmlName, name, type, xsdType, isOptional}
            } catch (e) {
                console.log('Error parsing attribute', attr, elem)
                console.log(e)
            }
        }).filter((e: any) => e)

        let children = []

        if (elem['xs:complexType'][0]['xs:choice'] && elem['xs:complexType'][0]['xs:choice'][0]['xs:element']) {
            children = elem['xs:complexType'][0]['xs:choice'][0]['xs:element'].map((children: ElementCompact) => {
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


const tags = [
    ...parseClassesFromFile('./xsd/ISO11783_Common_V4-3.xsd'),
    ...parseClassesFromFile('./xsd/ISO11783_TaskFile_V4-3.xsd'),
    ...parseClassesFromFile('./xsd/ISO11783_LinkListFile_V4-3.xsd'),
    ...parseClassesFromFile('./xsd/ISO11783_ExternalFile_V4-3.xsd')
]

rmSync('./dist', {recursive: true, force: true})
mkdirSync('./dist/entities', {recursive: true})

tags.forEach(tag => {
    tag.children.forEach(child => {
        child.className = tags.find(tag => tag.tag === child.tag).name
        if (!child.name) {
            console.log(`Missing child name: ${tag.tag}->${child.tag}`)
            child.name = child.className
        }
    })
})

tags.forEach((tag: any) => {
    const classDefinition = entityTemplate(tag)
    writeFileSync(join('dist/entities', `${tag.name}.ts`), classDefinition)
})

writeFileSync('dist/entities/index.ts', indexTemplate({tags}))
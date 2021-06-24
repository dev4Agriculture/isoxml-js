import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription } from '../types'

export type ExternalFileReferenceAttributes = {
    Filename: string
    Filetype: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'Filename', type: 'xs:ID' },
    B: { name: 'Filetype', type: 'xs:NMTOKEN' },
}
const CHILD_TAGS = {
}

export class ExternalFileReference implements Entity {
    public tag = 'XFR'

    constructor(public attributes: ExternalFileReferenceAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, ExternalFileReference, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('XFR', ExternalFileReference)
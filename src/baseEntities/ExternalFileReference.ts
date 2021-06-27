import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type ExternalFileReferenceAttributes = {
    Filename: string
    Filetype: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'Filename', type: 'xs:ID', isPrimaryId: false },
    B: { name: 'Filetype', type: 'xs:NMTOKEN', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class ExternalFileReference implements Entity {
    public tag = TAGS.ExternalFileReference

    constructor(public attributes: ExternalFileReferenceAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ExternalFileReference): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.ExternalFileReference, ExternalFileReference)
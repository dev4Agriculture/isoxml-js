import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription } from '../types'

export type AttachedFileAttributes = {
    FilenameWithExtension: string
    Preserve: string
    ManufacturerGLN: string
    FileType: number
    FileVersion?: string
    FileLength?: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'FilenameWithExtension', type: 'xs:ID' },
    B: { name: 'Preserve', type: 'xs:NMTOKEN' },
    C: { name: 'ManufacturerGLN', type: 'xs:anyURI' },
    D: { name: 'FileType', type: 'xs:unsignedByte' },
    E: { name: 'FileVersion', type: 'xs:string' },
    F: { name: 'FileLength', type: 'xs:unsignedLong' },
}
const CHILD_TAGS = {
}

export class AttachedFile implements Entity {
    public tag = 'AFE'

    constructor(public attributes: AttachedFileAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, AttachedFile, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('AFE', AttachedFile)
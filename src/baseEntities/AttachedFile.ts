import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export const enum AttachedFilePreserveEnum {
    TaskControllerDoesNotNeedToPreserveAttachedFile = '1',
    PreserveOnTaskControllerAndSendBackToFMIS = '2',
}

export type AttachedFileAttributes = {
    FilenameWithExtension: string
    Preserve: AttachedFilePreserveEnum
    ManufacturerGLN: string
    FileType: number
    FileVersion?: string
    FileLength?: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'FilenameWithExtension', type: 'xs:ID', isPrimaryId: false },
    B: { name: 'Preserve', type: 'xs:NMTOKEN', isPrimaryId: false },
    C: { name: 'ManufacturerGLN', type: 'xs:anyURI', isPrimaryId: false },
    D: { name: 'FileType', type: 'xs:unsignedByte', isPrimaryId: false },
    E: { name: 'FileVersion', type: 'xs:string', isPrimaryId: false },
    F: { name: 'FileLength', type: 'xs:unsignedLong', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class AttachedFile implements Entity {
    public tag = TAGS.AttachedFile

    constructor(public attributes: AttachedFileAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = AttachedFile): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.AttachedFile, AttachedFile)
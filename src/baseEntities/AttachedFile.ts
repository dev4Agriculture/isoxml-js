import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export enum AttachedFilePreserveEnum {
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
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'FilenameWithExtension',
        type: 'xs:ID',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    B: {
        name: 'Preserve',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    C: {
        name: 'ManufacturerGLN',
        type: 'xs:anyURI',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    D: {
        name: 'FileType',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
        minValue: 1,
        maxValue: 254,
    },
    E: {
        name: 'FileVersion',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined,
    },
    F: {
        name: 'FileLength',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined,
        minValue: 0,
        maxValue: 4294967294,
    },
}
const CHILD_TAGS = {
}

export class AttachedFile implements Entity {
    public tag = TAGS.AttachedFile

    constructor(public attributes: AttachedFileAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = AttachedFile): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.AttachedFile, AttachedFile)
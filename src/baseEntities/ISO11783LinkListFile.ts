import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { LinkGroup } from './LinkGroup'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export enum ISO11783LinkListFileVersionMajorEnum {
    TheVersionOfTheSecondEditionPublishedAsAFinalDraftInternationalStandard = '4',
}
export enum ISO11783LinkListFileVersionMinorEnum {
    Value0 = '0',
    Value1 = '1',
    Value2 = '2',
    Value3 = '3',
}
export enum ISO11783LinkListFileDataTransferOriginEnum {
    FMIS = '1',
    MICS = '2',
}

export type ISO11783LinkListFileAttributes = {
    VersionMajor: ISO11783LinkListFileVersionMajorEnum
    VersionMinor: ISO11783LinkListFileVersionMinorEnum
    ManagementSoftwareManufacturer: string
    ManagementSoftwareVersion: string
    TaskControllerManufacturer?: string
    TaskControllerVersion?: string
    FileVersion?: string
    DataTransferOrigin: ISO11783LinkListFileDataTransferOriginEnum
    LinkGroup?: LinkGroup[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    VersionMajor: {
        name: 'VersionMajor',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    VersionMinor: {
        name: 'VersionMinor',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    ManagementSoftwareManufacturer: {
        name: 'ManagementSoftwareManufacturer',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    ManagementSoftwareVersion: {
        name: 'ManagementSoftwareVersion',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    TaskControllerManufacturer: {
        name: 'TaskControllerManufacturer',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined,
    },
    TaskControllerVersion: {
        name: 'TaskControllerVersion',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined,
    },
    FileVersion: {
        name: 'FileVersion',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined,
    },
    DataTransferOrigin: {
        name: 'DataTransferOrigin',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
}
const CHILD_TAGS = {
    LGP: { name: 'LinkGroup', isOnlyV4: undefined },
}

export class ISO11783LinkListFile implements Entity {
    public tag = TAGS.ISO11783LinkListFile

    constructor(public attributes: ISO11783LinkListFileAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = ISO11783LinkListFile): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.ISO11783LinkListFile, ISO11783LinkListFile)
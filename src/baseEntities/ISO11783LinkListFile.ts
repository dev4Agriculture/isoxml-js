import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { LinkGroup } from './LinkGroup'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type ISO11783LinkListFileAttributes = {
    VersionMajor: string
    VersionMinor: string
    ManagementSoftwareManufacturer: string
    ManagementSoftwareVersion: string
    TaskControllerManufacturer?: string
    TaskControllerVersion?: string
    FileVersion?: string
    DataTransferOrigin: string
    LinkGroup?: LinkGroup[]
}

const ATTRIBUTES: AttributesDescription = {
    VersionMajor: { name: 'VersionMajor', type: 'xs:NMTOKEN', isPrimaryId: false },
    VersionMinor: { name: 'VersionMinor', type: 'xs:NMTOKEN', isPrimaryId: false },
    ManagementSoftwareManufacturer: { name: 'ManagementSoftwareManufacturer', type: 'xs:string', isPrimaryId: false },
    ManagementSoftwareVersion: { name: 'ManagementSoftwareVersion', type: 'xs:string', isPrimaryId: false },
    TaskControllerManufacturer: { name: 'TaskControllerManufacturer', type: 'xs:string', isPrimaryId: false },
    TaskControllerVersion: { name: 'TaskControllerVersion', type: 'xs:string', isPrimaryId: false },
    FileVersion: { name: 'FileVersion', type: 'xs:string', isPrimaryId: false },
    DataTransferOrigin: { name: 'DataTransferOrigin', type: 'xs:NMTOKEN', isPrimaryId: false },
}
const CHILD_TAGS = {
    LGP: { name: 'LinkGroup' },
}

export class ISO11783LinkListFile implements Entity {
    public tag = TAGS.ISO11783LinkListFile

    constructor(public attributes: ISO11783LinkListFileAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ISO11783LinkListFile): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.ISO11783LinkListFile, ISO11783LinkListFile)
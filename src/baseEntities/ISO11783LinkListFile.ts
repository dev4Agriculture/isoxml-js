import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { LinkGroup } from './LinkGroup'

import { Entity, AttributesDescription } from '../types'

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
    VersionMajor: { name: 'VersionMajor', type: 'xs:NMTOKEN' },
    VersionMinor: { name: 'VersionMinor', type: 'xs:NMTOKEN' },
    ManagementSoftwareManufacturer: { name: 'ManagementSoftwareManufacturer', type: 'xs:string' },
    ManagementSoftwareVersion: { name: 'ManagementSoftwareVersion', type: 'xs:string' },
    TaskControllerManufacturer: { name: 'TaskControllerManufacturer', type: 'xs:string' },
    TaskControllerVersion: { name: 'TaskControllerVersion', type: 'xs:string' },
    FileVersion: { name: 'FileVersion', type: 'xs:string' },
    DataTransferOrigin: { name: 'DataTransferOrigin', type: 'xs:NMTOKEN' },
}
const CHILD_TAGS = {
    LGP: { name: 'LinkGroup' },
}

export class ISO11783LinkListFile implements Entity {
    public tag = 'ISO11783LinkList'

    constructor(public attributes: ISO11783LinkListFileAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, ISO11783LinkListFile, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('ISO11783LinkList', ISO11783LinkListFile)
import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type TaskControllerCapabilitiesAttributes = {
    TaskControllerControlFunctionNAME: string
    TaskControllerDesignator: string
    VersionNumber: string
    ProvidedCapabilities: number
    NumberOfBoomsSectionControl: number
    NumberOfSectionsSectionControl: number
    NumberOfControlChannels: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'TaskControllerControlFunctionNAME', type: 'xs:hexBinary', isPrimaryId: false },
    B: { name: 'TaskControllerDesignator', type: 'xs:string', isPrimaryId: false },
    C: { name: 'VersionNumber', type: 'xs:NMTOKEN', isPrimaryId: false },
    D: { name: 'ProvidedCapabilities', type: 'xs:unsignedByte', isPrimaryId: false },
    E: { name: 'NumberOfBoomsSectionControl', type: 'xs:unsignedByte', isPrimaryId: false },
    F: { name: 'NumberOfSectionsSectionControl', type: 'xs:unsignedByte', isPrimaryId: false },
    G: { name: 'NumberOfControlChannels', type: 'xs:unsignedByte', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class TaskControllerCapabilities implements Entity {
    public tag = 'TCC'

    constructor(public attributes: TaskControllerCapabilitiesAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = TaskControllerCapabilities): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('TCC', TaskControllerCapabilities)
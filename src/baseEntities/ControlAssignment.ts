import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { AllocationStamp } from './AllocationStamp'

import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type ControlAssignmentAttributes = {
    SourceClientNAME: string
    UserClientNAME: string
    SourceDeviceStructureLabel: string
    UserDeviceStructureLabel: string
    SourceDeviceElementNumber: number
    UserDeviceElementNumber: number
    ProcessDataDDI: string
    AllocationStamp?: AllocationStamp[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'SourceClientNAME',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    B: {
        name: 'UserClientNAME',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    C: {
        name: 'SourceDeviceStructureLabel',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    D: {
        name: 'UserDeviceStructureLabel',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    E: {
        name: 'SourceDeviceElementNumber',
        type: 'xs:unsignedShort',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
        minValue: 0,
        maxValue: 4095,
    },
    F: {
        name: 'UserDeviceElementNumber',
        type: 'xs:unsignedShort',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
        minValue: 0,
        maxValue: 4095,
    },
    G: {
        name: 'ProcessDataDDI',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp', isOnlyV4: undefined },
}

export class ControlAssignment implements Entity {
    public tag = TAGS.ControlAssignment

    constructor(public attributes: ControlAssignmentAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = ControlAssignment): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.ControlAssignment, ControlAssignment)
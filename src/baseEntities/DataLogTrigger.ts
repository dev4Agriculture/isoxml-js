import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'


import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type DataLogTriggerAttributes = {
    DataLogDDI: string
    DataLogMethod: number
    DataLogDistanceInterval?: number
    DataLogTimeInterval?: number
    DataLogThresholdMinimum?: number
    DataLogThresholdMaximum?: number
    DataLogThresholdChange?: number
    DeviceElementIdRef?: ISOXMLReference
    ValuePresentationIdRef?: ISOXMLReference
    DataLogPGN?: number
    DataLogPGNStartBit?: number
    DataLogPGNStopBit?: number
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'DataLogDDI',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'DataLogMethod',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 1,
        maxValue: 31,
    },
    C: {
        name: 'DataLogDistanceInterval',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 1000000,
    },
    D: {
        name: 'DataLogTimeInterval',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 60000,
    },
    E: {
        name: 'DataLogThresholdMinimum',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: -2147483647,
        maxValue: 2147483647,
    },
    F: {
        name: 'DataLogThresholdMaximum',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: -2147483647,
        maxValue: 2147483647,
    },
    G: {
        name: 'DataLogThresholdChange',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: -2147483647,
        maxValue: 2147483647,
    },
    H: {
        name: 'DeviceElementIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    I: {
        name: 'ValuePresentationIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    J: {
        name: 'DataLogPGN',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 262143,
    },
    K: {
        name: 'DataLogPGNStartBit',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 63,
    },
    L: {
        name: 'DataLogPGNStopBit',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 63,
    },
}
const CHILD_TAGS = {
}

export class DataLogTrigger implements Entity {
    public tag = TAGS.DataLogTrigger

    constructor(public attributes: DataLogTriggerAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = DataLogTrigger): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.DataLogTrigger, DataLogTrigger)
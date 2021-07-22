import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

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
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'DataLogDDI', type: 'xs:hexBinary', isPrimaryId: false, isOnlyV4: false },
    B: { name: 'DataLogMethod', type: 'xs:unsignedByte', isPrimaryId: false, isOnlyV4: false },
    C: { name: 'DataLogDistanceInterval', type: 'xs:long', isPrimaryId: false, isOnlyV4: false },
    D: { name: 'DataLogTimeInterval', type: 'xs:long', isPrimaryId: false, isOnlyV4: false },
    E: { name: 'DataLogThresholdMinimum', type: 'xs:long', isPrimaryId: false, isOnlyV4: false },
    F: { name: 'DataLogThresholdMaximum', type: 'xs:long', isPrimaryId: false, isOnlyV4: false },
    G: { name: 'DataLogThresholdChange', type: 'xs:long', isPrimaryId: false, isOnlyV4: false },
    H: { name: 'DeviceElementIdRef', type: 'xs:IDREF', isPrimaryId: false, isOnlyV4: false },
    I: { name: 'ValuePresentationIdRef', type: 'xs:IDREF', isPrimaryId: false, isOnlyV4: false },
    J: { name: 'DataLogPGN', type: 'xs:unsignedLong', isPrimaryId: false, isOnlyV4: false },
    K: { name: 'DataLogPGNStartBit', type: 'xs:unsignedByte', isPrimaryId: false, isOnlyV4: false },
    L: { name: 'DataLogPGNStopBit', type: 'xs:unsignedByte', isPrimaryId: false, isOnlyV4: false },
}
const CHILD_TAGS = {
}

export class DataLogTrigger implements Entity {
    public tag = TAGS.DataLogTrigger

    constructor(public attributes: DataLogTriggerAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = DataLogTrigger): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.DataLogTrigger, DataLogTrigger)
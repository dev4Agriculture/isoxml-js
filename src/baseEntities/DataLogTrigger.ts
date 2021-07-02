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
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'DataLogDDI', type: 'xs:hexBinary', isPrimaryId: false },
    B: { name: 'DataLogMethod', type: 'xs:unsignedByte', isPrimaryId: false },
    C: { name: 'DataLogDistanceInterval', type: 'xs:long', isPrimaryId: false },
    D: { name: 'DataLogTimeInterval', type: 'xs:long', isPrimaryId: false },
    E: { name: 'DataLogThresholdMinimum', type: 'xs:long', isPrimaryId: false },
    F: { name: 'DataLogThresholdMaximum', type: 'xs:long', isPrimaryId: false },
    G: { name: 'DataLogThresholdChange', type: 'xs:long', isPrimaryId: false },
    H: { name: 'DeviceElementIdRef', type: 'xs:IDREF', isPrimaryId: false },
    I: { name: 'ValuePresentationIdRef', type: 'xs:IDREF', isPrimaryId: false },
    J: { name: 'DataLogPGN', type: 'xs:unsignedLong', isPrimaryId: false },
    K: { name: 'DataLogPGNStartBit', type: 'xs:unsignedByte', isPrimaryId: false },
    L: { name: 'DataLogPGNStopBit', type: 'xs:unsignedByte', isPrimaryId: false },
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
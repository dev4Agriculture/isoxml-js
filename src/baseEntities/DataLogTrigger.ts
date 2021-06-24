import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

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
    A: { name: 'DataLogDDI', type: 'xs:hexBinary' },
    B: { name: 'DataLogMethod', type: 'xs:unsignedByte' },
    C: { name: 'DataLogDistanceInterval', type: 'xs:long' },
    D: { name: 'DataLogTimeInterval', type: 'xs:long' },
    E: { name: 'DataLogThresholdMinimum', type: 'xs:long' },
    F: { name: 'DataLogThresholdMaximum', type: 'xs:long' },
    G: { name: 'DataLogThresholdChange', type: 'xs:long' },
    H: { name: 'DeviceElementIdRef', type: 'xs:IDREF' },
    I: { name: 'ValuePresentationIdRef', type: 'xs:IDREF' },
    J: { name: 'DataLogPGN', type: 'xs:unsignedLong' },
    K: { name: 'DataLogPGNStartBit', type: 'xs:unsignedByte' },
    L: { name: 'DataLogPGNStopBit', type: 'xs:unsignedByte' },
}
const CHILD_TAGS = {
}

export class DataLogTrigger implements Entity {
    public tag = 'DLT'

    constructor(public attributes: DataLogTriggerAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, DataLogTrigger, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('DLT', DataLogTrigger)
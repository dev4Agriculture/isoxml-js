import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

export type DataLogValueAttributes = {
    ProcessDataDDI: string
    ProcessDataValue: number
    DeviceElementIdRef: ISOXMLReference
    DataLogPGN?: number
    DataLogPGNStartBit?: number
    DataLogPGNStopBit?: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ProcessDataDDI', type: 'xs:hexBinary' },
    B: { name: 'ProcessDataValue', type: 'xs:long' },
    C: { name: 'DeviceElementIdRef', type: 'xs:IDREF' },
    D: { name: 'DataLogPGN', type: 'xs:unsignedLong' },
    E: { name: 'DataLogPGNStartBit', type: 'xs:unsignedByte' },
    F: { name: 'DataLogPGNStopBit', type: 'xs:unsignedByte' },
}
const CHILD_TAGS = {
}

export class DataLogValue implements Entity {
    public tag = 'DLV'

    constructor(public attributes: DataLogValueAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, DataLogValue, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('DLV', DataLogValue)
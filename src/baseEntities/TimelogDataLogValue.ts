import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'


import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type TimelogDataLogValueAttributes = {
    ProcessDataDDI: string
    ProcessDataValue: string
    DeviceElementIdRef: ISOXMLReference
    DataLogPGN?: number
    DataLogPGNStartBit?: number
    DataLogPGNStopBit?: number
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'ProcessDataDDI',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'ProcessDataValue',
        type: 'emptyString',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    C: {
        name: 'DeviceElementIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    D: {
        name: 'DataLogPGN',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 262143,
    },
    E: {
        name: 'DataLogPGNStartBit',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 63,
    },
    F: {
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

export class TimelogDataLogValue implements Entity {
    public tag = TAGS.DataLogValue

    constructor(public attributes: TimelogDataLogValueAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = TimelogDataLogValue): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('timelog', TAGS.DataLogValue, TimelogDataLogValue)
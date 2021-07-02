import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export const enum PositionPositionStatusEnum {
    NoGPSFix = '0',
    GNSSFix = '1',
    DGNSSFix = '2',
    PreciseGNSS = '3',
    RTKFixedInteger = '4',
    RTKFloat = '5',
    EstDRMode = '6',
    ManualInput = '7',
    SimulateMode = '8',
    Reserved9 = '9',
    Reserved10 = '10',
    Reserved11 = '11',
    Reserved12 = '12',
    Reserved13 = '13',
    Error = '14',
    PositionStatusValueIsNotAvailable = '15',
}

export type PositionAttributes = {
    PositionNorth: number
    PositionEast: number
    PositionUp?: number
    PositionStatus: PositionPositionStatusEnum
    PDOP?: number
    HDOP?: number
    NumberOfSatellites?: number
    GpsUtcTime?: number
    GpsUtcDate?: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'PositionNorth', type: 'xs:decimal', isPrimaryId: false },
    B: { name: 'PositionEast', type: 'xs:decimal', isPrimaryId: false },
    C: { name: 'PositionUp', type: 'xs:long', isPrimaryId: false },
    D: { name: 'PositionStatus', type: 'xs:NMTOKEN', isPrimaryId: false },
    E: { name: 'PDOP', type: 'xs:decimal', isPrimaryId: false },
    F: { name: 'HDOP', type: 'xs:decimal', isPrimaryId: false },
    G: { name: 'NumberOfSatellites', type: 'xs:unsignedByte', isPrimaryId: false },
    H: { name: 'GpsUtcTime', type: 'xs:unsignedLong', isPrimaryId: false },
    I: { name: 'GpsUtcDate', type: 'xs:unsignedShort', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class Position implements Entity {
    public tag = TAGS.Position

    constructor(public attributes: PositionAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Position): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Position, Position)
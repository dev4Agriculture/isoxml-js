import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type PositionAttributes = {
    PositionNorth: number
    PositionEast: number
    PositionUp?: number
    PositionStatus: string
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
    public tag = 'PTN'

    constructor(public attributes: PositionAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Position): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('PTN', Position)
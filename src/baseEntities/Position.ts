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
    A: { name: 'PositionNorth', type: 'xs:decimal' },
    B: { name: 'PositionEast', type: 'xs:decimal' },
    C: { name: 'PositionUp', type: 'xs:long' },
    D: { name: 'PositionStatus', type: 'xs:NMTOKEN' },
    E: { name: 'PDOP', type: 'xs:decimal' },
    F: { name: 'HDOP', type: 'xs:decimal' },
    G: { name: 'NumberOfSatellites', type: 'xs:unsignedByte' },
    H: { name: 'GpsUtcTime', type: 'xs:unsignedLong' },
    I: { name: 'GpsUtcDate', type: 'xs:unsignedShort' },
}
const CHILD_TAGS = {
}

export class Position implements Entity {
    public tag = 'PTN'

    constructor(public attributes: PositionAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Position): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('PTN', Position)
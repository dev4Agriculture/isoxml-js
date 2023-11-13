import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'


import { Entity, EntityConstructor, AttributesDescription } from '../types'

export const enum TimelogPositionPositionStatusEnum {
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

export type TimelogPositionAttributes = {
    PositionNorth: number
    PositionEast: number
    PositionUp?: number
    PositionStatus: TimelogPositionPositionStatusEnum
    PDOP?: number
    HDOP?: number
    NumberOfSatellites?: number
    GpsUtcTime?: number
    GpsUtcDate?: number
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'PositionNorth',
        type: 'xs:decimal',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: -90,
        maxValue: 90,
        fractionDigits: 9,
        allowEmptyString: true,
    },
    B: {
        name: 'PositionEast',
        type: 'xs:decimal',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: -180,
        maxValue: 180,
        fractionDigits: 9,
        allowEmptyString: true,
    },
    C: {
        name: 'PositionUp',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: -2147483648,
        maxValue: 2147483647,
        allowEmptyString: true,
    },
    D: {
        name: 'PositionStatus',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        allowEmptyString: true,
    },
    E: {
        name: 'PDOP',
        type: 'xs:decimal',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 99.9,
        allowEmptyString: true,
    },
    F: {
        name: 'HDOP',
        type: 'xs:decimal',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 99.9,
        allowEmptyString: true,
    },
    G: {
        name: 'NumberOfSatellites',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 254,
        allowEmptyString: true,
    },
    H: {
        name: 'GpsUtcTime',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 4294967294,
        allowEmptyString: true,
    },
    I: {
        name: 'GpsUtcDate',
        type: 'xs:unsignedShort',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 65534,
        allowEmptyString: true,
    },
}
const CHILD_TAGS = {
}

export class TimelogPosition implements Entity {
    public tag = TAGS.Position

    constructor(public attributes: TimelogPositionAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = TimelogPosition): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('timelog', TAGS.Position, TimelogPosition)
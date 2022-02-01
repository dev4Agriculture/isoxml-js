import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { LineString } from './LineString'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export enum PolygonPolygonTypeEnum {
    PartfieldBoundary = '1',
    TreatmentZone = '2',
    WaterSurface = '3',
    Building = '4',
    Road = '5',
    Obstacle = '6',
    Flag = '7',
    Other = '8',
    Mainfield = '9',
    Headland = '10',
    BufferZone = '11',
    Windbreak = '12',
}

export type PolygonAttributes = {
    PolygonType: PolygonPolygonTypeEnum
    PolygonDesignator?: string
    PolygonArea?: number
    PolygonColour?: number
    LineString?: LineString[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'PolygonType',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'PolygonDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    C: {
        name: 'PolygonArea',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 4294967294,
    },
    D: {
        name: 'PolygonColour',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 254,
    },
    E: {
        name: 'PolygonId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: true,
        isOnlyV4: true,
    },
}
const CHILD_TAGS = {
    LSG: { name: 'LineString', isOnlyV4: false },
}

export class Polygon implements Entity {
    public tag = TAGS.Polygon

    constructor(public attributes: PolygonAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = Polygon): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.Polygon, Polygon)
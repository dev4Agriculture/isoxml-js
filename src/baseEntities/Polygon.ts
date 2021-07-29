import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { LineString } from './LineString'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export const enum PolygonPolygonTypeEnum {
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
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'PolygonType',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false
    },
    B: {
        name: 'PolygonDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false
    },
    C: {
        name: 'PolygonArea',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false
    },
    D: {
        name: 'PolygonColour',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false
    },
    E: {
        name: 'PolygonId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: true,
        isOnlyV4: true
    },
}
const CHILD_TAGS = {
    LSG: { name: 'LineString', isOnlyV4: false },
}

export class Polygon implements Entity {
    public tag = TAGS.Polygon

    constructor(public attributes: PolygonAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = Polygon): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Polygon, Polygon)
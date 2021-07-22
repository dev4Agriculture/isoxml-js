import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { Point } from './Point'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export const enum LineStringLineStringTypeEnum {
    PolygonExterior = '1',
    PolygonInterior = '2',
    TramLine = '3',
    SamplingRoute = '4',
    GuidancePattern = '5',
    Drainage = '6',
    Fence = '7',
    Flag = '8',
    Obstacle = '9',
}

export type LineStringAttributes = {
    LineStringType: LineStringLineStringTypeEnum
    LineStringDesignator?: string
    LineStringWidth?: number
    LineStringLength?: number
    LineStringColour?: number
    Point?: Point[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'LineStringType', type: 'xs:NMTOKEN', isPrimaryId: false, isOnlyV4: false },
    B: { name: 'LineStringDesignator', type: 'xs:string', isPrimaryId: false, isOnlyV4: false },
    C: { name: 'LineStringWidth', type: 'xs:unsignedLong', isPrimaryId: false, isOnlyV4: false },
    D: { name: 'LineStringLength', type: 'xs:unsignedLong', isPrimaryId: false, isOnlyV4: false },
    E: { name: 'LineStringColour', type: 'xs:unsignedByte', isPrimaryId: false, isOnlyV4: false },
    F: { name: 'LineStringId', type: 'xs:ID', isPrimaryId: true, isOnlyV4: true },
}
const CHILD_TAGS = {
    PNT: { name: 'Point', isOnlyV4: false },
}

export class LineString implements Entity {
    public tag = TAGS.LineString

    constructor(public attributes: LineStringAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = LineString): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.LineString, LineString)
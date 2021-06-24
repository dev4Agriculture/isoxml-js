import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type PointAttributes = {
    PointType: string
    PointDesignator?: string
    PointNorth: number
    PointEast: number
    PointUp?: number
    PointColour?: number
    PointId?: string
    PointHorizontalAccuracy?: number
    PointVerticalAccuracy?: number
    Filename?: string
    Filelength?: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'PointType', type: 'xs:NMTOKEN' },
    B: { name: 'PointDesignator', type: 'xs:string' },
    C: { name: 'PointNorth', type: 'xs:decimal' },
    D: { name: 'PointEast', type: 'xs:decimal' },
    E: { name: 'PointUp', type: 'xs:long' },
    F: { name: 'PointColour', type: 'xs:unsignedByte' },
    G: { name: 'PointId', type: 'xs:ID' },
    H: { name: 'PointHorizontalAccuracy', type: 'xs:decimal' },
    I: { name: 'PointVerticalAccuracy', type: 'xs:decimal' },
    J: { name: 'Filename', type: 'xs:string' },
    K: { name: 'Filelength', type: 'xs:unsignedLong' },
}
const CHILD_TAGS = {
}

export class Point implements Entity {
    public tag = 'PNT'

    constructor(public attributes: PointAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Point): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('PNT', Point)
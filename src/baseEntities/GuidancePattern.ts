import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { LineString } from './LineString'
import { Polygon } from './Polygon'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type GuidancePatternAttributes = {
    GuidancePatternDesignator?: string
    GuidancePatternType: string
    GuidancePatternOptions?: string
    GuidancePatternPropagationDirection?: string
    GuidancePatternExtension?: string
    GuidancePatternHeading?: number
    GuidancePatternRadius?: number
    GuidancePatternGNSSMethod?: string
    GuidancePatternHorizontalAccuracy?: number
    GuidancePatternVerticalAccuracy?: number
    BaseStationIdRef?: ISOXMLReference
    OriginalSRID?: string
    NumberOfSwathsLeft?: number
    NumberOfSwathsRight?: number
    LineString?: LineString[]
    BoundaryPolygon?: Polygon[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'GuidancePatternId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'GuidancePatternDesignator', type: 'xs:string', isPrimaryId: false },
    C: { name: 'GuidancePatternType', type: 'xs:NMTOKEN', isPrimaryId: false },
    D: { name: 'GuidancePatternOptions', type: 'xs:NMTOKEN', isPrimaryId: false },
    E: { name: 'GuidancePatternPropagationDirection', type: 'xs:NMTOKEN', isPrimaryId: false },
    F: { name: 'GuidancePatternExtension', type: 'xs:NMTOKEN', isPrimaryId: false },
    G: { name: 'GuidancePatternHeading', type: 'xs:decimal', isPrimaryId: false },
    H: { name: 'GuidancePatternRadius', type: 'xs:unsignedLong', isPrimaryId: false },
    I: { name: 'GuidancePatternGNSSMethod', type: 'xs:NMTOKEN', isPrimaryId: false },
    J: { name: 'GuidancePatternHorizontalAccuracy', type: 'xs:decimal', isPrimaryId: false },
    K: { name: 'GuidancePatternVerticalAccuracy', type: 'xs:decimal', isPrimaryId: false },
    L: { name: 'BaseStationIdRef', type: 'xs:IDREF', isPrimaryId: false },
    M: { name: 'OriginalSRID', type: 'xs:string', isPrimaryId: false },
    N: { name: 'NumberOfSwathsLeft', type: 'xs:unsignedLong', isPrimaryId: false },
    O: { name: 'NumberOfSwathsRight', type: 'xs:unsignedLong', isPrimaryId: false },
}
const CHILD_TAGS = {
    LSG: { name: 'LineString' },
    PLN: { name: 'BoundaryPolygon' },
}

export class GuidancePattern implements Entity {
    public tag = TAGS.GuidancePattern

    constructor(public attributes: GuidancePatternAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = GuidancePattern): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.GuidancePattern, GuidancePattern)
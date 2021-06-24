import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { LineString } from './LineString'
import { Polygon } from './Polygon'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type GuidancePatternAttributes = {
    GuidancePatternId: string
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
    A: { name: 'GuidancePatternId', type: 'xs:ID' },
    B: { name: 'GuidancePatternDesignator', type: 'xs:string' },
    C: { name: 'GuidancePatternType', type: 'xs:NMTOKEN' },
    D: { name: 'GuidancePatternOptions', type: 'xs:NMTOKEN' },
    E: { name: 'GuidancePatternPropagationDirection', type: 'xs:NMTOKEN' },
    F: { name: 'GuidancePatternExtension', type: 'xs:NMTOKEN' },
    G: { name: 'GuidancePatternHeading', type: 'xs:decimal' },
    H: { name: 'GuidancePatternRadius', type: 'xs:unsignedLong' },
    I: { name: 'GuidancePatternGNSSMethod', type: 'xs:NMTOKEN' },
    J: { name: 'GuidancePatternHorizontalAccuracy', type: 'xs:decimal' },
    K: { name: 'GuidancePatternVerticalAccuracy', type: 'xs:decimal' },
    L: { name: 'BaseStationIdRef', type: 'xs:IDREF' },
    M: { name: 'OriginalSRID', type: 'xs:string' },
    N: { name: 'NumberOfSwathsLeft', type: 'xs:unsignedLong' },
    O: { name: 'NumberOfSwathsRight', type: 'xs:unsignedLong' },
}
const CHILD_TAGS = {
    LSG: { name: 'LineString' },
    PLN: { name: 'BoundaryPolygon' },
}

export class GuidancePattern implements Entity {
    public tag = 'GPN'

    constructor(public attributes: GuidancePatternAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = GuidancePattern): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('GPN', GuidancePattern)
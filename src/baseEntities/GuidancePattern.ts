import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { LineString } from './LineString'
import { Polygon } from './Polygon'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export enum GuidancePatternGuidancePatternTypeEnum {
    AB = '1',
    A = '2',
    Curve = '3',
    Pivot = '4',
    Spiral = '5',
}
export enum GuidancePatternGuidancePatternOptionsEnum {
    ClockwiseForPivot = '1',
    CounterClockwiseForPivot = '2',
    FullCircleForPivot = '3',
}
export enum GuidancePatternGuidancePatternPropagationDirectionEnum {
    BothDirections = '1',
    LeftDirectionOnly = '2',
    RightDirectionOnly = '3',
    NoPropagation = '4',
}
export enum GuidancePatternGuidancePatternExtensionEnum {
    FromBothFirstAndLastPoint = '1',
    FromFirstPointAOnly = '2',
    FromLastPointBOnly = '3',
    NoExtensions = '4',
}
export enum GuidancePatternGuidancePatternGNSSMethodEnum {
    NoGPSFix = '0',
    GNSSFix = '1',
    DGNSSFix = '2',
    PreciseGNSS = '3',
    RTKFixedInteger = '4',
    RTKFloat = '5',
    EstDRMode = '6',
    ManualInput = '7',
    SimulateMode = '8',
    DesktopGeneratedData = '16',
    Other = '17',
}

export type GuidancePatternAttributes = {
    GuidancePatternDesignator?: string
    GuidancePatternType: GuidancePatternGuidancePatternTypeEnum
    GuidancePatternOptions?: GuidancePatternGuidancePatternOptionsEnum
    GuidancePatternPropagationDirection?: GuidancePatternGuidancePatternPropagationDirectionEnum
    GuidancePatternExtension?: GuidancePatternGuidancePatternExtensionEnum
    GuidancePatternHeading?: number
    GuidancePatternRadius?: number
    GuidancePatternGNSSMethod?: GuidancePatternGuidancePatternGNSSMethodEnum
    GuidancePatternHorizontalAccuracy?: number
    GuidancePatternVerticalAccuracy?: number
    BaseStationIdRef?: ISOXMLReference
    OriginalSRID?: string
    NumberOfSwathsLeft?: number
    NumberOfSwathsRight?: number
    LineString?: LineString[]
    BoundaryPolygon?: Polygon[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'GuidancePatternId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: false,
        isOnlyV4: undefined
    },
    B: {
        name: 'GuidancePatternDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined
    },
    C: {
        name: 'GuidancePatternType',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined
    },
    D: {
        name: 'GuidancePatternOptions',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined
    },
    E: {
        name: 'GuidancePatternPropagationDirection',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined
    },
    F: {
        name: 'GuidancePatternExtension',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined
    },
    G: {
        name: 'GuidancePatternHeading',
        type: 'xs:decimal',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined
    },
    H: {
        name: 'GuidancePatternRadius',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined
    },
    I: {
        name: 'GuidancePatternGNSSMethod',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined
    },
    J: {
        name: 'GuidancePatternHorizontalAccuracy',
        type: 'xs:decimal',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined
    },
    K: {
        name: 'GuidancePatternVerticalAccuracy',
        type: 'xs:decimal',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined
    },
    L: {
        name: 'BaseStationIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined
    },
    M: {
        name: 'OriginalSRID',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined
    },
    N: {
        name: 'NumberOfSwathsLeft',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined
    },
    O: {
        name: 'NumberOfSwathsRight',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined
    },
}
const CHILD_TAGS = {
    LSG: { name: 'LineString', isOnlyV4: undefined },
    PLN: { name: 'BoundaryPolygon', isOnlyV4: undefined },
}

export class GuidancePattern implements Entity {
    public tag = TAGS.GuidancePattern

    constructor(public attributes: GuidancePatternAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = GuidancePattern): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.GuidancePattern, GuidancePattern)
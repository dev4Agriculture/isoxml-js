import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { Polygon } from './Polygon'
import { LineString } from './LineString'
import { Point } from './Point'
import { GuidanceGroup } from './GuidanceGroup'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type PartfieldAttributes = {
    PartfieldCode?: string
    PartfieldDesignator: string
    PartfieldArea: number
    CustomerIdRef?: ISOXMLReference
    FarmIdRef?: ISOXMLReference
    CropTypeIdRef?: ISOXMLReference
    CropVarietyIdRef?: ISOXMLReference
    FieldIdRef?: ISOXMLReference
    PolygonnonTreatmentZoneonly?: Polygon[]
    LineString?: LineString[]
    Point?: Point[]
    GuidanceGroup?: GuidanceGroup[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'PartfieldId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'PartfieldCode',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    C: {
        name: 'PartfieldDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    D: {
        name: 'PartfieldArea',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 4294967294,
    },
    E: {
        name: 'CustomerIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    F: {
        name: 'FarmIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    G: {
        name: 'CropTypeIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    H: {
        name: 'CropVarietyIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    I: {
        name: 'FieldIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
}
const CHILD_TAGS = {
    PLN: { name: 'PolygonnonTreatmentZoneonly', isOnlyV4: false },
    LSG: { name: 'LineString', isOnlyV4: false },
    PNT: { name: 'Point', isOnlyV4: false },
    GGP: { name: 'GuidanceGroup', isOnlyV4: true },
}

export class Partfield implements Entity {
    public tag = TAGS.Partfield

    constructor(public attributes: PartfieldAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = Partfield): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Partfield, Partfield)
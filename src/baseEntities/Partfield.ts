import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
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
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'PartfieldId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'PartfieldCode', type: 'xs:string', isPrimaryId: false },
    C: { name: 'PartfieldDesignator', type: 'xs:string', isPrimaryId: false },
    D: { name: 'PartfieldArea', type: 'xs:unsignedLong', isPrimaryId: false },
    E: { name: 'CustomerIdRef', type: 'xs:IDREF', isPrimaryId: false },
    F: { name: 'FarmIdRef', type: 'xs:IDREF', isPrimaryId: false },
    G: { name: 'CropTypeIdRef', type: 'xs:IDREF', isPrimaryId: false },
    H: { name: 'CropVarietyIdRef', type: 'xs:IDREF', isPrimaryId: false },
    I: { name: 'FieldIdRef', type: 'xs:IDREF', isPrimaryId: false },
}
const CHILD_TAGS = {
    PLN: { name: 'PolygonnonTreatmentZoneonly' },
    LSG: { name: 'LineString' },
    PNT: { name: 'Point' },
    GGP: { name: 'GuidanceGroup' },
}

export class Partfield implements Entity {
    public tag = TAGS.Partfield

    constructor(public attributes: PartfieldAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Partfield): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Partfield, Partfield)
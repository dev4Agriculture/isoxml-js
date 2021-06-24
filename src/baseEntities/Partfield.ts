import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { Polygon } from './Polygon'
import { LineString } from './LineString'
import { Point } from './Point'
import { GuidanceGroup } from './GuidanceGroup'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type PartfieldAttributes = {
    PartfieldId: string
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
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'PartfieldId', type: 'xs:ID' },
    B: { name: 'PartfieldCode', type: 'xs:string' },
    C: { name: 'PartfieldDesignator', type: 'xs:string' },
    D: { name: 'PartfieldArea', type: 'xs:unsignedLong' },
    E: { name: 'CustomerIdRef', type: 'xs:IDREF' },
    F: { name: 'FarmIdRef', type: 'xs:IDREF' },
    G: { name: 'CropTypeIdRef', type: 'xs:IDREF' },
    H: { name: 'CropVarietyIdRef', type: 'xs:IDREF' },
    I: { name: 'FieldIdRef', type: 'xs:IDREF' },
}
const CHILD_TAGS = {
    PLN: { name: 'PolygonnonTreatmentZoneonly' },
    LSG: { name: 'LineString' },
    PNT: { name: 'Point' },
    GGP: { name: 'GuidanceGroup' },
}

export class Partfield implements Entity {
    public tag = 'PFD'

    constructor(public attributes: PartfieldAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Partfield): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('PFD', Partfield)
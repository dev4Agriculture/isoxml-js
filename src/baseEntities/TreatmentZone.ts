import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { Polygon } from './Polygon'
import { ProcessDataVariable } from './ProcessDataVariable'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type TreatmentZoneAttributes = {
    TreatmentZoneCode: number
    TreatmentZoneDesignator?: string
    TreatmentZoneColour?: number
    PolygonTreatmentZoneonly?: Polygon[]
    ProcessDataVariable?: ProcessDataVariable[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'TreatmentZoneCode', type: 'xs:unsignedByte', isPrimaryId: false },
    B: { name: 'TreatmentZoneDesignator', type: 'xs:string', isPrimaryId: false },
    C: { name: 'TreatmentZoneColour', type: 'xs:unsignedByte', isPrimaryId: false },
}
const CHILD_TAGS = {
    PLN: { name: 'PolygonTreatmentZoneonly' },
    PDV: { name: 'ProcessDataVariable' },
}

export class TreatmentZone implements Entity {
    public tag = TAGS.TreatmentZone

    constructor(public attributes: TreatmentZoneAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = TreatmentZone): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.TreatmentZone, TreatmentZone)
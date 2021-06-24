import { ElementCompact } from 'xml-js'

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
    A: { name: 'TreatmentZoneCode', type: 'xs:unsignedByte' },
    B: { name: 'TreatmentZoneDesignator', type: 'xs:string' },
    C: { name: 'TreatmentZoneColour', type: 'xs:unsignedByte' },
}
const CHILD_TAGS = {
    PLN: { name: 'PolygonTreatmentZoneonly' },
    PDV: { name: 'ProcessDataVariable' },
}

export class TreatmentZone implements Entity {
    public tag = 'TZN'

    constructor(public attributes: TreatmentZoneAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = TreatmentZone): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('TZN', TreatmentZone)
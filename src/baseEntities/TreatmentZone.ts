import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { Polygon } from './Polygon'
import { ProcessDataVariable } from './ProcessDataVariable'

import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type TreatmentZoneAttributes = {
    TreatmentZoneCode: number
    TreatmentZoneDesignator?: string
    TreatmentZoneColour?: number
    PolygonTreatmentZoneonly?: Polygon[]
    ProcessDataVariable?: ProcessDataVariable[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'TreatmentZoneCode',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 254,
    },
    B: {
        name: 'TreatmentZoneDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    C: {
        name: 'TreatmentZoneColour',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 254,
    },
}
const CHILD_TAGS = {
    PLN: { name: 'PolygonTreatmentZoneonly', isOnlyV4: false },
    PDV: { name: 'ProcessDataVariable', isOnlyV4: false },
}

export class TreatmentZone implements Entity {
    public tag = TAGS.TreatmentZone

    constructor(public attributes: TreatmentZoneAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = TreatmentZone): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.TreatmentZone, TreatmentZone)
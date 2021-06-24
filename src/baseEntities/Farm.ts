import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type FarmAttributes = {
    FarmId: string
    FarmDesignator: string
    FarmStreet?: string
    FarmPOBox?: string
    FarmPostalCode?: string
    FarmCity?: string
    FarmState?: string
    FarmCountry?: string
    CustomerIdRef?: ISOXMLReference
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'FarmId', type: 'xs:ID' },
    B: { name: 'FarmDesignator', type: 'xs:string' },
    C: { name: 'FarmStreet', type: 'xs:string' },
    D: { name: 'FarmPOBox', type: 'xs:string' },
    E: { name: 'FarmPostalCode', type: 'xs:string' },
    F: { name: 'FarmCity', type: 'xs:string' },
    G: { name: 'FarmState', type: 'xs:string' },
    H: { name: 'FarmCountry', type: 'xs:string' },
    I: { name: 'CustomerIdRef', type: 'xs:IDREF' },
}
const CHILD_TAGS = {
}

export class Farm implements Entity {
    public tag = 'FRM'

    constructor(public attributes: FarmAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Farm): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('FRM', Farm)
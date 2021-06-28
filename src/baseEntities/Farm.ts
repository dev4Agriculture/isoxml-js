import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type FarmAttributes = {
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
    A: { name: 'FarmId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'FarmDesignator', type: 'xs:string', isPrimaryId: false },
    C: { name: 'FarmStreet', type: 'xs:string', isPrimaryId: false },
    D: { name: 'FarmPOBox', type: 'xs:string', isPrimaryId: false },
    E: { name: 'FarmPostalCode', type: 'xs:string', isPrimaryId: false },
    F: { name: 'FarmCity', type: 'xs:string', isPrimaryId: false },
    G: { name: 'FarmState', type: 'xs:string', isPrimaryId: false },
    H: { name: 'FarmCountry', type: 'xs:string', isPrimaryId: false },
    I: { name: 'CustomerIdRef', type: 'xs:IDREF', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class Farm implements Entity {
    public tag = TAGS.Farm

    constructor(public attributes: FarmAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Farm): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Farm, Farm)
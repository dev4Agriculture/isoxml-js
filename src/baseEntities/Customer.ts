import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type CustomerAttributes = {
    CustomerLastName: string
    CustomerFirstName?: string
    CustomerStreet?: string
    CustomerPOBox?: string
    CustomerPostalCode?: string
    CustomerCity?: string
    CustomerState?: string
    CustomerCountry?: string
    CustomerPhone?: string
    CustomerMobile?: string
    CustomerFax?: string
    CustomerEMail?: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CustomerId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'CustomerLastName', type: 'xs:string', isPrimaryId: false },
    C: { name: 'CustomerFirstName', type: 'xs:string', isPrimaryId: false },
    D: { name: 'CustomerStreet', type: 'xs:string', isPrimaryId: false },
    E: { name: 'CustomerPOBox', type: 'xs:string', isPrimaryId: false },
    F: { name: 'CustomerPostalCode', type: 'xs:string', isPrimaryId: false },
    G: { name: 'CustomerCity', type: 'xs:string', isPrimaryId: false },
    H: { name: 'CustomerState', type: 'xs:string', isPrimaryId: false },
    I: { name: 'CustomerCountry', type: 'xs:string', isPrimaryId: false },
    J: { name: 'CustomerPhone', type: 'xs:string', isPrimaryId: false },
    K: { name: 'CustomerMobile', type: 'xs:string', isPrimaryId: false },
    L: { name: 'CustomerFax', type: 'xs:string', isPrimaryId: false },
    M: { name: 'CustomerEMail', type: 'xs:string', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class Customer implements Entity {
    public tag = TAGS.Customer

    constructor(public attributes: CustomerAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Customer): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Customer, Customer)
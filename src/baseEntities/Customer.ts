import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription } from '../types'

export type CustomerAttributes = {
    CustomerId: string
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
    A: { name: 'CustomerId', type: 'xs:ID' },
    B: { name: 'CustomerLastName', type: 'xs:string' },
    C: { name: 'CustomerFirstName', type: 'xs:string' },
    D: { name: 'CustomerStreet', type: 'xs:string' },
    E: { name: 'CustomerPOBox', type: 'xs:string' },
    F: { name: 'CustomerPostalCode', type: 'xs:string' },
    G: { name: 'CustomerCity', type: 'xs:string' },
    H: { name: 'CustomerState', type: 'xs:string' },
    I: { name: 'CustomerCountry', type: 'xs:string' },
    J: { name: 'CustomerPhone', type: 'xs:string' },
    K: { name: 'CustomerMobile', type: 'xs:string' },
    L: { name: 'CustomerFax', type: 'xs:string' },
    M: { name: 'CustomerEMail', type: 'xs:string' },
}
const CHILD_TAGS = {
}

export class Customer implements Entity {
    public tag = 'CTR'

    constructor(public attributes: CustomerAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, Customer, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('CTR', Customer)
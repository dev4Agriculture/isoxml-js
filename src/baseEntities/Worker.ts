import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type WorkerAttributes = {
    WorkerId: string
    WorkerLastName: string
    WorkerFirstName?: string
    WorkerStreet?: string
    WorkerPOBox?: string
    WorkerPostalCode?: string
    WorkerCity?: string
    WorkerState?: string
    WorkerCountry?: string
    WorkerPhone?: string
    WorkerMobile?: string
    WorkerLicenseNumber?: string
    WorkerEMail?: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'WorkerId', type: 'xs:ID' },
    B: { name: 'WorkerLastName', type: 'xs:string' },
    C: { name: 'WorkerFirstName', type: 'xs:string' },
    D: { name: 'WorkerStreet', type: 'xs:string' },
    E: { name: 'WorkerPOBox', type: 'xs:string' },
    F: { name: 'WorkerPostalCode', type: 'xs:string' },
    G: { name: 'WorkerCity', type: 'xs:string' },
    H: { name: 'WorkerState', type: 'xs:string' },
    I: { name: 'WorkerCountry', type: 'xs:string' },
    J: { name: 'WorkerPhone', type: 'xs:string' },
    K: { name: 'WorkerMobile', type: 'xs:string' },
    L: { name: 'WorkerLicenseNumber', type: 'xs:string' },
    M: { name: 'WorkerEMail', type: 'xs:string' },
}
const CHILD_TAGS = {
}

export class Worker implements Entity {
    public tag = 'WKR'

    constructor(public attributes: WorkerAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Worker): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('WKR', Worker)
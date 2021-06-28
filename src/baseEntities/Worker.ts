import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type WorkerAttributes = {
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
    A: { name: 'WorkerId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'WorkerLastName', type: 'xs:string', isPrimaryId: false },
    C: { name: 'WorkerFirstName', type: 'xs:string', isPrimaryId: false },
    D: { name: 'WorkerStreet', type: 'xs:string', isPrimaryId: false },
    E: { name: 'WorkerPOBox', type: 'xs:string', isPrimaryId: false },
    F: { name: 'WorkerPostalCode', type: 'xs:string', isPrimaryId: false },
    G: { name: 'WorkerCity', type: 'xs:string', isPrimaryId: false },
    H: { name: 'WorkerState', type: 'xs:string', isPrimaryId: false },
    I: { name: 'WorkerCountry', type: 'xs:string', isPrimaryId: false },
    J: { name: 'WorkerPhone', type: 'xs:string', isPrimaryId: false },
    K: { name: 'WorkerMobile', type: 'xs:string', isPrimaryId: false },
    L: { name: 'WorkerLicenseNumber', type: 'xs:string', isPrimaryId: false },
    M: { name: 'WorkerEMail', type: 'xs:string', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class Worker implements Entity {
    public tag = TAGS.Worker

    constructor(public attributes: WorkerAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Worker): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Worker, Worker)
import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { AllocationStamp } from './AllocationStamp'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type WorkerAllocationAttributes = {
    WorkerIdRef: ISOXMLReference
    AllocationStamp?: AllocationStamp[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'WorkerIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp', isOnlyV4: false },
}

export class WorkerAllocation implements Entity {
    public tag = TAGS.WorkerAllocation

    constructor(public attributes: WorkerAllocationAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = WorkerAllocation): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.WorkerAllocation, WorkerAllocation)
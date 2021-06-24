import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { AllocationStamp } from './AllocationStamp'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type WorkerAllocationAttributes = {
    WorkerIdRef: ISOXMLReference
    AllocationStamp?: AllocationStamp[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'WorkerIdRef', type: 'xs:IDREF' },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp' },
}

export class WorkerAllocation implements Entity {
    public tag = 'WAN'

    constructor(public attributes: WorkerAllocationAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = WorkerAllocation): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('WAN', WorkerAllocation)
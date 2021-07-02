import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { AllocationStamp } from './AllocationStamp'
import { GuidanceShift } from './GuidanceShift'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type GuidanceAllocationAttributes = {
    GuidanceGroupIdRef: ISOXMLReference
    AllocationStamp?: AllocationStamp[]
    GuidanceShift?: GuidanceShift[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'GuidanceGroupIdRef', type: 'xs:IDREF', isPrimaryId: false },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp' },
    GST: { name: 'GuidanceShift' },
}

export class GuidanceAllocation implements Entity {
    public tag = TAGS.GuidanceAllocation

    constructor(public attributes: GuidanceAllocationAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = GuidanceAllocation): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.GuidanceAllocation, GuidanceAllocation)
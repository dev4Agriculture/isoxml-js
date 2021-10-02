import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { AllocationStamp } from './AllocationStamp'
import { GuidanceShift } from './GuidanceShift'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type GuidanceAllocationAttributes = {
    GuidanceGroupIdRef: ISOXMLReference
    AllocationStamp?: AllocationStamp[]
    GuidanceShift?: GuidanceShift[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'GuidanceGroupIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp', isOnlyV4: undefined },
    GST: { name: 'GuidanceShift', isOnlyV4: undefined },
}

export class GuidanceAllocation implements Entity {
    public tag = TAGS.GuidanceAllocation

    constructor(public attributes: GuidanceAllocationAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = GuidanceAllocation): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.GuidanceAllocation, GuidanceAllocation)
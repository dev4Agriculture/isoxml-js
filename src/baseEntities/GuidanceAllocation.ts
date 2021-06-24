import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { AllocationStamp } from './AllocationStamp'
import { GuidanceShift } from './GuidanceShift'

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

export type GuidanceAllocationAttributes = {
    GuidanceGroupIdRef: ISOXMLReference
    AllocationStamp?: AllocationStamp[]
    GuidanceShift?: GuidanceShift[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'GuidanceGroupIdRef', type: 'xs:IDREF' },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp' },
    GST: { name: 'GuidanceShift' },
}

export class GuidanceAllocation implements Entity {
    public tag = 'GAN'

    constructor(public attributes: GuidanceAllocationAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, GuidanceAllocation, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('GAN', GuidanceAllocation)
import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { AllocationStamp } from './AllocationStamp'

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

export type GuidanceShiftAttributes = {
    GuidanceGroupIdRef?: ISOXMLReference
    GuidancePatternIdRef?: ISOXMLReference
    GuidanceEastShift?: number
    GuidanceNorthShift?: number
    PropagationOffset?: number
    AllocationStamp?: AllocationStamp[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'GuidanceGroupIdRef', type: 'xs:IDREF' },
    B: { name: 'GuidancePatternIdRef', type: 'xs:IDREF' },
    C: { name: 'GuidanceEastShift', type: 'xs:long' },
    D: { name: 'GuidanceNorthShift', type: 'xs:long' },
    E: { name: 'PropagationOffset', type: 'xs:long' },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp' },
}

export class GuidanceShift implements Entity {
    public tag = 'GST'

    constructor(public attributes: GuidanceShiftAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, GuidanceShift, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('GST', GuidanceShift)
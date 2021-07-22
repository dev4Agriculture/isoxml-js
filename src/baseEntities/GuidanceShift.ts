import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { AllocationStamp } from './AllocationStamp'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type GuidanceShiftAttributes = {
    GuidanceGroupIdRef?: ISOXMLReference
    GuidancePatternIdRef?: ISOXMLReference
    GuidanceEastShift?: number
    GuidanceNorthShift?: number
    PropagationOffset?: number
    AllocationStamp?: AllocationStamp[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'GuidanceGroupIdRef', type: 'xs:IDREF', isPrimaryId: false, isOnlyV4: undefined },
    B: { name: 'GuidancePatternIdRef', type: 'xs:IDREF', isPrimaryId: false, isOnlyV4: undefined },
    C: { name: 'GuidanceEastShift', type: 'xs:long', isPrimaryId: false, isOnlyV4: undefined },
    D: { name: 'GuidanceNorthShift', type: 'xs:long', isPrimaryId: false, isOnlyV4: undefined },
    E: { name: 'PropagationOffset', type: 'xs:long', isPrimaryId: false, isOnlyV4: undefined },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp', isOnlyV4: undefined },
}

export class GuidanceShift implements Entity {
    public tag = TAGS.GuidanceShift

    constructor(public attributes: GuidanceShiftAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = GuidanceShift): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.GuidanceShift, GuidanceShift)
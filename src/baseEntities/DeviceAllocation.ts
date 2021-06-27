import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { AllocationStamp } from './AllocationStamp'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type DeviceAllocationAttributes = {
    ClientNAMEValue: string
    ClientNAMEMask?: string
    DeviceIdRef?: ISOXMLReference
    AllocationStamp?: AllocationStamp[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ClientNAMEValue', type: 'xs:hexBinary', isPrimaryId: false },
    B: { name: 'ClientNAMEMask', type: 'xs:hexBinary', isPrimaryId: false },
    C: { name: 'DeviceIdRef', type: 'xs:IDREF', isPrimaryId: false },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp' },
}

export class DeviceAllocation implements Entity {
    public tag = TAGS.DeviceAllocation

    constructor(public attributes: DeviceAllocationAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = DeviceAllocation): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.DeviceAllocation, DeviceAllocation)
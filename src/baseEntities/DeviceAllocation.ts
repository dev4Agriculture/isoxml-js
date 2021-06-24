import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { AllocationStamp } from './AllocationStamp'

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

export type DeviceAllocationAttributes = {
    ClientNAMEValue: string
    ClientNAMEMask?: string
    DeviceIdRef?: ISOXMLReference
    AllocationStamp?: AllocationStamp[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ClientNAMEValue', type: 'xs:hexBinary' },
    B: { name: 'ClientNAMEMask', type: 'xs:hexBinary' },
    C: { name: 'DeviceIdRef', type: 'xs:IDREF' },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp' },
}

export class DeviceAllocation implements Entity {
    public tag = 'DAN'

    constructor(public attributes: DeviceAllocationAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, DeviceAllocation, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('DAN', DeviceAllocation)
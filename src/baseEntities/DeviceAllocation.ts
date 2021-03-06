import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { AllocationStamp } from './AllocationStamp'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type DeviceAllocationAttributes = {
    ClientNAMEValue: string
    ClientNAMEMask?: string
    DeviceIdRef?: ISOXMLReference
    AllocationStamp?: AllocationStamp[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'ClientNAMEValue',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'ClientNAMEMask',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    C: {
        name: 'DeviceIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp', isOnlyV4: false },
}

export class DeviceAllocation implements Entity {
    public tag = TAGS.DeviceAllocation

    constructor(public attributes: DeviceAllocationAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = DeviceAllocation): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.DeviceAllocation, DeviceAllocation)
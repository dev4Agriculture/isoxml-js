import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { DeviceObjectReference } from './DeviceObjectReference'

import { Entity, AttributesDescription } from '../types'

export type DeviceElementAttributes = {
    DeviceElementId: string
    DeviceElementObjectId: number
    DeviceElementType: string
    DeviceElementDesignator?: string
    DeviceElementNumber: number
    ParentObjectId: number
    DeviceObjectReference?: DeviceObjectReference[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'DeviceElementId', type: 'xs:ID' },
    B: { name: 'DeviceElementObjectId', type: 'xs:unsignedShort' },
    C: { name: 'DeviceElementType', type: 'xs:NMTOKEN' },
    D: { name: 'DeviceElementDesignator', type: 'xs:string' },
    E: { name: 'DeviceElementNumber', type: 'xs:unsignedShort' },
    F: { name: 'ParentObjectId', type: 'xs:unsignedShort' },
}
const CHILD_TAGS = {
    DOR: { name: 'DeviceObjectReference' },
}

export class DeviceElement implements Entity {
    public tag = 'DET'

    constructor(public attributes: DeviceElementAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, DeviceElement, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('DET', DeviceElement)
import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription } from '../types'

export type DeviceObjectReferenceAttributes = {
    DeviceObjectId: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'DeviceObjectId', type: 'xs:unsignedShort' },
}
const CHILD_TAGS = {
}

export class DeviceObjectReference implements Entity {
    public tag = 'DOR'

    constructor(public attributes: DeviceObjectReferenceAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, DeviceObjectReference, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('DOR', DeviceObjectReference)
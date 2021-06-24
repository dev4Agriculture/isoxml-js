import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type DevicePropertyAttributes = {
    DevicePropertyObjectId: number
    DevicePropertyDDI: string
    DevicePropertyValue: number
    DevicePropertyDesignator?: string
    DeviceValuePresentationObjectId?: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'DevicePropertyObjectId', type: 'xs:unsignedShort' },
    B: { name: 'DevicePropertyDDI', type: 'xs:hexBinary' },
    C: { name: 'DevicePropertyValue', type: 'xs:long' },
    D: { name: 'DevicePropertyDesignator', type: 'xs:string' },
    E: { name: 'DeviceValuePresentationObjectId', type: 'xs:unsignedShort' },
}
const CHILD_TAGS = {
}

export class DeviceProperty implements Entity {
    public tag = 'DPT'

    constructor(public attributes: DevicePropertyAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = DeviceProperty): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('DPT', DeviceProperty)
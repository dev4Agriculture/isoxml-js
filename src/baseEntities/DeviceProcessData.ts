import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type DeviceProcessDataAttributes = {
    DeviceProcessDataObjectId: number
    DeviceProcessDataDDI: string
    DeviceProcessDataProperty: number
    DeviceProcessDataTriggerMethods: number
    DeviceProcessDataDesignator?: string
    DeviceValuePresentationObjectId?: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'DeviceProcessDataObjectId', type: 'xs:unsignedShort' },
    B: { name: 'DeviceProcessDataDDI', type: 'xs:hexBinary' },
    C: { name: 'DeviceProcessDataProperty', type: 'xs:unsignedByte' },
    D: { name: 'DeviceProcessDataTriggerMethods', type: 'xs:unsignedByte' },
    E: { name: 'DeviceProcessDataDesignator', type: 'xs:string' },
    F: { name: 'DeviceValuePresentationObjectId', type: 'xs:unsignedShort' },
}
const CHILD_TAGS = {
}

export class DeviceProcessData implements Entity {
    public tag = 'DPD'

    constructor(public attributes: DeviceProcessDataAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = DeviceProcessData): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('DPD', DeviceProcessData)
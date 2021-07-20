import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
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
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'DevicePropertyObjectId', type: 'xs:unsignedShort', isPrimaryId: false },
    B: { name: 'DevicePropertyDDI', type: 'xs:hexBinary', isPrimaryId: false },
    C: { name: 'DevicePropertyValue', type: 'xs:long', isPrimaryId: false },
    D: { name: 'DevicePropertyDesignator', type: 'xs:string', isPrimaryId: false },
    E: { name: 'DeviceValuePresentationObjectId', type: 'xs:unsignedShort', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class DeviceProperty implements Entity {
    public tag = TAGS.DeviceProperty

    constructor(public attributes: DevicePropertyAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = DeviceProperty): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.DeviceProperty, DeviceProperty)
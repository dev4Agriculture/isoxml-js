import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { DeviceObjectReference } from './DeviceObjectReference'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export const enum DeviceElementDeviceElementTypeEnum {
    Device = '1',
    Function = '2',
    Bin = '3',
    Section = '4',
    Unit = '5',
    Connector = '6',
    Navigation = '7',
}

export type DeviceElementAttributes = {
    DeviceElementObjectId: number
    DeviceElementType: DeviceElementDeviceElementTypeEnum
    DeviceElementDesignator?: string
    DeviceElementNumber: number
    ParentObjectId: number
    DeviceObjectReference?: DeviceObjectReference[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'DeviceElementId', type: 'xs:ID', isPrimaryId: true, isOnlyV4: false },
    B: { name: 'DeviceElementObjectId', type: 'xs:unsignedShort', isPrimaryId: false, isOnlyV4: false },
    C: { name: 'DeviceElementType', type: 'xs:NMTOKEN', isPrimaryId: false, isOnlyV4: false },
    D: { name: 'DeviceElementDesignator', type: 'xs:string', isPrimaryId: false, isOnlyV4: false },
    E: { name: 'DeviceElementNumber', type: 'xs:unsignedShort', isPrimaryId: false, isOnlyV4: false },
    F: { name: 'ParentObjectId', type: 'xs:unsignedShort', isPrimaryId: false, isOnlyV4: false },
}
const CHILD_TAGS = {
    DOR: { name: 'DeviceObjectReference', isOnlyV4: false },
}

export class DeviceElement implements Entity {
    public tag = TAGS.DeviceElement

    constructor(public attributes: DeviceElementAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = DeviceElement): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.DeviceElement, DeviceElement)
import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { DeviceObjectReference } from './DeviceObjectReference'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export enum DeviceElementDeviceElementTypeEnum {
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
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'DeviceElementId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'DeviceElementObjectId',
        type: 'xs:unsignedShort',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 1,
        maxValue: 65534,
    },
    C: {
        name: 'DeviceElementType',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    D: {
        name: 'DeviceElementDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    E: {
        name: 'DeviceElementNumber',
        type: 'xs:unsignedShort',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 4095,
    },
    F: {
        name: 'ParentObjectId',
        type: 'xs:unsignedShort',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 65534,
    },
}
const CHILD_TAGS = {
    DOR: { name: 'DeviceObjectReference', isOnlyV4: false },
}

export class DeviceElement implements Entity {
    public tag = TAGS.DeviceElement

    constructor(public attributes: DeviceElementAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = DeviceElement): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.DeviceElement, DeviceElement)
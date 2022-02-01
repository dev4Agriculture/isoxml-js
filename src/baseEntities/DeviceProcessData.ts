import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'


import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type DeviceProcessDataAttributes = {
    DeviceProcessDataObjectId: number
    DeviceProcessDataDDI: string
    DeviceProcessDataProperty: number
    DeviceProcessDataTriggerMethods: number
    DeviceProcessDataDesignator?: string
    DeviceValuePresentationObjectId?: number
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'DeviceProcessDataObjectId',
        type: 'xs:unsignedShort',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 1,
        maxValue: 65534,
    },
    B: {
        name: 'DeviceProcessDataDDI',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    C: {
        name: 'DeviceProcessDataProperty',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 7,
    },
    D: {
        name: 'DeviceProcessDataTriggerMethods',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 31,
    },
    E: {
        name: 'DeviceProcessDataDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    F: {
        name: 'DeviceValuePresentationObjectId',
        type: 'xs:unsignedShort',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 1,
        maxValue: 65534,
    },
}
const CHILD_TAGS = {
}

export class DeviceProcessData implements Entity {
    public tag = TAGS.DeviceProcessData

    constructor(public attributes: DeviceProcessDataAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = DeviceProcessData): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.DeviceProcessData, DeviceProcessData)
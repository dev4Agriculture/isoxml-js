import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'


import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type DevicePropertyAttributes = {
    DevicePropertyObjectId: number
    DevicePropertyDDI: string
    DevicePropertyValue: number
    DevicePropertyDesignator?: string
    DeviceValuePresentationObjectId?: number
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'DevicePropertyObjectId',
        type: 'xs:unsignedShort',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 1,
        maxValue: 65534,
    },
    B: {
        name: 'DevicePropertyDDI',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    C: {
        name: 'DevicePropertyValue',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: -2147483648,
        maxValue: 2147483647,
    },
    D: {
        name: 'DevicePropertyDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    E: {
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

export class DeviceProperty implements Entity {
    public tag = TAGS.DeviceProperty

    constructor(public attributes: DevicePropertyAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = DeviceProperty): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.DeviceProperty, DeviceProperty)
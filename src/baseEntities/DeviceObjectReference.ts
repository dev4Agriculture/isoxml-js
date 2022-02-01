import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'


import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type DeviceObjectReferenceAttributes = {
    DeviceObjectId: number
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'DeviceObjectId',
        type: 'xs:unsignedShort',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 1,
        maxValue: 65534,
    },
}
const CHILD_TAGS = {
}

export class DeviceObjectReference implements Entity {
    public tag = TAGS.DeviceObjectReference

    constructor(public attributes: DeviceObjectReferenceAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = DeviceObjectReference): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.DeviceObjectReference, DeviceObjectReference)
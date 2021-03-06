import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'


import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type ConnectionAttributes = {
    DeviceIdRef_0: ISOXMLReference
    DeviceElementIdRef_0: ISOXMLReference
    DeviceIdRef_1: ISOXMLReference
    DeviceElementIdRef_1: ISOXMLReference
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'DeviceIdRef_0',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'DeviceElementIdRef_0',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    C: {
        name: 'DeviceIdRef_1',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    D: {
        name: 'DeviceElementIdRef_1',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
}
const CHILD_TAGS = {
}

export class Connection implements Entity {
    public tag = TAGS.Connection

    constructor(public attributes: ConnectionAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = Connection): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.Connection, Connection)
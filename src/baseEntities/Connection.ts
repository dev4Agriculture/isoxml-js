import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type ConnectionAttributes = {
    DeviceIdRef_0: ISOXMLReference
    DeviceElementIdRef_0: ISOXMLReference
    DeviceIdRef_1: ISOXMLReference
    DeviceElementIdRef_1: ISOXMLReference
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'DeviceIdRef_0', type: 'xs:IDREF', isPrimaryId: false },
    B: { name: 'DeviceElementIdRef_0', type: 'xs:IDREF', isPrimaryId: false },
    C: { name: 'DeviceIdRef_1', type: 'xs:IDREF', isPrimaryId: false },
    D: { name: 'DeviceElementIdRef_1', type: 'xs:IDREF', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class Connection implements Entity {
    public tag = 'CNN'

    constructor(public attributes: ConnectionAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Connection): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('CNN', Connection)
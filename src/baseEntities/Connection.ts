import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

export type ConnectionAttributes = {
    DeviceIdRef_0: ISOXMLReference
    DeviceElementIdRef_0: ISOXMLReference
    DeviceIdRef_1: ISOXMLReference
    DeviceElementIdRef_1: ISOXMLReference
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'DeviceIdRef_0', type: 'xs:IDREF' },
    B: { name: 'DeviceElementIdRef_0', type: 'xs:IDREF' },
    C: { name: 'DeviceIdRef_1', type: 'xs:IDREF' },
    D: { name: 'DeviceElementIdRef_1', type: 'xs:IDREF' },
}
const CHILD_TAGS = {
}

export class Connection implements Entity {
    public tag = 'CNN'

    constructor(public attributes: ConnectionAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, Connection, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('CNN', Connection)
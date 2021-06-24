import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type BaseStationAttributes = {
    BaseStationId: string
    BaseStationDesignator: string
    BaseStationNorth: number
    BaseStationEast: number
    BaseStationUp: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'BaseStationId', type: 'xs:ID' },
    B: { name: 'BaseStationDesignator', type: 'xs:string' },
    C: { name: 'BaseStationNorth', type: 'xs:decimal' },
    D: { name: 'BaseStationEast', type: 'xs:decimal' },
    E: { name: 'BaseStationUp', type: 'xs:long' },
}
const CHILD_TAGS = {
}

export class BaseStation implements Entity {
    public tag = 'BSN'

    constructor(public attributes: BaseStationAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = BaseStation): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('BSN', BaseStation)
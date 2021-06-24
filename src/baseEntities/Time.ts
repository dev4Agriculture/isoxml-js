import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { Position } from './Position'
import { DataLogValue } from './DataLogValue'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type TimeAttributes = {
    Start: string
    Stop?: string
    Duration?: number
    Type: string
    Position?: Position[]
    DataLogValue?: DataLogValue[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'Start', type: 'xs:dateTime' },
    B: { name: 'Stop', type: 'xs:dateTime' },
    C: { name: 'Duration', type: 'xs:unsignedLong' },
    D: { name: 'Type', type: 'xs:NMTOKEN' },
}
const CHILD_TAGS = {
    PTN: { name: 'Position' },
    DLV: { name: 'DataLogValue' },
}

export class Time implements Entity {
    public tag = 'TIM'

    constructor(public attributes: TimeAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Time): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('TIM', Time)
import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { Position } from './Position'
import { DataLogValue } from './DataLogValue'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export const enum TimeTypeEnum {
    Planned = '1',
    Preliminary = '2',
    Effective = '4',
    Ineffective = '5',
    Repair = '6',
    Clearing = '7',
    PoweredDown = '8',
}

export type TimeAttributes = {
    Start: string
    Stop?: string
    Duration?: number
    Type: TimeTypeEnum
    Position?: Position[]
    DataLogValue?: DataLogValue[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'Start', type: 'xs:dateTime', isPrimaryId: false },
    B: { name: 'Stop', type: 'xs:dateTime', isPrimaryId: false },
    C: { name: 'Duration', type: 'xs:unsignedLong', isPrimaryId: false },
    D: { name: 'Type', type: 'xs:NMTOKEN', isPrimaryId: false },
}
const CHILD_TAGS = {
    PTN: { name: 'Position' },
    DLV: { name: 'DataLogValue' },
}

export class Time implements Entity {
    public tag = TAGS.Time

    constructor(public attributes: TimeAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Time): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Time, Time)
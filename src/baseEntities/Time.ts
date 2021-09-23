import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { Position } from './Position'
import { DataLogValue } from './DataLogValue'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export enum TimeTypeEnum {
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
    A: {
        name: 'Start',
        type: 'xs:dateTime',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'Stop',
        type: 'xs:dateTime',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    C: {
        name: 'Duration',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 4294967294,
    },
    D: {
        name: 'Type',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
}
const CHILD_TAGS = {
    PTN: { name: 'Position', isOnlyV4: false },
    DLV: { name: 'DataLogValue', isOnlyV4: false },
}

export class Time implements Entity {
    public tag = TAGS.Time

    constructor(public attributes: TimeAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = Time): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Time, Time)
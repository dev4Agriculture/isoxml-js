import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { Position } from './Position'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export const enum AllocationStampTypeEnum {
    Planned = '1',
    EffectiveRealized = '4',
}

export type AllocationStampAttributes = {
    Start: string
    Stop?: string
    Duration?: number
    Type: AllocationStampTypeEnum
    Position?: Position[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'Start',
        type: 'xs:dateTime',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false
    },
    B: {
        name: 'Stop',
        type: 'xs:dateTime',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false
    },
    C: {
        name: 'Duration',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false
    },
    D: {
        name: 'Type',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false
    },
}
const CHILD_TAGS = {
    PTN: { name: 'Position', isOnlyV4: false },
}

export class AllocationStamp implements Entity {
    public tag = TAGS.AllocationStamp

    constructor(public attributes: AllocationStampAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = AllocationStamp): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.AllocationStamp, AllocationStamp)
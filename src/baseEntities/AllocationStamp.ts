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
    A: { name: 'Start', type: 'xs:dateTime', isPrimaryId: false },
    B: { name: 'Stop', type: 'xs:dateTime', isPrimaryId: false },
    C: { name: 'Duration', type: 'xs:unsignedLong', isPrimaryId: false },
    D: { name: 'Type', type: 'xs:NMTOKEN', isPrimaryId: false },
}
const CHILD_TAGS = {
    PTN: { name: 'Position' },
}

export class AllocationStamp implements Entity {
    public tag = TAGS.AllocationStamp

    constructor(public attributes: AllocationStampAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = AllocationStamp): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.AllocationStamp, AllocationStamp)
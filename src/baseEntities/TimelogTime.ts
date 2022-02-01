import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { TimelogPosition } from './TimelogPosition'
import { TimelogDataLogValue } from './TimelogDataLogValue'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export enum TimelogTimeTypeEnum {
    Effective = '4',
}

export type TimelogTimeAttributes = {
    Start: string
    Type: TimelogTimeTypeEnum
    Position?: TimelogPosition[]
    DataLogValue?: TimelogDataLogValue[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'Start',
        type: 'emptyString',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
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

export class TimelogTime implements Entity {
    public tag = TAGS.Time

    constructor(public attributes: TimelogTimeAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = TimelogTime): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('timelog', TAGS.Time, TimelogTime)
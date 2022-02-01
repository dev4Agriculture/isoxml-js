import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'


import { Entity, EntityConstructor, AttributesDescription } from '../types'

export enum TimeLogTimeLogTypeEnum {
    BinaryTimelogFileType1 = '1',
}

export type TimeLogAttributes = {
    Filename: string
    Filelength?: number
    TimeLogType: TimeLogTimeLogTypeEnum
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'Filename',
        type: 'xs:ID',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'Filelength',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 4294967294,
    },
    C: {
        name: 'TimeLogType',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
}
const CHILD_TAGS = {
}

export class TimeLog implements Entity {
    public tag = TAGS.TimeLog

    constructor(public attributes: TimeLogAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = TimeLog): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.TimeLog, TimeLog)
import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export const enum TimeLogTimeLogTypeEnum {
    BinaryTimelogFileType1 = '1',
}

export type TimeLogAttributes = {
    Filename: string
    Filelength?: number
    TimeLogType: TimeLogTimeLogTypeEnum
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'Filename', type: 'xs:ID', isPrimaryId: false },
    B: { name: 'Filelength', type: 'xs:unsignedLong', isPrimaryId: false },
    C: { name: 'TimeLogType', type: 'xs:NMTOKEN', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class TimeLog implements Entity {
    public tag = TAGS.TimeLog

    constructor(public attributes: TimeLogAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = TimeLog): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.TimeLog, TimeLog)
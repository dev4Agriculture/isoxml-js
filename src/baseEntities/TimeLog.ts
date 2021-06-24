import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription } from '../types'

export type TimeLogAttributes = {
    Filename: string
    Filelength?: number
    TimeLogType: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'Filename', type: 'xs:ID' },
    B: { name: 'Filelength', type: 'xs:unsignedLong' },
    C: { name: 'TimeLogType', type: 'xs:NMTOKEN' },
}
const CHILD_TAGS = {
}

export class TimeLog implements Entity {
    public tag = 'TLG'

    constructor(public attributes: TimeLogAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, TimeLog, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('TLG', TimeLog)
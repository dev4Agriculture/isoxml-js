import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { Point } from './Point'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type LineStringAttributes = {
    LineStringType: string
    LineStringDesignator?: string
    LineStringWidth?: number
    LineStringLength?: number
    LineStringColour?: number
    Point?: Point[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'LineStringType', type: 'xs:NMTOKEN', isPrimaryId: false },
    B: { name: 'LineStringDesignator', type: 'xs:string', isPrimaryId: false },
    C: { name: 'LineStringWidth', type: 'xs:unsignedLong', isPrimaryId: false },
    D: { name: 'LineStringLength', type: 'xs:unsignedLong', isPrimaryId: false },
    E: { name: 'LineStringColour', type: 'xs:unsignedByte', isPrimaryId: false },
    F: { name: 'LineStringId', type: 'xs:ID', isPrimaryId: true },
}
const CHILD_TAGS = {
    PNT: { name: 'Point' },
}

export class LineString implements Entity {
    public tag = TAGS.LineString

    constructor(public attributes: LineStringAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = LineString): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.LineString, LineString)
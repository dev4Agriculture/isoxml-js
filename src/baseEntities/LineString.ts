import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { Point } from './Point'

import { Entity, AttributesDescription } from '../types'

export type LineStringAttributes = {
    LineStringType: string
    LineStringDesignator?: string
    LineStringWidth?: number
    LineStringLength?: number
    LineStringColour?: number
    LineStringId?: string
    Point?: Point[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'LineStringType', type: 'xs:NMTOKEN' },
    B: { name: 'LineStringDesignator', type: 'xs:string' },
    C: { name: 'LineStringWidth', type: 'xs:unsignedLong' },
    D: { name: 'LineStringLength', type: 'xs:unsignedLong' },
    E: { name: 'LineStringColour', type: 'xs:unsignedByte' },
    F: { name: 'LineStringId', type: 'xs:ID' },
}
const CHILD_TAGS = {
    PNT: { name: 'Point' },
}

export class LineString implements Entity {
    public tag = 'LSG'

    constructor(public attributes: LineStringAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, LineString, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('LSG', LineString)
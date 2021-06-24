import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type ColourRangeAttributes = {
    MinimumValue: number
    MaximumValue: number
    Colour: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'MinimumValue', type: 'xs:long' },
    B: { name: 'MaximumValue', type: 'xs:long' },
    C: { name: 'Colour', type: 'xs:unsignedByte' },
}
const CHILD_TAGS = {
}

export class ColourRange implements Entity {
    public tag = 'CRG'

    constructor(public attributes: ColourRangeAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ColourRange): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('CRG', ColourRange)
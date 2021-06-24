import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { ColourRange } from './ColourRange'

import { Entity, AttributesDescription } from '../types'

export type ColourLegendAttributes = {
    ColourLegendId: string
    DefaultColor?: number
    ColourRange?: ColourRange[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ColourLegendId', type: 'xs:ID' },
    B: { name: 'DefaultColor', type: 'xs:unsignedByte' },
}
const CHILD_TAGS = {
    CRG: { name: 'ColourRange' },
}

export class ColourLegend implements Entity {
    public tag = 'CLD'

    constructor(public attributes: ColourLegendAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, ColourLegend, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('CLD', ColourLegend)
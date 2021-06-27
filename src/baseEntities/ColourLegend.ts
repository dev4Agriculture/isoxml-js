import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { ColourRange } from './ColourRange'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type ColourLegendAttributes = {
    DefaultColor?: number
    ColourRange?: ColourRange[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ColourLegendId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'DefaultColor', type: 'xs:unsignedByte', isPrimaryId: false },
}
const CHILD_TAGS = {
    CRG: { name: 'ColourRange' },
}

export class ColourLegend implements Entity {
    public tag = 'CLD'

    constructor(public attributes: ColourLegendAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ColourLegend): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('CLD', ColourLegend)
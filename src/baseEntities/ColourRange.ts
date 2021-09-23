import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type ColourRangeAttributes = {
    MinimumValue: number
    MaximumValue: number
    Colour: number
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'MinimumValue',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: -2147483647,
        maxValue: 2147483647,
    },
    B: {
        name: 'MaximumValue',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: -2147483647,
        maxValue: 2147483647,
    },
    C: {
        name: 'Colour',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 254,
    },
}
const CHILD_TAGS = {
}

export class ColourRange implements Entity {
    public tag = TAGS.ColourRange

    constructor(public attributes: ColourRangeAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = ColourRange): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.ColourRange, ColourRange)
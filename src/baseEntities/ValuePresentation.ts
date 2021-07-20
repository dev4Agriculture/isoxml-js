import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type ValuePresentationAttributes = {
    Offset: number
    Scale: number
    NumberOfDecimals: number
    UnitDesignator?: string
    ColourLegendIdRef?: ISOXMLReference
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ValuePresentationId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'Offset', type: 'xs:long', isPrimaryId: false },
    C: { name: 'Scale', type: 'xs:decimal', isPrimaryId: false },
    D: { name: 'NumberOfDecimals', type: 'xs:unsignedByte', isPrimaryId: false },
    E: { name: 'UnitDesignator', type: 'xs:string', isPrimaryId: false },
    F: { name: 'ColourLegendIdRef', type: 'xs:IDREF', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class ValuePresentation implements Entity {
    public tag = TAGS.ValuePresentation

    constructor(public attributes: ValuePresentationAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ValuePresentation): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.ValuePresentation, ValuePresentation)
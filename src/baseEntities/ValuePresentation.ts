import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type ValuePresentationAttributes = {
    ValuePresentationId: string
    Offset: number
    Scale: number
    NumberOfDecimals: number
    UnitDesignator?: string
    ColourLegendIdRef?: ISOXMLReference
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ValuePresentationId', type: 'xs:ID' },
    B: { name: 'Offset', type: 'xs:long' },
    C: { name: 'Scale', type: 'xs:decimal' },
    D: { name: 'NumberOfDecimals', type: 'xs:unsignedByte' },
    E: { name: 'UnitDesignator', type: 'xs:string' },
    F: { name: 'ColourLegendIdRef', type: 'xs:IDREF' },
}
const CHILD_TAGS = {
}

export class ValuePresentation implements Entity {
    public tag = 'VPN'

    constructor(public attributes: ValuePresentationAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ValuePresentation): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('VPN', ValuePresentation)
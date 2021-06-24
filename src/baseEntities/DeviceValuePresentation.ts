import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription } from '../types'

export type DeviceValuePresentationAttributes = {
    DeviceValuePresentationObjectId: number
    Offset: number
    Scale: number
    NumberOfDecimals: number
    UnitDesignator?: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'DeviceValuePresentationObjectId', type: 'xs:unsignedShort' },
    B: { name: 'Offset', type: 'xs:long' },
    C: { name: 'Scale', type: 'xs:decimal' },
    D: { name: 'NumberOfDecimals', type: 'xs:unsignedByte' },
    E: { name: 'UnitDesignator', type: 'xs:string' },
}
const CHILD_TAGS = {
}

export class DeviceValuePresentation implements Entity {
    public tag = 'DVP'

    constructor(public attributes: DeviceValuePresentationAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, DeviceValuePresentation, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('DVP', DeviceValuePresentation)
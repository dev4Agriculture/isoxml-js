import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { GuidancePattern } from './GuidancePattern'
import { Polygon } from './Polygon'

import { Entity, AttributesDescription } from '../types'

export type GuidanceGroupAttributes = {
    GuidanceGroupId: string
    GuidanceGroupDesignator?: string
    GuidancePattern?: GuidancePattern[]
    BoundaryPolygon?: Polygon[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'GuidanceGroupId', type: 'xs:ID' },
    B: { name: 'GuidanceGroupDesignator', type: 'xs:string' },
}
const CHILD_TAGS = {
    GPN: { name: 'GuidancePattern' },
    PLN: { name: 'BoundaryPolygon' },
}

export class GuidanceGroup implements Entity {
    public tag = 'GGP'

    constructor(public attributes: GuidanceGroupAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, GuidanceGroup, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('GGP', GuidanceGroup)
import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { LineString } from './LineString'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type PolygonAttributes = {
    PolygonType: string
    PolygonDesignator?: string
    PolygonArea?: number
    PolygonColour?: number
    PolygonId?: string
    LineString?: LineString[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'PolygonType', type: 'xs:NMTOKEN' },
    B: { name: 'PolygonDesignator', type: 'xs:string' },
    C: { name: 'PolygonArea', type: 'xs:unsignedLong' },
    D: { name: 'PolygonColour', type: 'xs:unsignedByte' },
    E: { name: 'PolygonId', type: 'xs:ID' },
}
const CHILD_TAGS = {
    LSG: { name: 'LineString' },
}

export class Polygon implements Entity {
    public tag = 'PLN'

    constructor(public attributes: PolygonAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Polygon): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('PLN', Polygon)
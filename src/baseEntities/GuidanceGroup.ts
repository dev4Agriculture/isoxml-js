import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { GuidancePattern } from './GuidancePattern'
import { Polygon } from './Polygon'

import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type GuidanceGroupAttributes = {
    GuidanceGroupDesignator?: string
    GuidancePattern?: GuidancePattern[]
    BoundaryPolygon?: Polygon[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'GuidanceGroupId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'GuidanceGroupDesignator', type: 'xs:string', isPrimaryId: false },
}
const CHILD_TAGS = {
    GPN: { name: 'GuidancePattern' },
    PLN: { name: 'BoundaryPolygon' },
}

export class GuidanceGroup implements Entity {
    public tag = TAGS.GuidanceGroup

    constructor(public attributes: GuidanceGroupAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = GuidanceGroup): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.GuidanceGroup, GuidanceGroup)
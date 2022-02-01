import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { GuidancePattern } from './GuidancePattern'
import { Polygon } from './Polygon'

import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type GuidanceGroupAttributes = {
    GuidanceGroupDesignator?: string
    GuidancePattern?: GuidancePattern[]
    BoundaryPolygon?: Polygon[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'GuidanceGroupId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: false,
        isOnlyV4: undefined,
    },
    B: {
        name: 'GuidanceGroupDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined,
    },
}
const CHILD_TAGS = {
    GPN: { name: 'GuidancePattern', isOnlyV4: undefined },
    PLN: { name: 'BoundaryPolygon', isOnlyV4: undefined },
}

export class GuidanceGroup implements Entity {
    public tag = TAGS.GuidanceGroup

    constructor(public attributes: GuidanceGroupAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = GuidanceGroup): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.GuidanceGroup, GuidanceGroup)
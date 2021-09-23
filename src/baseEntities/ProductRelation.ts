import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type ProductRelationAttributes = {
    ProductIdRef: ISOXMLReference
    QuantityValue: number
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'ProductIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    B: {
        name: 'QuantityValue',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
        minValue: 0,
        maxValue: 2147483647,
    },
}
const CHILD_TAGS = {
}

export class ProductRelation implements Entity {
    public tag = TAGS.ProductRelation

    constructor(public attributes: ProductRelationAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = ProductRelation): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.ProductRelation, ProductRelation)
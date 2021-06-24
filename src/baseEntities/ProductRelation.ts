import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type ProductRelationAttributes = {
    ProductIdRef: ISOXMLReference
    QuantityValue: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ProductIdRef', type: 'xs:IDREF' },
    B: { name: 'QuantityValue', type: 'xs:long' },
}
const CHILD_TAGS = {
}

export class ProductRelation implements Entity {
    public tag = 'PRN'

    constructor(public attributes: ProductRelationAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ProductRelation): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('PRN', ProductRelation)
import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type ProductGroupAttributes = {
    ProductGroupId: string
    ProductGroupDesignator: string
    ProductGroupType?: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ProductGroupId', type: 'xs:ID' },
    B: { name: 'ProductGroupDesignator', type: 'xs:string' },
    C: { name: 'ProductGroupType', type: 'xs:NMTOKEN' },
}
const CHILD_TAGS = {
}

export class ProductGroup implements Entity {
    public tag = 'PGP'

    constructor(public attributes: ProductGroupAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ProductGroup): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('PGP', ProductGroup)
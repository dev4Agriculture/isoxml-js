import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type ProductGroupAttributes = {
    ProductGroupDesignator: string
    ProductGroupType?: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ProductGroupId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'ProductGroupDesignator', type: 'xs:string', isPrimaryId: false },
    C: { name: 'ProductGroupType', type: 'xs:NMTOKEN', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class ProductGroup implements Entity {
    public tag = 'PGP'

    constructor(public attributes: ProductGroupAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ProductGroup): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('PGP', ProductGroup)
import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export const enum ProductGroupProductGroupTypeEnum {
    ProductGroupDefault = '1',
    CropType = '2',
}

export type ProductGroupAttributes = {
    ProductGroupDesignator: string
    ProductGroupType?: ProductGroupProductGroupTypeEnum
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ProductGroupId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'ProductGroupDesignator', type: 'xs:string', isPrimaryId: false },
    C: { name: 'ProductGroupType', type: 'xs:NMTOKEN', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class ProductGroup implements Entity {
    public tag = TAGS.ProductGroup

    constructor(public attributes: ProductGroupAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ProductGroup): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.ProductGroup, ProductGroup)
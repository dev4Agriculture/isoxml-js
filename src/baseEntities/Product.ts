import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { ProductRelation } from './ProductRelation'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type ProductAttributes = {
    ProductDesignator: string
    ProductGroupIdRef?: ISOXMLReference
    ValuePresentationIdRef?: ISOXMLReference
    QuantityDDI?: string
    ProductType?: string
    MixtureRecipeQuantity?: number
    DensityMassPerVolume?: number
    DensityMassPerCount?: number
    DensityVolumePerCount?: number
    ProductRelation?: ProductRelation[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ProductId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'ProductDesignator', type: 'xs:string', isPrimaryId: false },
    C: { name: 'ProductGroupIdRef', type: 'xs:IDREF', isPrimaryId: false },
    D: { name: 'ValuePresentationIdRef', type: 'xs:IDREF', isPrimaryId: false },
    E: { name: 'QuantityDDI', type: 'xs:hexBinary', isPrimaryId: false },
    F: { name: 'ProductType', type: 'xs:NMTOKEN', isPrimaryId: false },
    G: { name: 'MixtureRecipeQuantity', type: 'xs:long', isPrimaryId: false },
    H: { name: 'DensityMassPerVolume', type: 'xs:long', isPrimaryId: false },
    I: { name: 'DensityMassPerCount', type: 'xs:long', isPrimaryId: false },
    J: { name: 'DensityVolumePerCount', type: 'xs:long', isPrimaryId: false },
}
const CHILD_TAGS = {
    PRN: { name: 'ProductRelation' },
}

export class Product implements Entity {
    public tag = TAGS.Product

    constructor(public attributes: ProductAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Product): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Product, Product)
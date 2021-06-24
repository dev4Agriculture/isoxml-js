import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { ProductRelation } from './ProductRelation'

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

export type ProductAttributes = {
    ProductId: string
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
    A: { name: 'ProductId', type: 'xs:ID' },
    B: { name: 'ProductDesignator', type: 'xs:string' },
    C: { name: 'ProductGroupIdRef', type: 'xs:IDREF' },
    D: { name: 'ValuePresentationIdRef', type: 'xs:IDREF' },
    E: { name: 'QuantityDDI', type: 'xs:hexBinary' },
    F: { name: 'ProductType', type: 'xs:NMTOKEN' },
    G: { name: 'MixtureRecipeQuantity', type: 'xs:long' },
    H: { name: 'DensityMassPerVolume', type: 'xs:long' },
    I: { name: 'DensityMassPerCount', type: 'xs:long' },
    J: { name: 'DensityVolumePerCount', type: 'xs:long' },
}
const CHILD_TAGS = {
    PRN: { name: 'ProductRelation' },
}

export class Product implements Entity {
    public tag = 'PDT'

    constructor(public attributes: ProductAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, Product, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('PDT', Product)
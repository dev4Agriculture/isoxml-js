import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { CropVariety } from './CropVariety'

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

export type CropTypeAttributes = {
    CropTypeId: string
    CropTypeDesignator: string
    ProductGroupIdRef?: ISOXMLReference
    CropVariety?: CropVariety[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CropTypeId', type: 'xs:ID' },
    B: { name: 'CropTypeDesignator', type: 'xs:string' },
    C: { name: 'ProductGroupIdRef', type: 'xs:IDREF' },
}
const CHILD_TAGS = {
    CVT: { name: 'CropVariety' },
}

export class CropType implements Entity {
    public tag = 'CTP'

    constructor(public attributes: CropTypeAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, CropType, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('CTP', CropType)
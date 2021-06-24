import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type CropVarietyAttributes = {
    CropVarietyId: string
    CropVarietyDesignator: string
    ProductIdRef?: ISOXMLReference
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CropVarietyId', type: 'xs:ID' },
    B: { name: 'CropVarietyDesignator', type: 'xs:string' },
    C: { name: 'ProductIdRef', type: 'xs:IDREF' },
}
const CHILD_TAGS = {
}

export class CropVariety implements Entity {
    public tag = 'CVT'

    constructor(public attributes: CropVarietyAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = CropVariety): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('CVT', CropVariety)
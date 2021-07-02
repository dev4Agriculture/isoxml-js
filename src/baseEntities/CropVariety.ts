import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type CropVarietyAttributes = {
    CropVarietyDesignator: string
    ProductIdRef?: ISOXMLReference
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CropVarietyId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'CropVarietyDesignator', type: 'xs:string', isPrimaryId: false },
    C: { name: 'ProductIdRef', type: 'xs:IDREF', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class CropVariety implements Entity {
    public tag = TAGS.CropVariety

    constructor(public attributes: CropVarietyAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = CropVariety): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.CropVariety, CropVariety)
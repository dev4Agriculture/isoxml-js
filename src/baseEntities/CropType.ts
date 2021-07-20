import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { CropVariety } from './CropVariety'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type CropTypeAttributes = {
    CropTypeDesignator: string
    ProductGroupIdRef?: ISOXMLReference
    CropVariety?: CropVariety[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CropTypeId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'CropTypeDesignator', type: 'xs:string', isPrimaryId: false },
    C: { name: 'ProductGroupIdRef', type: 'xs:IDREF', isPrimaryId: false },
}
const CHILD_TAGS = {
    CVT: { name: 'CropVariety' },
}

export class CropType implements Entity {
    public tag = TAGS.CropType

    constructor(public attributes: CropTypeAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = CropType): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.CropType, CropType)
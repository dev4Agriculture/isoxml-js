import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { CropVariety } from './CropVariety'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type CropTypeAttributes = {
    CropTypeDesignator: string
    ProductGroupIdRef?: ISOXMLReference
    CropVariety?: CropVariety[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'CropTypeId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'CropTypeDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    C: {
        name: 'ProductGroupIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: true,
    },
}
const CHILD_TAGS = {
    CVT: { name: 'CropVariety', isOnlyV4: false },
}

export class CropType implements Entity {
    public tag = TAGS.CropType

    constructor(public attributes: CropTypeAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = CropType): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.CropType, CropType)
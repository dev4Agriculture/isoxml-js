import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'


import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type OperTechPracticeAttributes = {
    CulturalPracticeIdRef: ISOXMLReference
    OperationTechniqueIdRef?: ISOXMLReference
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'CulturalPracticeIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'OperationTechniqueIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
}
const CHILD_TAGS = {
}

export class OperTechPractice implements Entity {
    public tag = TAGS.OperTechPractice

    constructor(public attributes: OperTechPracticeAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = OperTechPractice): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.OperTechPractice, OperTechPractice)
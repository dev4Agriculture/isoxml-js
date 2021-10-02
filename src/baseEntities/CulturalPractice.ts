import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { OperationTechniqueReference } from './OperationTechniqueReference'

import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type CulturalPracticeAttributes = {
    CulturalPracticeDesignator: string
    OperationTechniqueReference?: OperationTechniqueReference[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'CulturalPracticeId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'CulturalPracticeDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
}
const CHILD_TAGS = {
    OTR: { name: 'OperationTechniqueReference', isOnlyV4: false },
}

export class CulturalPractice implements Entity {
    public tag = TAGS.CulturalPractice

    constructor(public attributes: CulturalPracticeAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = CulturalPractice): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.CulturalPractice, CulturalPractice)
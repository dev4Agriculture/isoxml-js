import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { OperationTechniqueReference } from './OperationTechniqueReference'

import { Entity, AttributesDescription } from '../types'

export type CulturalPracticeAttributes = {
    CulturalPracticeId: string
    CulturalPracticeDesignator: string
    OperationTechniqueReference?: OperationTechniqueReference[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CulturalPracticeId', type: 'xs:ID' },
    B: { name: 'CulturalPracticeDesignator', type: 'xs:string' },
}
const CHILD_TAGS = {
    OTR: { name: 'OperationTechniqueReference' },
}

export class CulturalPractice implements Entity {
    public tag = 'CPC'

    constructor(public attributes: CulturalPracticeAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, CulturalPractice, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('CPC', CulturalPractice)
import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type OperTechPracticeAttributes = {
    CulturalPracticeIdRef: ISOXMLReference
    OperationTechniqueIdRef?: ISOXMLReference
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CulturalPracticeIdRef', type: 'xs:IDREF', isPrimaryId: false },
    B: { name: 'OperationTechniqueIdRef', type: 'xs:IDREF', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class OperTechPractice implements Entity {
    public tag = 'OTP'

    constructor(public attributes: OperTechPracticeAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = OperTechPractice): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('OTP', OperTechPractice)
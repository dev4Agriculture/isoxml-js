import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

export type OperTechPracticeAttributes = {
    CulturalPracticeIdRef: ISOXMLReference
    OperationTechniqueIdRef?: ISOXMLReference
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CulturalPracticeIdRef', type: 'xs:IDREF' },
    B: { name: 'OperationTechniqueIdRef', type: 'xs:IDREF' },
}
const CHILD_TAGS = {
}

export class OperTechPractice implements Entity {
    public tag = 'OTP'

    constructor(public attributes: OperTechPracticeAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, OperTechPractice, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('OTP', OperTechPractice)
import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

export type OperationTechniqueReferenceAttributes = {
    OperationTechniqueIdRef: ISOXMLReference
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'OperationTechniqueIdRef', type: 'xs:IDREF' },
}
const CHILD_TAGS = {
}

export class OperationTechniqueReference implements Entity {
    public tag = 'OTR'

    constructor(public attributes: OperationTechniqueReferenceAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, OperationTechniqueReference, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('OTR', OperationTechniqueReference)
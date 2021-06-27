import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type OperationTechniqueReferenceAttributes = {
    OperationTechniqueIdRef: ISOXMLReference
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'OperationTechniqueIdRef', type: 'xs:IDREF', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class OperationTechniqueReference implements Entity {
    public tag = 'OTR'

    constructor(public attributes: OperationTechniqueReferenceAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = OperationTechniqueReference): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('OTR', OperationTechniqueReference)
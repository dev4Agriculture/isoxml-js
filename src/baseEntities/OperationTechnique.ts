import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type OperationTechniqueAttributes = {
    OperationTechniqueId: string
    OperationTechniqueDesignator: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'OperationTechniqueId', type: 'xs:ID' },
    B: { name: 'OperationTechniqueDesignator', type: 'xs:string' },
}
const CHILD_TAGS = {
}

export class OperationTechnique implements Entity {
    public tag = 'OTQ'

    constructor(public attributes: OperationTechniqueAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = OperationTechnique): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('OTQ', OperationTechnique)
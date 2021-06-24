import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type CodedCommentListValueAttributes = {
    CodedCommentListValueId: string
    CodedCommentListValueDesignator: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CodedCommentListValueId', type: 'xs:ID' },
    B: { name: 'CodedCommentListValueDesignator', type: 'xs:string' },
}
const CHILD_TAGS = {
}

export class CodedCommentListValue implements Entity {
    public tag = 'CCL'

    constructor(public attributes: CodedCommentListValueAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = CodedCommentListValue): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('CCL', CodedCommentListValue)
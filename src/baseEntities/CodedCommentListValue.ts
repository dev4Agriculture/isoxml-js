import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type CodedCommentListValueAttributes = {
    CodedCommentListValueDesignator: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CodedCommentListValueId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'CodedCommentListValueDesignator', type: 'xs:string', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class CodedCommentListValue implements Entity {
    public tag = 'CCL'

    constructor(public attributes: CodedCommentListValueAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = CodedCommentListValue): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('CCL', CodedCommentListValue)
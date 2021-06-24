import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription } from '../types'

export type CodedCommentGroupAttributes = {
    CodedCommentGroupId: string
    CodedCommentGroupDesignator: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CodedCommentGroupId', type: 'xs:ID' },
    B: { name: 'CodedCommentGroupDesignator', type: 'xs:string' },
}
const CHILD_TAGS = {
}

export class CodedCommentGroup implements Entity {
    public tag = 'CCG'

    constructor(public attributes: CodedCommentGroupAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, CodedCommentGroup, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('CCG', CodedCommentGroup)
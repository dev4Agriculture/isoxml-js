import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { CodedCommentListValue } from './CodedCommentListValue'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type CodedCommentAttributes = {
    CodedCommentId: string
    CodedCommentDesignator: string
    CodedCommentScope: string
    CodedCommentGroupIdRef?: ISOXMLReference
    CodedCommentListValue?: CodedCommentListValue[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CodedCommentId', type: 'xs:ID' },
    B: { name: 'CodedCommentDesignator', type: 'xs:string' },
    C: { name: 'CodedCommentScope', type: 'xs:NMTOKEN' },
    D: { name: 'CodedCommentGroupIdRef', type: 'xs:IDREF' },
}
const CHILD_TAGS = {
    CCL: { name: 'CodedCommentListValue' },
}

export class CodedComment implements Entity {
    public tag = 'CCT'

    constructor(public attributes: CodedCommentAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = CodedComment): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('CCT', CodedComment)
import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { CodedCommentListValue } from './CodedCommentListValue'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type CodedCommentAttributes = {
    CodedCommentDesignator: string
    CodedCommentScope: string
    CodedCommentGroupIdRef?: ISOXMLReference
    CodedCommentListValue?: CodedCommentListValue[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CodedCommentId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'CodedCommentDesignator', type: 'xs:string', isPrimaryId: false },
    C: { name: 'CodedCommentScope', type: 'xs:NMTOKEN', isPrimaryId: false },
    D: { name: 'CodedCommentGroupIdRef', type: 'xs:IDREF', isPrimaryId: false },
}
const CHILD_TAGS = {
    CCL: { name: 'CodedCommentListValue' },
}

export class CodedComment implements Entity {
    public tag = TAGS.CodedComment

    constructor(public attributes: CodedCommentAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = CodedComment): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.CodedComment, CodedComment)
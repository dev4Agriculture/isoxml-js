import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { CodedCommentListValue } from './CodedCommentListValue'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export const enum CodedCommentCodedCommentScopeEnum {
    Point = '1',
    Global = '2',
    Continuous = '3',
}

export type CodedCommentAttributes = {
    CodedCommentDesignator: string
    CodedCommentScope: CodedCommentCodedCommentScopeEnum
    CodedCommentGroupIdRef?: ISOXMLReference
    CodedCommentListValue?: CodedCommentListValue[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'CodedCommentId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: false,
        isOnlyV4: false
    },
    B: {
        name: 'CodedCommentDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false
    },
    C: {
        name: 'CodedCommentScope',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false
    },
    D: {
        name: 'CodedCommentGroupIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false
    },
}
const CHILD_TAGS = {
    CCL: { name: 'CodedCommentListValue', isOnlyV4: false },
}

export class CodedComment implements Entity {
    public tag = TAGS.CodedComment

    constructor(public attributes: CodedCommentAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = CodedComment): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.CodedComment, CodedComment)
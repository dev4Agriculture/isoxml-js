import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type CodedCommentListValueAttributes = {
    CodedCommentListValueDesignator: string
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CodedCommentListValueId', type: 'xs:ID', isPrimaryId: true, isOnlyV4: false },
    B: { name: 'CodedCommentListValueDesignator', type: 'xs:string', isPrimaryId: false, isOnlyV4: false },
}
const CHILD_TAGS = {
}

export class CodedCommentListValue implements Entity {
    public tag = TAGS.CodedCommentListValue

    constructor(public attributes: CodedCommentListValueAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = CodedCommentListValue): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.CodedCommentListValue, CodedCommentListValue)
import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type CodedCommentGroupAttributes = {
    CodedCommentGroupDesignator: string
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CodedCommentGroupId', type: 'xs:ID', isPrimaryId: true, isOnlyV4: false },
    B: { name: 'CodedCommentGroupDesignator', type: 'xs:string', isPrimaryId: false, isOnlyV4: false },
}
const CHILD_TAGS = {
}

export class CodedCommentGroup implements Entity {
    public tag = TAGS.CodedCommentGroup

    constructor(public attributes: CodedCommentGroupAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = CodedCommentGroup): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.CodedCommentGroup, CodedCommentGroup)
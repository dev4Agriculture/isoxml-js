import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'


import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type CodedCommentListValueAttributes = {
    CodedCommentListValueDesignator: string
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'CodedCommentListValueId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'CodedCommentListValueDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
}
const CHILD_TAGS = {
}

export class CodedCommentListValue implements Entity {
    public tag = TAGS.CodedCommentListValue

    constructor(public attributes: CodedCommentListValueAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = CodedCommentListValue): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.CodedCommentListValue, CodedCommentListValue)
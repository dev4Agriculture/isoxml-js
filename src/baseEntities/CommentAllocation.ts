import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { AllocationStamp } from './AllocationStamp'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type CommentAllocationAttributes = {
    CodedCommentIdRef?: ISOXMLReference
    CodedCommentListValueIdRef?: ISOXMLReference
    FreeCommentText?: string
    AllocationStamp?: AllocationStamp[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CodedCommentIdRef', type: 'xs:IDREF', isPrimaryId: false },
    B: { name: 'CodedCommentListValueIdRef', type: 'xs:IDREF', isPrimaryId: false },
    C: { name: 'FreeCommentText', type: 'xs:string', isPrimaryId: false },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp' },
}

export class CommentAllocation implements Entity {
    public tag = 'CAN'

    constructor(public attributes: CommentAllocationAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = CommentAllocation): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('CAN', CommentAllocation)
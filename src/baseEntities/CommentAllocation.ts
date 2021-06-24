import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { AllocationStamp } from './AllocationStamp'

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

export type CommentAllocationAttributes = {
    CodedCommentIdRef?: ISOXMLReference
    CodedCommentListValueIdRef?: ISOXMLReference
    FreeCommentText?: string
    AllocationStamp?: AllocationStamp[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'CodedCommentIdRef', type: 'xs:IDREF' },
    B: { name: 'CodedCommentListValueIdRef', type: 'xs:IDREF' },
    C: { name: 'FreeCommentText', type: 'xs:string' },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp' },
}

export class CommentAllocation implements Entity {
    public tag = 'CAN'

    constructor(public attributes: CommentAllocationAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, CommentAllocation, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('CAN', CommentAllocation)
import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type LinkAttributes = {
    ObjectIdRef: ISOXMLReference
    LinkValue: string
    LinkDesignator?: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ObjectIdRef', type: 'xs:IDREF', isPrimaryId: false },
    B: { name: 'LinkValue', type: 'xs:token', isPrimaryId: false },
    C: { name: 'LinkDesignator', type: 'xs:string', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class Link implements Entity {
    public tag = TAGS.Link

    constructor(public attributes: LinkAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Link): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Link, Link)
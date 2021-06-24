import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

export type LinkAttributes = {
    ObjectIdRef: ISOXMLReference
    LinkValue: string
    LinkDesignator?: string
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ObjectIdRef', type: 'xs:IDREF' },
    B: { name: 'LinkValue', type: 'xs:token' },
    C: { name: 'LinkDesignator', type: 'xs:string' },
}
const CHILD_TAGS = {
}

export class Link implements Entity {
    public tag = 'LNK'

    constructor(public attributes: LinkAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, Link, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('LNK', Link)
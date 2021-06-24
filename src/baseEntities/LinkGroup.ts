import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { Link } from './Link'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type LinkGroupAttributes = {
    LinkGroupId: string
    LinkGroupType: string
    ManufacturerGLN?: string
    LinkGroupNamespace?: string
    LinkGroupDesignator?: string
    Link?: Link[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'LinkGroupId', type: 'xs:ID' },
    B: { name: 'LinkGroupType', type: 'xs:NMTOKEN' },
    C: { name: 'ManufacturerGLN', type: 'xs:anyURI' },
    D: { name: 'LinkGroupNamespace', type: 'xs:token' },
    E: { name: 'LinkGroupDesignator', type: 'xs:string' },
}
const CHILD_TAGS = {
    LNK: { name: 'Link' },
}

export class LinkGroup implements Entity {
    public tag = 'LGP'

    constructor(public attributes: LinkGroupAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = LinkGroup): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('LGP', LinkGroup)
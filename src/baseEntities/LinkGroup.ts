import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { Link } from './Link'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export enum LinkGroupLinkGroupTypeEnum {
    UUIDs = '1',
    ManufacturerProprietary = '2',
    UniqueResolvableURIs = '3',
    InformationalResolvableURIs = '4',
}

export type LinkGroupAttributes = {
    LinkGroupType: LinkGroupLinkGroupTypeEnum
    ManufacturerGLN?: string
    LinkGroupNamespace?: string
    LinkGroupDesignator?: string
    Link?: Link[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'LinkGroupId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: false,
        isOnlyV4: undefined,
    },
    B: {
        name: 'LinkGroupType',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    C: {
        name: 'ManufacturerGLN',
        type: 'xs:anyURI',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined,
    },
    D: {
        name: 'LinkGroupNamespace',
        type: 'xs:token',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined,
    },
    E: {
        name: 'LinkGroupDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: undefined,
    },
}
const CHILD_TAGS = {
    LNK: { name: 'Link', isOnlyV4: undefined },
}

export class LinkGroup implements Entity {
    public tag = TAGS.LinkGroup

    constructor(public attributes: LinkGroupAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = LinkGroup): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.LinkGroup, LinkGroup)
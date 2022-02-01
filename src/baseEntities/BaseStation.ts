import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'


import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type BaseStationAttributes = {
    BaseStationDesignator: string
    BaseStationNorth: number
    BaseStationEast: number
    BaseStationUp: number
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'BaseStationId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: false,
        isOnlyV4: undefined,
    },
    B: {
        name: 'BaseStationDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    C: {
        name: 'BaseStationNorth',
        type: 'xs:decimal',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
        minValue: -90,
        maxValue: 90,
        fractionDigits: 9,
    },
    D: {
        name: 'BaseStationEast',
        type: 'xs:decimal',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
        minValue: -180,
        maxValue: 180,
        fractionDigits: 9,
    },
    E: {
        name: 'BaseStationUp',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
        minValue: -2147483647,
        maxValue: 2147483647,
    },
}
const CHILD_TAGS = {
}

export class BaseStation implements Entity {
    public tag = TAGS.BaseStation

    constructor(public attributes: BaseStationAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = BaseStation): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.BaseStation, BaseStation)
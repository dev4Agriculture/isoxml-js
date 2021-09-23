import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export enum GridGridTypeEnum {
    GridType1 = '1',
    GridType2 = '2',
}

export type GridAttributes = {
    GridMinimumNorthPosition: number
    GridMinimumEastPosition: number
    GridCellNorthSize: number
    GridCellEastSize: number
    GridMaximumColumn: number
    GridMaximumRow: number
    Filename: string
    Filelength?: number
    GridType: GridGridTypeEnum
    TreatmentZoneCode?: number
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'GridMinimumNorthPosition',
        type: 'xs:decimal',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: -90,
        maxValue: 90,
        fractionDigits: 9,
    },
    B: {
        name: 'GridMinimumEastPosition',
        type: 'xs:decimal',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: -180,
        maxValue: 180,
        fractionDigits: 9,
    },
    C: {
        name: 'GridCellNorthSize',
        type: 'xs:double',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 1,
    },
    D: {
        name: 'GridCellEastSize',
        type: 'xs:double',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 1,
    },
    E: {
        name: 'GridMaximumColumn',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 4294967295,
    },
    F: {
        name: 'GridMaximumRow',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 4294967295,
    },
    G: {
        name: 'Filename',
        type: 'xs:ID',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    H: {
        name: 'Filelength',
        type: 'xs:unsignedLong',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 4294967294,
    },
    I: {
        name: 'GridType',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    J: {
        name: 'TreatmentZoneCode',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 254,
    },
}
const CHILD_TAGS = {
}

export class Grid implements Entity {
    public tag = TAGS.Grid

    constructor(public attributes: GridAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = Grid): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Grid, Grid)
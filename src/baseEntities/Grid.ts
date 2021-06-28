import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export const enum GridGridTypeEnum {
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
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'GridMinimumNorthPosition', type: 'xs:decimal', isPrimaryId: false },
    B: { name: 'GridMinimumEastPosition', type: 'xs:decimal', isPrimaryId: false },
    C: { name: 'GridCellNorthSize', type: 'xs:double', isPrimaryId: false },
    D: { name: 'GridCellEastSize', type: 'xs:double', isPrimaryId: false },
    E: { name: 'GridMaximumColumn', type: 'xs:unsignedLong', isPrimaryId: false },
    F: { name: 'GridMaximumRow', type: 'xs:unsignedLong', isPrimaryId: false },
    G: { name: 'Filename', type: 'xs:ID', isPrimaryId: false },
    H: { name: 'Filelength', type: 'xs:unsignedLong', isPrimaryId: false },
    I: { name: 'GridType', type: 'xs:NMTOKEN', isPrimaryId: false },
    J: { name: 'TreatmentZoneCode', type: 'xs:unsignedByte', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class Grid implements Entity {
    public tag = TAGS.Grid

    constructor(public attributes: GridAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Grid): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Grid, Grid)
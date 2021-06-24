import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription } from '../types'

export type GridAttributes = {
    GridMinimumNorthPosition: number
    GridMinimumEastPosition: number
    GridCellNorthSize: number
    GridCellEastSize: number
    GridMaximumColumn: number
    GridMaximumRow: number
    Filename: string
    Filelength?: number
    GridType: string
    TreatmentZoneCode?: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'GridMinimumNorthPosition', type: 'xs:decimal' },
    B: { name: 'GridMinimumEastPosition', type: 'xs:decimal' },
    C: { name: 'GridCellNorthSize', type: 'xs:double' },
    D: { name: 'GridCellEastSize', type: 'xs:double' },
    E: { name: 'GridMaximumColumn', type: 'xs:unsignedLong' },
    F: { name: 'GridMaximumRow', type: 'xs:unsignedLong' },
    G: { name: 'Filename', type: 'xs:ID' },
    H: { name: 'Filelength', type: 'xs:unsignedLong' },
    I: { name: 'GridType', type: 'xs:NMTOKEN' },
    J: { name: 'TreatmentZoneCode', type: 'xs:unsignedByte' },
}
const CHILD_TAGS = {
}

export class Grid implements Entity {
    public tag = 'GRD'

    constructor(public attributes: GridAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, Grid, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('GRD', Grid)
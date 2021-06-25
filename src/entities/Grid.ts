import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../../src/ISOXMLManager'
import { registerEntityClass } from '../../src/classRegistry'

import {Entity} from '../../src/types'

import {Grid, GridAttributes} from '../baseEntities/Grid'

export class ExtendedGrid extends Grid {

    binaryData: Uint8Array

    constructor(attributes: GridAttributes) {
        super(attributes)
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        const entity = Grid.fromXML(xml, isoxmlManager, ExtendedGrid) as ExtendedGrid
        const filename = entity.attributes.Filename
        const regex = new RegExp(`${filename}\\.BIN$`, 'i')
        const file = isoxmlManager.parsedFiles.find(f => !!f.filename.match(regex))
        entity.binaryData = file.data as Uint8Array
        return entity
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        isoxmlManager.addFileToSave(this.binaryData, true, 'GRD', this.attributes.Filename)
        return super.toXML(isoxmlManager)
    }
}

registerEntityClass('GRD', ExtendedGrid)

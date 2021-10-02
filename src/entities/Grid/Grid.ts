import {FeatureCollection } from '@turf/turf'

import { ISOXMLManager } from '../../ISOXMLManager'
import { registerEntityClass } from '../../classRegistry'
import { Entity, XMLElement } from '../../types'

import { Grid, GridAttributes, GridGridTypeEnum } from '../../baseEntities/Grid'
import { TAGS } from '../../baseEntities/constants'
import { createGridParamsGenerator } from './DefaultGridParamsGenerator'
import { cellCenterBasedGridGenerator } from './CellCenterBasedGridGenerator'

const GRID_CELL_SIZE = 10 // meters

export type GridParameters = {
    minX: number,
    minY: number,
    numCols: number,
    numRows: number,
    cellWidth: number,
    cellHeight: number
}

export type GridParametersGenerator = (geometry: FeatureCollection) => GridParameters
export type GridGenerator = (geometry: FeatureCollection, gridParams: GridParameters) => ArrayBuffer

export class ExtendedGrid extends Grid {
    public tag = TAGS.Grid

    public binaryData: Uint8Array

    constructor(attributes: GridAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static async fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
        const entity = await Grid.fromXML(xml, isoxmlManager, internalId, ExtendedGrid) as ExtendedGrid
        const filename = entity.attributes.Filename
        entity.binaryData = await isoxmlManager.getParsedFile(`${filename}.BIN`, true)
        return entity
    }

    static fromGeoJSON(
        geoJSON: FeatureCollection,
        isoxmlManager: ISOXMLManager,
        treatmentZoneCode?: number
    ): ExtendedGrid {
        const gridParamsGenerator = 
            isoxmlManager.options.gridRaramsGenerator ||
            createGridParamsGenerator(GRID_CELL_SIZE, GRID_CELL_SIZE)

        const gridParams = gridParamsGenerator(geoJSON)

        const gridGenerator: GridGenerator = 
            isoxmlManager.options.gridGenerator ||
            cellCenterBasedGridGenerator

        const {minX, minY, numCols, numRows, cellWidth, cellHeight} = gridParams
        const buffer = gridGenerator(geoJSON, gridParams)

        const filename = isoxmlManager.generateUniqueFilename(TAGS.Grid)

        isoxmlManager.addFileToSave(new Uint8Array(buffer), `${filename}.BIN`)

        const entity = new ExtendedGrid({
            GridMinimumNorthPosition: minY,
            GridMinimumEastPosition: minX,
            GridCellNorthSize: cellHeight,
            GridCellEastSize: cellWidth,
            GridMaximumColumn: numCols,
            GridMaximumRow: numRows,
            Filename: filename,
            Filelength: numCols * numRows * 4,
            GridType: GridGridTypeEnum.GridType2,
            ...typeof treatmentZoneCode === 'number' && {TreatmentZoneCode: treatmentZoneCode}
        }, isoxmlManager)

        entity.binaryData = new Uint8Array(buffer)

        return entity
    }

    toXML(): XMLElement { 
        this.isoxmlManager.addFileToSave(this.binaryData, `${this.attributes.Filename}.BIN`) 
        return super.toXML() 
    } 

    toGeoJSON(): FeatureCollection {
        const cells = new Int32Array(this.binaryData.buffer)
        const rows = this.attributes.GridMaximumRow
        const cols = this.attributes.GridMaximumColumn
        const w = this.attributes.GridCellEastSize
        const h = this.attributes.GridCellNorthSize
        const minX = this.attributes.GridMinimumEastPosition
        const minY = this.attributes.GridMinimumNorthPosition

        const features = new Array(rows * cols)

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const dose = cells[y * cols + x]
                if (dose === 0.0) {
                    features[y * cols + x] = null
                    continue
                }
                features[y * cols + x] = {
                    type: 'Feature',
                    properties: {
                        DOSE: dose
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[
                            [minX + x * w,     minY + y * h],
                            [minX + x * w + w, minY + y * h],
                            [minX + x * w + w, minY + y * h + h],
                            [minX + x * w,     minY + y * h + h],
                            [minX + x * w,     minY + y * h]
                        ]]
                    }
                }
            }
        }
        return {
            type: 'FeatureCollection',
            features: features.filter(e => e)
        }
    }
}

registerEntityClass(TAGS.Grid, ExtendedGrid)

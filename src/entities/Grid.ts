import { area, bbox as turfBbox, degreesToRadians, FeatureCollection, lengthToDegrees } from '@turf/turf'
import { intersection, Polygon } from 'polygon-clipping'
import RBush from 'rbush'

import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../../src/ISOXMLManager'
import { registerEntityClass } from '../../src/classRegistry'

import {Entity} from '../../src/types'

import {Grid, GridAttributes} from '../baseEntities/Grid'

const GRID_CELL_SIZE = 10 // meters

export type GridParameters = {
    minX: number,
    minY: number,
    numCols: number,
    numRows: number,
    cellWidth: number,
    cellHeight: number
}

export function createGridParamsGenerator (targetCellWidth: number, targetCellHeight: number) { 
    return (geometry: any) => {
        const [minX, minY, maxX, maxY] = turfBbox(geometry)

        const sizeY = lengthToDegrees(targetCellHeight, 'meters')
        const sizeX = lengthToDegrees(targetCellWidth, 'meters') / Math.cos(degreesToRadians((minY + maxY) / 2)) // works fine for small areas

        const numCols = Math.floor((maxX - minX) / sizeX)
        const numRows = Math.floor((maxY - minY) / sizeY)

        return {
            minX,
            minY,
            numCols,
            numRows,
            cellWidth: (maxX - minX) / numCols,
            cellHeight: (maxY - minY) / numRows
        }
    }    
}

export class ExtendedGrid extends Grid {

    public binaryData: Uint8Array

    constructor(attributes: GridAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        const entity = Grid.fromXML(xml, isoxmlManager, ExtendedGrid) as ExtendedGrid
        const filename = entity.attributes.Filename
        const regex = new RegExp(`${filename}\\.BIN$`, 'i')
        const file = isoxmlManager.parsedFiles.find(f => !!f.filename.match(regex))
        entity.binaryData = file.data as Uint8Array
        return entity
    }

    toXML(): ElementCompact {
        this.isoxmlManager.addFileToSave(this.binaryData, true, 'GRD', this.attributes.Filename)
        return super.toXML()
    }

    static fromGeoJSON(geoJSON: FeatureCollection, isoxmlManager: ISOXMLManager, treatmentZoneCode?: number): ExtendedGrid {
        const gridParamsGenerator = createGridParamsGenerator(GRID_CELL_SIZE, GRID_CELL_SIZE)

        const {minX, minY, numCols, numRows, cellWidth, cellHeight} = gridParamsGenerator(geoJSON)

        const filelength = numCols * numRows * 4
        const buffer = new ArrayBuffer(filelength)
        const int32array = new Int32Array(buffer)

        const tree = new RBush()
            tree.load(geoJSON.features.map(f => {
            const [bboxMinX, bboxMinY, bboxMaxX, bboxMaxY] = turfBbox(f)
            return {minX: bboxMinX, minY: bboxMinY, maxX: bboxMaxX, maxY: bboxMaxY, feature: f}
        }))

        for (let y = 0; y < numRows; y++) {
            for (let x = 0; x < numCols; x++) {

                // Simplified algorithm: just check the center of cell
                // const lng = minX + (x + 0.5) * cellWidth
                // const lat = minY + (y + 0.5) * cellHeight
                // const searchResults = tree.search({minX: lng, minY: lat, maxX: lng, maxY: lat})
                // const feature = searchResults.find(res => booleanPointInPolygon([lng, lat], res.feature))?.feature

                const searchResults = tree.search({
                    minX: minX + x * cellWidth,
                    minY: minY + y * cellHeight,
                    maxX: minX + (x + 1) * cellWidth,
                    maxY: minY + (y + 1) * cellHeight
                })

                const cell = [[
                    [minX + x * cellWidth,       minY + y * cellHeight],
                    [minX + x * cellWidth,       minY + (y + 1) * cellHeight],
                    [minX + (x + 1) * cellWidth, minY + (y + 1) * cellHeight],
                    [minX + (x + 1) * cellWidth, minY + y * cellHeight],
                    [minX + x * cellWidth,       minY + y * cellHeight]
                ]] as Polygon

                let feature = null;
                let maxArea = 0;
                searchResults.forEach(res => {
                    const intersectionRes = intersection(res.feature.geometry.coordinates, cell)
                    if (intersection.length) {
                        const intersectionArea = area({type: 'MultiPolygon', coordinates: intersectionRes})
                        if (intersectionArea > maxArea) {
                        feature = res.feature
                        maxArea = intersectionArea
                        }
                    }
                })

                const value = feature ? feature.properties.DOSE : 0

                int32array[y * numCols + x] = value
            }
        }

        const filename = isoxmlManager.addFileToSave(new Uint8Array(buffer), true, 'GRD')

        const entity = new ExtendedGrid({
            GridMinimumNorthPosition: minY,
            GridMinimumEastPosition: minX,
            GridCellNorthSize: cellHeight,
            GridCellEastSize: cellWidth,
            GridMaximumColumn: numCols,
            GridMaximumRow: numRows,
            Filename: filename,
            Filelength: numCols * numRows * 4,
            GridType: '2',
            ...typeof treatmentZoneCode === 'number' && {TreatmentZoneCode: treatmentZoneCode}
        }, isoxmlManager)

        entity.binaryData = new Uint8Array(buffer)

        return entity
    }
}

registerEntityClass('GRD', ExtendedGrid)

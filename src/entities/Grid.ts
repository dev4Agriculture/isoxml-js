import { area, bbox as turfBbox, degreesToRadians, FeatureCollection, lengthToDegrees } from '@turf/turf'
import { intersection, Polygon } from 'polygon-clipping'
import RBush from 'rbush'
import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { Entity } from '../types'

import { Grid, GridAttributes, GridGridTypeEnum } from '../baseEntities/Grid'
import { TAGS } from '../baseEntities/constants'

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

export function createGridParamsGenerator (
    targetCellWidth: number,
    targetCellHeight: number
): GridParametersGenerator { 
    return (geometry: any) => {
        const [minX, minY, maxX, maxY] = turfBbox(geometry)

        const sizeY = lengthToDegrees(targetCellHeight, 'meters')

        // works fine for small areas
        const sizeX = lengthToDegrees(targetCellWidth, 'meters') / Math.cos(degreesToRadians((minY + maxY) / 2))

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
    public tag = TAGS.Grid

    public binaryData: Uint8Array

    constructor(attributes: GridAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static async fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
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

        const {minX, minY, numCols, numRows, cellWidth, cellHeight} = gridParamsGenerator(geoJSON)

        const filelength = numCols * numRows * 4
        const buffer = new ArrayBuffer(filelength)
        const int32array = new Int32Array(buffer)

        const tree = new RBush<{feature: any}>()
        tree.load(geoJSON.features.map(f => {
            const [bboxMinX, bboxMinY, bboxMaxX, bboxMaxY] = turfBbox(f)
            return {minX: bboxMinX, minY: bboxMinY, maxX: bboxMaxX, maxY: bboxMaxY, feature: f}
        }))
        console.log("Cells: X: "+ numRows + " Y: " + numCols)

        for (let y = 0; y < numRows; y++) {
            const subTree = new RBush<{feature: any}>()
            subTree.load(tree.search({
                minX: minX ,
                minY: minY + y * cellHeight,
                maxX: minX + (numCols) * cellWidth,
                maxY: minY + (y + 1) * cellHeight
            }))
            for (let x = 0; x < numCols; x++) {

                // Simplified algorithm: just check the center of cell
                // const lng = minX + (x + 0.5) * cellWidth
                // const lat = minY + (y + 0.5) * cellHeight
                // const searchResults = tree.search({minX: lng, minY: lat, maxX: lng, maxY: lat})
                // const feature = searchResults.find(res => booleanPointInPolygon([lng, lat], res.feature))?.feature

                const searchResults = subTree.search({
                    minX: minX + x * cellWidth,
                    minY: minY + y * cellHeight,
                    maxX: minX + (x + 1) * cellWidth,
                    maxY: minY + (y + 1) * cellHeight
                })

                let feature = null
                let maxArea = 0
                let halfArea = (cellWidth)*(cellHeight)/2
                if(searchResults.length > 1){
                    const cell = [[
                        [minX + x * cellWidth,       minY + y * cellHeight],
                        [minX + x * cellWidth,       minY + (y + 1) * cellHeight],
                        [minX + (x + 1) * cellWidth, minY + (y + 1) * cellHeight],
                        [minX + (x + 1) * cellWidth, minY + y * cellHeight],
                        [minX + x * cellWidth,       minY + y * cellHeight]
                    ]] as Polygon

                    searchResults.some(res => {
                        const intersectionRes = intersection(res.feature.geometry.coordinates, cell)
                        if (intersection.length) {
                            const intersectionArea = area({type: 'MultiPolygon', coordinates: intersectionRes})
                            if( intersectionArea > halfArea) {
                                feature = res.feature
                                return true;
                            }
                            if (intersectionArea > maxArea) {
                                feature = res.feature
                                maxArea = intersectionArea
                                return false;
                            }
                        }
                    })
                } else if (searchResults.length == 1){
                    feature = searchResults[0].feature
                }


                const value = feature ? feature.properties.DOSE : 0

                int32array[y * numCols + x] = value
            }
        }

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

    toXML(): ElementCompact { 
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

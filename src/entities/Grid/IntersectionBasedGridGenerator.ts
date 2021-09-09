import { area, bbox as turfBbox, FeatureCollection } from "@turf/turf"
import { intersection, Polygon } from 'polygon-clipping'
import RBush from "rbush"

import { GridParameters } from ".."

export function intersectionBasedGridGenerator(geoJSON: FeatureCollection, gridParams: GridParameters): ArrayBuffer {
    const {minX, minY, numCols, numRows, cellWidth, cellHeight} = gridParams

    const filelength = numCols * numRows * 4
    const buffer = new ArrayBuffer(filelength)
    const int32array = new Int32Array(buffer)

    const tree = new RBush<{feature: any}>()
    tree.load(geoJSON.features.map(f => {
        const [bboxMinX, bboxMinY, bboxMaxX, bboxMaxY] = turfBbox(f)
        return {minX: bboxMinX, minY: bboxMinY, maxX: bboxMaxX, maxY: bboxMaxY, feature: f}
    }))

    for (let y = 0; y < numRows; y++) {
        const subTree = new RBush<{feature: any}>()

        // TODO: check that it gives performance boost (test case: many small polygons)
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
            let uncoveredArea = cellWidth * cellHeight
            if (searchResults.length > 0) {
                const cell = [[
                    [minX + x * cellWidth,       minY + y * cellHeight],
                    [minX + x * cellWidth,       minY + (y + 1) * cellHeight],
                    [minX + (x + 1) * cellWidth, minY + (y + 1) * cellHeight],
                    [minX + (x + 1) * cellWidth, minY + y * cellHeight],
                    [minX + x * cellWidth,       minY + y * cellHeight]
                ]] as Polygon

                searchResults.some(res => {
                    const intersectionRes = intersection(res.feature.geometry.coordinates, cell)
                    if (intersectionRes.length) {
                        if (searchResults.length === 1) {
                            feature = res.feature
                            return true
                        }
                        const intersectionArea = area({type: 'MultiPolygon', coordinates: intersectionRes})

                        uncoveredArea -= intersectionArea

                        if (intersectionArea > maxArea) {
                            feature = res.feature
                            maxArea = intersectionArea
                        }

                        return maxArea > uncoveredArea
                    }
                })
            }

            const value = feature ? feature.properties.DOSE : 0

            int32array[y * numCols + x] = Math.round(value)
        }
    }

    return buffer
}
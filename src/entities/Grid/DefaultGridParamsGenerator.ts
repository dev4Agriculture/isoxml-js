import { bbox as turfBbox, degreesToRadians, lengthToDegrees } from '@turf/turf'

import { GridParametersGenerator } from ".."

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
import { bbox as turfBbox, Feature, FeatureCollection, Geometry, Position } from '@turf/turf'
import RBush from 'rbush'
import { GridParameters } from './Grid'

// This is an optimized version of https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-point-in-polygon
export class FeatureFinder {
    private rtree
    private features: any[]
    constructor(featureCollection: FeatureCollection<Geometry>) {
        this.features = featureCollection.features.map(f => {
            const geom = { ...f.geometry }
            if (geom.type === 'Polygon') {
                geom.type = 'MultiPolygon'
                geom.coordinates = [geom.coordinates as Position[][]]
            }

            geom.coordinates = geom.coordinates.map((component) =>
                component.map((ring) =>
                    ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]
                        ? ring.slice(0, ring.length - 1)
                        : ring
                )
            )

            const binaryCoordinates = geom.coordinates.map((component) =>
                component.map((ring) => {
                    const binaryRing = new Float32Array(2 * ring.length)
                    for (let idx = 0; idx < ring.length; idx++) {
                        binaryRing[2 * idx + 0] = ring[idx][0]
                        binaryRing[2 * idx + 1] = ring[idx][1]
                    }
                    return binaryRing
                })
            )

            return {
                type: 'Feature',
                properties: f.properties,
                bbox: turfBbox(f),
                geometry: geom,
                binaryCoordinates
            }
        })

        this.rtree = new RBush()
        this.rtree.load(
            this.features.map((f) => {
                const [bboxMinX, bboxMinY, bboxMaxX, bboxMaxY] = f.bbox
                return { minX: bboxMinX, minY: bboxMinY, maxX: bboxMaxX, maxY: bboxMaxY, feature: f }
            })
        )
    }

    public findFeature(pt: [number, number]): Feature {
        const searchResults = this.rtree.search({ minX: pt[0], minY: pt[1], maxX: pt[0], maxY: pt[1] })
        return searchResults.find(searchItem => {
            const polys = searchItem.feature.binaryCoordinates
            let insidePoly = false
            for (let i = 0; i < polys.length && !insidePoly; i++) {
                // check if it is in the outer ring first
                if (this.inRingTyped(pt, polys[i][0])) {
                    let inHole = false
                    let k = 1
                    // check for the point in any of the holes
                    while (k < polys[i].length && !inHole) {
                        if (this.inRingTyped(pt, polys[i][k])) {
                            inHole = true
                        }
                        k++
                    }
                    if (!inHole) {
                        insidePoly = true
                    }
                }
            }
            return insidePoly
        })?.feature
    }

    private inRingTyped(pt: number[], ring: Float32Array) {
        let isInside = false
        for (let i = 0, j = ring.length / 2 - 1; i < ring.length / 2; j = i++) {
            const xi = ring[2 * i + 0]
            const yi = ring[2 * i + 1]
            const xj = ring[2 * j + 0]
            const yj = ring[2 * j + 1]
            const intersect = yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi
            if (intersect) {
                isInside = !isInside
            }
        }
        return isInside
    }

    // private inRing(pt: number[], ring: number[][]) {
    //     let isInside = false
    //     for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    //         const xi = ring[i][0]
    //         const yi = ring[i][1]
    //         const xj = ring[j][0]
    //         const yj = ring[j][1]
    //         const intersect = yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi
    //         if (intersect) {
    //             isInside = !isInside
    //         }
    //     }
    //     return isInside
    // }
}

// Simplified algorithm: just check the center of cell
export function cellCenterBasedGridGenerator(
    geometry: FeatureCollection<Geometry>,
    gridParams: GridParameters
): ArrayBuffer {
    //   const initDate = +new Date()
    const { minX, minY, numCols, numRows, cellWidth, cellHeight } = gridParams
    const filelength = numCols * numRows * 4
    const buffer = new ArrayBuffer(filelength)
    const int32array = new Int32Array(buffer)

    const featureFinder = new FeatureFinder(geometry)

    //   console.log('finder initialization', +new Date() - initDate)

    for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numCols; x++) {
            const lng = minX + (x + 0.5) * cellWidth
            const lat = minY + (y + 0.5) * cellHeight
            const feature = featureFinder.findFeature([lng, lat])
            const value = feature ? feature.properties.DOSE : 0

            int32array[y * numCols + x] = Math.round(value)
        }
    }
    //   console.log('cells generation', +new Date() - initDate)

    return buffer
}

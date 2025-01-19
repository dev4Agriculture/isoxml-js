import {
    area as turfArea,
    bbox as turfBbox,
    MultiPolygon as TurfMultiPolygon,
    Polygon as TurfPolygon
} from "@turf/turf"
import geomOps from "polygon-clipping"
import { LineStringLineStringTypeEnum, Polygon, PolygonAttributes, PolygonPolygonTypeEnum } from "../baseEntities"
import { TAGS } from "../baseEntities/constants"
import { registerEntityClass } from "../classRegistry"
import { ISOXMLManager } from "../ISOXMLManager"
import { Entity, XMLElement } from "../types"
import { ExtendedLineString } from "./LineString"

export class ExtendedPolygon extends Polygon {
    public tag = TAGS.Polygon

    constructor(attributes: PolygonAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
        return Polygon.fromXML(xml, isoxmlManager, internalId, ExtendedPolygon)
    }

    static fromGeoJSON(
        geoJSON: TurfMultiPolygon | TurfPolygon,
        polygonType: PolygonPolygonTypeEnum,
        isoxmlManager: ISOXMLManager
    ): Polygon[] {
        if (geoJSON.type === 'Polygon') {
            geoJSON = {
                type: 'MultiPolygon',
                coordinates: [geoJSON.coordinates]
            }
        }
        if (isoxmlManager.options.version === 3) {
            const lineStrings = [].concat(
                ...geoJSON.coordinates.map(
                    component => component.map(
                        (ring, idx) => ExtendedLineString.fromGeoJSONCoordinates(
                            ring, 
                            isoxmlManager,
                            idx
                                ? LineStringLineStringTypeEnum.PolygonInterior
                                : LineStringLineStringTypeEnum.PolygonExterior
                        )
                    )
                )
            )

            return [new ExtendedPolygon({
                PolygonType: polygonType,
                LineString: lineStrings
            }, isoxmlManager)]
        } else {
            return geoJSON.coordinates.map(component => new ExtendedPolygon({
                PolygonType: polygonType,
                LineString: component.map(
                    (ring, idx) => ExtendedLineString.fromGeoJSONCoordinates(
                        ring, 
                        isoxmlManager,
                            idx
                                ? LineStringLineStringTypeEnum.PolygonInterior
                                : LineStringLineStringTypeEnum.PolygonExterior
                    )
                )
            }, isoxmlManager))
        }
    }

    // converts polygons to fits format of the target ISOXML version (taken from the first Polygon)
    static normalizePolygons(polygons: Polygon[]): Polygon[] {
        if (!polygons || polygons.length === 0) {
            return []
        }
        const isoxmlManager = polygons[0].isoxmlManager
        if (isoxmlManager.options.version === 3) {
            if (polygons.length === 1) {
                return polygons
            }
            const allLineStrings = [].concat(...polygons.map(poly => poly.attributes.LineString))
            const combinedPolygon = new ExtendedPolygon({
                ...polygons[0].attributes,
                LineString: allLineStrings
            }, isoxmlManager)
            delete combinedPolygon.attributes.PolygonArea // area recalculation is not implemented
            return [combinedPolygon]
        } else {
            const splittedPolygons = []
            polygons.forEach(polygon => {
                const outerRings = polygon.attributes.LineString
                    .filter((ring) => ring.attributes.LineStringType === LineStringLineStringTypeEnum.PolygonExterior)
                if (outerRings.length <= 1) {
                    splittedPolygons.push(polygon)
                    return
                } 

                const innerRings = polygon.attributes.LineString
                    .filter((ring) => ring.attributes.LineStringType === LineStringLineStringTypeEnum.PolygonInterior)

                const outerRingIdxs = innerRings.map((ring) => {
                    let maxArea = 0
                    let bestIdx = -1
                    outerRings.forEach((outerRing, idx) => {
                        const intersectionRes = geomOps.intersection(
                            [(outerRing as ExtendedLineString).toCoordinatesArray()],
                            [(ring as ExtendedLineString).toCoordinatesArray()]
                        )

                        if (intersectionRes) {
                            const areaRes = turfArea({ type: 'MultiPolygon', coordinates: intersectionRes })
                            if (areaRes > maxArea) {
                                maxArea = areaRes
                                bestIdx = idx
                            }
                        }
                    })
                    return bestIdx
                })

                outerRings.forEach((outerRing, outerIdx) => {
                    const splittedPolygon = new ExtendedPolygon({
                        ...polygon.attributes,
                        LineString: [
                            outerRing,
                            ...innerRings.filter((_, innerIdx) => outerRingIdxs[innerIdx] === outerIdx)
                        ]
                    }, isoxmlManager)
                    delete splittedPolygon.attributes.PolygonArea // area recalculation is not implemented
                    splittedPolygons.push(splittedPolygon)
                })
            })
            return splittedPolygons
        }
    }

    static toGeoJSON(polygons: Polygon[]): TurfMultiPolygon {
        if (!polygons || polygons.length === 0) {
            return null
        }

        const geoJSONCoordinates = []

        polygons.forEach(polygon => {
            const outerRings = polygon.attributes.LineString
                .filter((ring) => ring.attributes.LineStringType === LineStringLineStringTypeEnum.PolygonExterior)
                .map((ring: ExtendedLineString) => ring.toCoordinatesArray())

            const innerRings = polygon.attributes.LineString
                .filter((ring) => ring.attributes.LineStringType === LineStringLineStringTypeEnum.PolygonInterior)
                .map((ring: ExtendedLineString) => ring.toCoordinatesArray())

            if (outerRings.length === 0) {
                return
            } else if (outerRings.length === 1) {
                geoJSONCoordinates.push([
                    outerRings[0],
                    ...innerRings
                ])
                return
            }

            const outerRingIdxs = innerRings.map((ring) => {
                let maxArea = 0
                let bestIdx = -1
                outerRings.forEach((outerRing, idx) => {
                    const intersectionRes = geomOps.intersection(
                        [outerRing],
                        [ring]
                    )

                    if (intersectionRes) {
                        const areaRes = turfArea({ type: 'MultiPolygon', coordinates: intersectionRes })
                        if (areaRes > maxArea) {
                            maxArea = areaRes
                            bestIdx = idx
                        }
                    }
                })
                return bestIdx
            })

            outerRings.forEach((outerRing, outerIdx) => {
                geoJSONCoordinates.push([
                    outerRing,
                    ...innerRings.filter((_, innerIdx) => outerRingIdxs[innerIdx] === outerIdx)
                ])
            })
        })

        const geoJSON: TurfMultiPolygon = {
            type: 'MultiPolygon',
            coordinates: geoJSONCoordinates
        }

        geoJSON.bbox = turfBbox(geoJSON)

        return geoJSON
    }
}

registerEntityClass('main', TAGS.Polygon, ExtendedPolygon)
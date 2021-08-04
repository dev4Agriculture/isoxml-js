import { ISOXMLManager } from '../ISOXMLManager'
import { LineStringLineStringTypeEnum, PolygonPolygonTypeEnum } from '../baseEntities'
import { ExtendedPolygon } from './Polygon'
import { MultiPolygon } from '@turf/helpers'
import { MULTIPOLYGON } from './testdata/geometry'


function stat(polygon: ExtendedPolygon) {
    return {
        outer: polygon.attributes.LineString
            .filter(
                lineString => lineString.attributes.LineStringType === LineStringLineStringTypeEnum.PolygonExterior
            ).length,
        inner: polygon.attributes.LineString
            .filter(
                lineString => lineString.attributes.LineStringType === LineStringLineStringTypeEnum.PolygonInterior
            ).length
    }
}

describe('Polygon Entity', () => {
    it('should be constructed from GeoJSON - version 3', async () => {
        const isoxmlManager = new ISOXMLManager({version: 3})
        const polygons = ExtendedPolygon.fromGeoJSON(
            MULTIPOLYGON.features[0].geometry as MultiPolygon,
            PolygonPolygonTypeEnum.TreatmentZone,
            isoxmlManager
        )
        expect(polygons).toHaveLength(1)
        expect(stat(polygons[0])).toEqual({inner: 2, outer: 2})
    })

    it('should be constructed from GeoJSON - version 4', async () => {
        const isoxmlManager = new ISOXMLManager({version: 4})
        const polygons = ExtendedPolygon.fromGeoJSON(
            MULTIPOLYGON.features[0].geometry as MultiPolygon,
            PolygonPolygonTypeEnum.TreatmentZone,
            isoxmlManager
        )
        expect(polygons).toHaveLength(2)
        expect(stat(polygons[0])).toEqual({inner: 1, outer: 1})
    })

    it('should normalize polygons from v4 to v3', async () => {
        const isoxmlManager = new ISOXMLManager({version: 4})
        const polygons = ExtendedPolygon.fromGeoJSON(
            MULTIPOLYGON.features[0].geometry as MultiPolygon,
            PolygonPolygonTypeEnum.TreatmentZone,
            isoxmlManager
        )

        isoxmlManager.updateOptions({version: 3})

        const normalizedPolygons = ExtendedPolygon.normalizePolygons(polygons)

        expect(normalizedPolygons).toHaveLength(1)
        expect(stat(normalizedPolygons[0])).toEqual({inner: 2, outer: 2})
    })

    it('should normalize polygons from v3 to v4', async () => {
        const isoxmlManager = new ISOXMLManager({version: 3})
        const polygons = ExtendedPolygon.fromGeoJSON(
            MULTIPOLYGON.features[0].geometry as MultiPolygon,
            PolygonPolygonTypeEnum.TreatmentZone,
            isoxmlManager
        )

        isoxmlManager.updateOptions({version: 4})

        const normalizedPolygons = ExtendedPolygon.normalizePolygons(polygons)

        expect(normalizedPolygons).toHaveLength(2)
        expect(stat(normalizedPolygons[0])).toEqual({inner: 1, outer: 1})
    })

    it('should normalize polygons with undefined argument', async () => {
        const normalizedPolygons = ExtendedPolygon.normalizePolygons(undefined)

        expect(normalizedPolygons).toHaveLength(0)
    })
})
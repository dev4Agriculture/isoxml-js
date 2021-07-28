import { ISOXMLManager } from '../ISOXMLManager'
import { PolygonPolygonTypeEnum } from '../baseEntities'
import { ExtendedPolygon } from './Polygon'
import { MultiPolygon } from '@turf/helpers'
import { MULTIPOLYGON } from './testdata/geometry'
import { TAGS } from '../baseEntities/constants'
import { ExtendedTreatmentZone } from './TreatmentZone'

describe('TreatmentZone Entity', () => {
    it('should normalize boundary from v4 to v3', async () => {
        const isoxmlManager = new ISOXMLManager({version: 4})
        const polygons = ExtendedPolygon.fromGeoJSON(
            MULTIPOLYGON.features[0].geometry as MultiPolygon,
            PolygonPolygonTypeEnum.PartfieldBoundary,
            isoxmlManager
        )
        const partfield = new ExtendedTreatmentZone({
            TreatmentZoneCode: 1,
            PolygonTreatmentZoneonly: polygons
        }, isoxmlManager)

        isoxmlManager.updateOptions({version: 3})

        const xml = partfield.toXML()
        expect(xml[TAGS.Polygon]).toHaveLength(1)
    })

    it('should normalize boundary from v3 to v4', async () => {
        const isoxmlManager = new ISOXMLManager({version: 3})
        const polygons = ExtendedPolygon.fromGeoJSON(
            MULTIPOLYGON.features[0].geometry as MultiPolygon,
            PolygonPolygonTypeEnum.PartfieldBoundary,
            isoxmlManager
        )
        const partfield = new ExtendedTreatmentZone({
            TreatmentZoneCode: 1,
            PolygonTreatmentZoneonly: polygons
        }, isoxmlManager)

        isoxmlManager.updateOptions({version: 4})

        const xml = partfield.toXML()
        expect(xml[TAGS.Polygon]).toHaveLength(2)
    })
})
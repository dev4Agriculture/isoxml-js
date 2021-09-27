import { ISOXMLManager } from '../ISOXMLManager'
import { MultiPolygon } from '@turf/helpers'
import { MULTIPOLYGON } from './testdata/geometry'
import { ExtendedPartfield } from './Partfield'
import { TAGS } from '../baseEntities/constants'

describe('Partfield Entity', () => {
    it('should add geometry from GeoJSON', () => {
        const isoxmlManager = new ISOXMLManager()
        const partfield = new ExtendedPartfield({
            PartfieldDesignator: 'test field',
            PartfieldArea: 0
        }, isoxmlManager)

        partfield.boundaryFromGeoJSON(MULTIPOLYGON.features[0].geometry as MultiPolygon, isoxmlManager)

        expect(partfield.attributes.PartfieldArea).toBe(2026305612)
        expect(partfield.attributes.PolygonnonTreatmentZoneonly).toHaveLength(2)
    })

    it('should normalize boundary from v4 to v3', () => {
        const isoxmlManager = new ISOXMLManager({version: 4})
        const partfield = new ExtendedPartfield({
            PartfieldDesignator: 'test',
            PartfieldArea: 0
        }, isoxmlManager)

        partfield.boundaryFromGeoJSON(MULTIPOLYGON.features[0].geometry as MultiPolygon, isoxmlManager)

        isoxmlManager.updateOptions({version: 3})

        const xml = partfield.toXML()
        expect(xml[TAGS.Polygon]).toHaveLength(1)
    })

    it('should normalize boundary from v3 to v4', () => {
        const isoxmlManager = new ISOXMLManager({version: 3})
        const partfield = new ExtendedPartfield({
            PartfieldDesignator: 'test',
            PartfieldArea: 0
        }, isoxmlManager)

        partfield.boundaryFromGeoJSON(MULTIPOLYGON.features[0].geometry as MultiPolygon, isoxmlManager)

        isoxmlManager.updateOptions({version: 4})

        const xml = partfield.toXML()
        expect(xml[TAGS.Polygon]).toHaveLength(2)
    })
})
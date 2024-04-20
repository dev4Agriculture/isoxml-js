import { ISOXMLManager } from "../ISOXMLManager"
import { LineStringLineStringTypeEnum } from "../baseEntities"
import { ExtendedLineString } from "./LineString"

describe("LineString Entity", () => {
    it("should be constructed from GeoJSON without altitude - version 4", async () => {
        const isoxmlManager = new ISOXMLManager({version: 4})
        const lineString = ExtendedLineString.fromGeoJSONCoordinates(
            [
                [-44.904, 61.277],
                [-44.852, 61.034],
            ],
            isoxmlManager,
            LineStringLineStringTypeEnum.GuidancePattern
        )

        expect(lineString.attributes.Point?.[0].attributes.PointEast).toEqual(-44.904)
        expect(lineString.attributes.Point?.[0].attributes.PointNorth).toEqual(61.277)
        expect(lineString.attributes.Point?.[0].attributes.PointUp).toBeUndefined()

        expect(lineString.attributes.Point?.[1].attributes.PointEast).toEqual(-44.852)
        expect(lineString.attributes.Point?.[1].attributes.PointNorth).toEqual(61.034)
        expect(lineString.attributes.Point?.[1].attributes.PointUp).toBeUndefined()
    })
})

describe("LineString Entity", () => {
  it("should be constructed from GeoJSON with altitude - version 4", async () => {
      const isoxmlManager = new ISOXMLManager({version: 4})
      const lineString = ExtendedLineString.fromGeoJSONCoordinates(
          [
              [-44.904, 61.277, 12.140],
              [-44.852, 61.034, 12.213],
          ],
          isoxmlManager,
          LineStringLineStringTypeEnum.GuidancePattern
      )

      expect(lineString.attributes.Point?.[0].attributes.PointEast).toEqual(-44.904)
      expect(lineString.attributes.Point?.[0].attributes.PointNorth).toEqual(61.277)
      expect(lineString.attributes.Point?.[0].attributes.PointUp).toEqual(0.012140)

      expect(lineString.attributes.Point?.[1].attributes.PointEast).toEqual(-44.852)
      expect(lineString.attributes.Point?.[1].attributes.PointNorth).toEqual(61.034)
      expect(lineString.attributes.Point?.[1].attributes.PointUp).toEqual(0.012213)
  })
})
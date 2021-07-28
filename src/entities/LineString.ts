import { LineString, LineStringAttributes, LineStringLineStringTypeEnum, Point, PointPointTypeEnum } from "../baseEntities"
import { TAGS } from "../baseEntities/constants"
import { registerEntityClass } from "../classRegistry"
import { ISOXMLManager } from "../ISOXMLManager"

export class ExtendedLineString extends LineString {
    public tag = TAGS.LineString

    constructor(attributes: LineStringAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    toCoordinatesArray(): [number, number][] {
        return this.attributes.Point.map(point => [point.attributes.PointEast, point.attributes.PointNorth])
    }

    static fromGeoJSONCoordinates(coordinates: number[][], isoxmlManager: ISOXMLManager, type: LineStringLineStringTypeEnum): ExtendedLineString {
        return new ExtendedLineString({
            LineStringType: type,
            Point: coordinates.map(c => new Point({
                PointType: PointPointTypeEnum.Other,
                PointNorth: c[1],
                PointEast: c[0]
            }, isoxmlManager))
        }, isoxmlManager)
    }
}

registerEntityClass(TAGS.LineString, ExtendedLineString)
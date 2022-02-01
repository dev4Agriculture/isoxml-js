import { area, MultiPolygon as TurfMultiPolygon, Polygon as TurfPolygon} from "@turf/turf"
import { Partfield, PartfieldAttributes, PolygonPolygonTypeEnum } from "../baseEntities"
import { TAGS } from "../baseEntities/constants"
import { registerEntityClass } from "../classRegistry"
import { ISOXMLManager } from "../ISOXMLManager"
import { Entity, XMLElement } from "../types"
import { ExtendedPolygon } from "./Polygon"

export class ExtendedPartfield extends Partfield {
    public tag = TAGS.Partfield

    constructor(attributes: PartfieldAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
        return Partfield.fromXML(xml, isoxmlManager, internalId, ExtendedPartfield)
    }

    toXML(): XMLElement {
        this.attributes.PolygonnonTreatmentZoneonly =
            ExtendedPolygon.normalizePolygons(this.attributes.PolygonnonTreatmentZoneonly)
        return super.toXML()
    }

    boundaryFromGeoJSON(geoJSON: TurfMultiPolygon | TurfPolygon, isoxmlManager: ISOXMLManager): void {
        this.attributes.PolygonnonTreatmentZoneonly = 
            ExtendedPolygon.fromGeoJSON(geoJSON, PolygonPolygonTypeEnum.PartfieldBoundary, isoxmlManager)
        this.attributes.PartfieldArea = Math.round(area(geoJSON))
    }
}

registerEntityClass('main', TAGS.Partfield, ExtendedPartfield)
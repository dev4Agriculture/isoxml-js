import { ElementCompact } from "xml-js"
import { TreatmentZone, TreatmentZoneAttributes } from "../baseEntities"
import { TAGS } from "../baseEntities/constants"
import { registerEntityClass } from "../classRegistry"
import { ISOXMLManager } from "../ISOXMLManager"
import { ExtendedPolygon } from "./Polygon"

export class ExtendedTreatmentZone extends TreatmentZone {
    public tag = TAGS.TreatmentZone

    constructor(attributes: TreatmentZoneAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    toXML(): ElementCompact {
        this.attributes.PolygonTreatmentZoneonly = ExtendedPolygon.normalizePolygons(this.attributes.PolygonTreatmentZoneonly)
        return super.toXML()
    }
}

registerEntityClass(TAGS.TreatmentZone, ExtendedTreatmentZone)
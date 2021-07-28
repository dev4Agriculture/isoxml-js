import { ElementCompact } from "xml-js"
import { Partfield, PartfieldAttributes } from "../baseEntities"
import { TAGS } from "../baseEntities/constants"
import { registerEntityClass } from "../classRegistry"
import { ISOXMLManager } from "../ISOXMLManager"
import { ExtendedPolygon } from "./Polygon"

export class ExtendedPartfield extends Partfield {
    public tag = TAGS.Partfield

    constructor(attributes: PartfieldAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    toXML(): ElementCompact {
        this.attributes.PolygonnonTreatmentZoneonly =
            ExtendedPolygon.normalizePolygons(this.attributes.PolygonnonTreatmentZoneonly)
        return super.toXML()
    }
}

registerEntityClass(TAGS.Partfield, ExtendedPartfield)
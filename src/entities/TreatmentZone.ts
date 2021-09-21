import { ElementCompact } from "xml-js"
import { TreatmentZone, TreatmentZoneAttributes } from "../baseEntities"
import { TAGS } from "../baseEntities/constants"
import { registerEntityClass } from "../classRegistry"
import { ISOXMLManager } from "../ISOXMLManager"
import { Entity } from "../types"
import { ExtendedPolygon } from "./Polygon"

export class ExtendedTreatmentZone extends TreatmentZone {
    public tag = TAGS.TreatmentZone

    constructor(attributes: TreatmentZoneAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
        return TreatmentZone.fromXML(xml, isoxmlManager, internalId, ExtendedTreatmentZone)
    }

    toXML(): ElementCompact {
        this.attributes.PolygonTreatmentZoneonly =
            ExtendedPolygon.normalizePolygons(this.attributes.PolygonTreatmentZoneonly)
        return super.toXML()
    }
}

registerEntityClass(TAGS.TreatmentZone, ExtendedTreatmentZone)
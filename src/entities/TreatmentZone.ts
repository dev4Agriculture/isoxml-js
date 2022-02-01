import { TreatmentZone, TreatmentZoneAttributes } from "../baseEntities"
import { TAGS } from "../baseEntities/constants"
import { registerEntityClass } from "../classRegistry"
import { ISOXMLManager } from "../ISOXMLManager"
import { Entity, XMLElement } from "../types"
import { ExtendedPolygon } from "./Polygon"

export class ExtendedTreatmentZone extends TreatmentZone {
    public tag = TAGS.TreatmentZone

    constructor(attributes: TreatmentZoneAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
        return TreatmentZone.fromXML(xml, isoxmlManager, internalId, ExtendedTreatmentZone)
    }

    toXML(): XMLElement {
        this.attributes.PolygonTreatmentZoneonly =
            ExtendedPolygon.normalizePolygons(this.attributes.PolygonTreatmentZoneonly)
        return super.toXML()
    }
}

registerEntityClass('main', TAGS.TreatmentZone, ExtendedTreatmentZone)
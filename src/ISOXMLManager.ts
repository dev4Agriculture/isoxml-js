import { ElementCompact } from "xml-js";
import { Entity, EntityConstructor, ISOXMLReference } from "./types";

const availableEntityClasses: {[tagName: string]: EntityConstructor}= {}

export function registerEntityClass(tagName: string, entityClasses: EntityConstructor) {
    availableEntityClasses[tagName] = entityClasses
}

export class ISOXMLManager {
    private xmlReferences: {[xmlId: string]: ISOXMLReference} = {}
    private nextIds: {[xmlId: string]: number} = {}

    public registerXMLReference(xmlId: string): ISOXMLReference {
        this.xmlReferences[xmlId] = this.xmlReferences[xmlId] || {xmlId}
        return this.xmlReferences[xmlId]
    }

    public registerEntity(entity: Entity): ISOXMLReference {
        this.nextIds[entity.tag] = (this.nextIds[entity.tag] || 0) + 1
        const xmlId = `${entity.tag}${this.nextIds[entity.tag]}`
        const ref = this.registerXMLReference(xmlId)
        ref.reference = entity
        return ref
    }

    public createEntity(tagName: string, xml: ElementCompact): Entity {
        const entityClass = availableEntityClasses[tagName]
        if (!entityClass) {
            return null
        }

        return entityClass.fromXML(xml, this)
    }
}


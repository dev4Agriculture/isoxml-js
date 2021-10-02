import { TimeLog, TimeLogAttributes } from "../baseEntities"
import { TAGS } from "../baseEntities/constants"
import { registerEntityClass } from "../classRegistry"
import { ISOXMLManager } from "../ISOXMLManager"
import { Entity, XMLElement } from "../types"

export class ExtendedTimeLog extends TimeLog {
    public tag = TAGS.TimeLog

    public xmlData: string
    public binaryData: Uint8Array

    constructor(attributes: TimeLogAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static async fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
        const entity = await TimeLog.fromXML(xml, isoxmlManager, internalId, ExtendedTimeLog) as ExtendedTimeLog
        entity.xmlData = await isoxmlManager.getParsedFile(`${entity.attributes.Filename}.XML`, false)
        entity.binaryData = await isoxmlManager.getParsedFile(`${entity.attributes.Filename}.BIN`, true)
        return entity
    }

    toXML(): XMLElement { 
        this.isoxmlManager.addFileToSave(this.xmlData, `${this.attributes.Filename}.XML`) 
        this.isoxmlManager.addFileToSave(this.binaryData, `${this.attributes.Filename}.BIN`) 
        return super.toXML() 
    } 
}

registerEntityClass(TAGS.TimeLog, ExtendedTimeLog)
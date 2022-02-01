import { TimelogTime, TimeLog, TimeLogAttributes } from "../baseEntities"
import { TAGS } from "../baseEntities/constants"
import { registerEntityClass } from "../classRegistry"
import { ISOXMLManager } from "../ISOXMLManager"
import { Entity, XMLElement } from "../types"
import { js2xml, xml2js } from "../xmlManager"

export class ExtendedTimeLog extends TimeLog {
    public tag = TAGS.TimeLog

    public binaryData: Uint8Array
    public timeLogInfo: TimelogTime

    constructor(attributes: TimeLogAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static async fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
        const entity = await TimeLog.fromXML(xml, isoxmlManager, internalId, ExtendedTimeLog) as ExtendedTimeLog
        const xmlFilename = `${entity.attributes.Filename}.XML`
        const binFilename = `${entity.attributes.Filename}.BIN`
        entity.binaryData = await isoxmlManager.getParsedFile(binFilename, true)

        const xmlData = await isoxmlManager.getParsedFile(xmlFilename, false)
        const xmlTimelog = xml2js(xmlData)

        const infoIsoxmlManager = new ISOXMLManager({realm: 'timelog'})
        entity.timeLogInfo = await TimelogTime.fromXML(
            xmlTimelog[TAGS.Time][0],
            infoIsoxmlManager,
            `${xmlFilename}->${TAGS.Time}[0]`
        ) as TimelogTime

        infoIsoxmlManager.getWarnings().forEach(warning => {
            isoxmlManager.addWarning(warning)
        })

        return entity
    }

    toXML(): XMLElement { 
        const json = {
            [TAGS.Time]: this.timeLogInfo.toXML()
        }
        const xmlData = js2xml(json)

        this.isoxmlManager.addFileToSave(xmlData, `${this.attributes.Filename}.XML`) 
        this.isoxmlManager.addFileToSave(this.binaryData, `${this.attributes.Filename}.BIN`) 
        return super.toXML() 
    } 
}

registerEntityClass('main', TAGS.TimeLog, ExtendedTimeLog)
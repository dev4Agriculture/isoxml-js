import { ElementCompact } from "xml-js"
import { AttachedFile, AttachedFileAttributes } from "../baseEntities"
import { TAGS } from "../baseEntities/constants"
import { registerEntityClass } from "../classRegistry"
import { ISOXMLManager } from "../ISOXMLManager"
import { Entity } from "../types"

export class ExtendedAttachedFile extends AttachedFile {
    public tag = TAGS.AttachedFile

    public fileData: Uint8Array

    constructor(attributes: AttachedFileAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static async fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Promise<Entity> {
        const entity = await AttachedFile.fromXML(xml, isoxmlManager, ExtendedAttachedFile) as ExtendedAttachedFile
        const filename = entity.attributes.FilenameWithExtension
        entity.fileData = await isoxmlManager.getParsedFile(filename, true)
        return entity
    }

    toXML(): ElementCompact { 
        this.isoxmlManager.addFileToSave(this.fileData, this.attributes.FilenameWithExtension) 
        return super.toXML() 
    } 
}

registerEntityClass(TAGS.AttachedFile, ExtendedAttachedFile)
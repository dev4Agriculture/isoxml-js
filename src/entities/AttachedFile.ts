import { ElementCompact, js2xml, xml2js } from "xml-js"
import { AttachedFile, AttachedFileAttributes, AttachedFilePreserveEnum } from "../baseEntities"
import { TAGS } from "../baseEntities/constants"
import { registerEntityClass } from "../classRegistry"
import { ISOXMLManager } from "../ISOXMLManager"
import { Entity } from "../types"
import { ExtendedISO11783LinkListFile } from "./ISO11783LinkListFile"

export class ExtendedAttachedFile extends AttachedFile {
    public tag = TAGS.AttachedFile

    public fileData: Uint8Array

    constructor(attributes: AttachedFileAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static async fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId?: string): Promise<Entity> {
        const entity = await AttachedFile.fromXML(
            xml, isoxmlManager, internalId, ExtendedAttachedFile
        ) as ExtendedAttachedFile

        const filename = entity.attributes.FilenameWithExtension

        if (entity.attributes.FileType === 1) {
            const linkListString = await isoxmlManager.getParsedFile(filename, false)
            let linkListXml
            try {
                linkListXml = xml2js(linkListString, { compact: true, alwaysArray: true })
            } catch(e) {
                throw new Error ('Failed to parse LinkList file')
            }
            await ExtendedISO11783LinkListFile.fromXML(
                linkListXml[TAGS.ISO11783LinkListFile][0],
                isoxmlManager,
                'LINKLIST'
            )
        } else {
            entity.fileData = await isoxmlManager.getParsedFile(filename, true)
        }
        return entity
    }

    toXML(): ElementCompact { 
        if (this.attributes.FileType === 1) {
            const linkListFile = ExtendedISO11783LinkListFile.fromISOXMLManager(this.isoxmlManager)

            const json = {
                _declaration: {
                    _attributes: {
                    version: '1.0',
                    encoding: 'utf-8'
                    }
                },
                [TAGS.ISO11783LinkListFile]: linkListFile.toXML()
            }
            const xmlString = js2xml(json, { compact: true, spaces: 2 })
            this.isoxmlManager.addFileToSave(xmlString, this.attributes.FilenameWithExtension) 
        } else {
            this.isoxmlManager.addFileToSave(this.fileData, this.attributes.FilenameWithExtension) 
        }
        return super.toXML() 
    } 

    static linkListFromISOXMLManager(isoxmlManager: ISOXMLManager): ExtendedAttachedFile {
        return new ExtendedAttachedFile({
            FilenameWithExtension: 'LINKLIST.XML',
            Preserve: AttachedFilePreserveEnum.PreserveOnTaskControllerAndSendBackToFMIS,
            FileType: 1,
            ManufacturerGLN: ''
        }, isoxmlManager) 
    }
}

registerEntityClass(TAGS.AttachedFile, ExtendedAttachedFile)
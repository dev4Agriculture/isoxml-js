import { ElementCompact, xml2js } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { getEntityClassByTag, registerEntityClass } from '../classRegistry'

import {Entity} from '../types'

import {ISO11783TaskDataFile, ISO11783TaskDataFileAttributes, ISO11783TaskDataFileDataTransferOriginEnum} from '../baseEntities/ISO11783TaskDataFile'
import {ExternalFileContents} from '../baseEntities/ExternalFileContents'
import { TAGS } from '../baseEntities/constants'

function isoxmlManagerOptionsToAttributes(isoxmlManager: ISOXMLManager) {
    const opts = isoxmlManager.options
    return {
        VersionMajor: (opts.version === 4 ? '4' : '3') as any,
        VersionMinor: (opts.version === 4 ? '2' : '3') as any,
        ManagementSoftwareManufacturer: opts.fmisTitle,
        ManagementSoftwareVersion: opts.fmisVersion,
        DataTransferOrigin: ISO11783TaskDataFileDataTransferOriginEnum.FMIS
    }
}

// This implementation doesn't support generation of External Files. Particularly:
//   * During parsing from XML, all the external files will be parsed and merged into the instance of this class.
//     All the XFR tags will be removed 
//   * During saving to XML, no external files will be saved even if XFR tags were manually added by user
export class ExtendedISO11783TaskDataFile extends ISO11783TaskDataFile {
    public tag = TAGS.ISO11783TaskDataFile

    constructor(attributes: ISO11783TaskDataFileAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static fromISOXMLManagerOptions(isoxmlManager: ISOXMLManager): ExtendedISO11783TaskDataFile {
        return new ExtendedISO11783TaskDataFile(isoxmlManagerOptionsToAttributes(isoxmlManager), isoxmlManager)
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        const entity = ISO11783TaskDataFile.fromXML(xml, isoxmlManager, ExtendedISO11783TaskDataFile) as ExtendedISO11783TaskDataFile

        // parse all external files and add them to the main task data file
        const externalFiles = entity.attributes.ExternalFileReference || []
        externalFiles.forEach(externalFile => {
            const filename = externalFile.attributes.Filename
            const file = isoxmlManager.parsedFiles.find(file => (file as any).filename.match(new RegExp(`${filename}\\.XML$`, 'i')))
            const xml = xml2js((file as any).data, { compact: true, alwaysArray: true })
            const fileContent = getEntityClassByTag(TAGS.ISO11783TaskDataFile).fromXML(xml[TAGS.ExternalFileContents][0], isoxmlManager)
            entity.appendFromExternalFile(fileContent)
        })
        entity.attributes.ExternalFileReference = []

        isoxmlManager.options.version = entity.attributes.VersionMajor === '4' ? 4 : 3
        isoxmlManager.options.fmisTitle = entity.attributes.ManagementSoftwareManufacturer
        isoxmlManager.options.fmisVersion = entity.attributes.ManagementSoftwareVersion

        return entity
    }

    toXML(): ElementCompact {
        if (this.isoxmlManager.options.version === 4) {
            this.attributes.VersionMajor = '4' as any
            this.attributes.VersionMinor = '2' as any
        } else {
            this.attributes.VersionMajor = '3' as any
            this.attributes.VersionMinor = '3' as any
        }

        this.attributes.ManagementSoftwareManufacturer = this.isoxmlManager.options.fmisTitle
        this.attributes.ManagementSoftwareVersion = this.isoxmlManager.options.fmisVersion

        return super.toXML()
    }

    appendFromExternalFile(fileContents: ExternalFileContents) {
        Object.keys(fileContents.attributes).forEach(attrName => {
            this.attributes[attrName] = [
                ...(this.attributes[attrName] || []),
                ...fileContents.attributes[attrName]
            ]
        })
    }
}

registerEntityClass(TAGS.ISO11783TaskDataFile, ExtendedISO11783TaskDataFile)
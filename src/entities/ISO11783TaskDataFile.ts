import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'

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

export class ExtendedISO11783TaskDataFile extends ISO11783TaskDataFile {
    public tag = TAGS.ISO11783TaskDataFile

    constructor(attributes: ISO11783TaskDataFileAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static fromISOXMLManagerOptions(isoxmlManager: ISOXMLManager): ExtendedISO11783TaskDataFile {
        return new ExtendedISO11783TaskDataFile(isoxmlManagerOptionsToAttributes(isoxmlManager), isoxmlManager)
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        const entity = ISO11783TaskDataFile.fromXML(xml, isoxmlManager, ExtendedISO11783TaskDataFile) as ISO11783TaskDataFile
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
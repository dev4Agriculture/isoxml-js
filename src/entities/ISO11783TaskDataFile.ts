import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'

import {Entity} from '../types'

import {ISO11783TaskDataFile, ISO11783TaskDataFileAttributes} from '../baseEntities/ISO11783TaskDataFile'
import {ExternalFileContents} from '../baseEntities/ExternalFileContents'
import { TAGS } from '../baseEntities/constants'

export class ExtendedISO11783TaskDataFile extends ISO11783TaskDataFile {
    public tag = TAGS.ISO11783TaskDataFile

    constructor(attributes: ISO11783TaskDataFileAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return ISO11783TaskDataFile.fromXML(xml, isoxmlManager, ExtendedISO11783TaskDataFile)
    }

    toXML(): ElementCompact {
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
import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../../src/ISOXMLManager'
import { registerEntityClass } from '../../src/classRegistry'

import {Entity} from '../../src/types'

import {ISO11783TaskDataFile, ISO11783TaskDataFileAttributes} from '../baseEntities/ISO11783TaskDataFile'
import {ExternalFileContents} from '../baseEntities/ExternalFileContents'

export class ExtendedISO11783TaskDataFile extends ISO11783TaskDataFile {
    public tag = 'ISO11783_TaskData'

    constructor(attributes: ISO11783TaskDataFileAttributes) {
        super(attributes)
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return ISO11783TaskDataFile.fromXML(xml, isoxmlManager)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return super.toXML(isoxmlManager)
    }

    appendFromExternalFile(fileContents: ExternalFileContents) {
        Object.keys(fileContents.attributes).forEach(attrName => {
            this.attributes[attrName] = [
                ...this.attributes[attrName],
                ...fileContents.attributes[attrName]
            ]
        })
    }
}

registerEntityClass('ISO11783_TaskData', ExtendedISO11783TaskDataFile)
import { ElementCompact } from "xml-js";
import { TAGS } from "./baseEntities/constants";
import { ISOXMLManager } from './ISOXMLManager'

export interface AttributesDescription {
    [xmlTag: string]: {name: string, type: string, isPrimaryId: boolean}
}

export interface ReferencesDescription {
    [xmlTag: string]: {name: string}
}

export type ISOXMLReference = {
    xmlId: string
    fmisId?: string
    entity?: Entity
}

export interface Entity {
    isoxmlManager: ISOXMLManager
    attributes: {[name: string]: any}
    tag: TAGS
    toXML (): ElementCompact
}

export interface EntityConstructor {
    fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity
    new (attributes: any, isoxmlManager: ISOXMLManager, xmlId?: string, fmisId?: string): Entity
}

interface ISOBinaryFileInformation {
  isBinary: true
  data: Uint8Array
  filename: string
}

interface ISOXMLFileInformation {
  isBinary: false
  data: string
  filename: string
}

export type ISOFileInformation = ISOBinaryFileInformation | ISOXMLFileInformation
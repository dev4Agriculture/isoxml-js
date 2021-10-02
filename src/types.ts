import { TAGS } from "./baseEntities/constants"
import { ISOXMLManager } from './ISOXMLManager'

export interface XMLElement {
    _attributes?: {[attr: string]: any}
    _text?: string
    [tag: string]: any
}

export interface AttributeDescription {
    name: string
    type: string
    isPrimaryId: boolean
    isOptional: boolean
    isOnlyV4: boolean
    minValue?: number
    maxValue?: number
    fractionDigits?: number
}
export interface AttributesDescription {
    [xmlTag: string]: AttributeDescription
}

export interface ReferencesDescription {
    [xmlTag: string]: {name: string, isOnlyV4: boolean}
}

export type ISOXMLReference = {
    xmlId: string
    fmisId?: string
    entity?: Entity
}

export type EntityAttributes = {[name: string]: any}

export interface Entity {
    isoxmlManager: ISOXMLManager
    attributes: EntityAttributes
    tag: TAGS
    toXML (): XMLElement
}

export interface EntityConstructor {
    fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string): Promise<Entity>
    new (attributes: EntityAttributes, isoxmlManager: ISOXMLManager, xmlId?: string, fmisId?: string): Entity
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

export type GridValueDescription = {
    DDI: number
    name: string
    unit: string
    scale: number
    offset: number
}
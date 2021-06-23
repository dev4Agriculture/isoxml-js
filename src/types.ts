import { ElementCompact } from "xml-js";
import { ISOXMLManager } from './ISOXMLManager'

export interface AttributesDescription {
    [xmlTag: string]: {name: string, type: string}
}

export interface ReferencesDescription {
    [xmlTag: string]: {name: string}
}

export type ISOXMLReference = {
    xmlId: string
    fmisId?: string
    reference?: Entity
}

export interface Entity {
    attributes: {[name: string]: any}
    tag: string
    toXML (isoxmlManager: ISOXMLManager): ElementCompact
}

export interface EntityConstructor {
    fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity
    new (attributes: any): Entity
}
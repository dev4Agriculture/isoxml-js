import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'


export type ProcessDataVariableAttributes = {
    ProcessDataDDI: string
    ProcessDataValue: number
    ProductIdRef?: ISOXMLReference
    DeviceElementIdRef?: ISOXMLReference
    ValuePresentationIdRef?: ISOXMLReference
    ActualCulturalPracticeValue?: number
    ElementTypeInstanceValue?: number
    ProcessDataVariable?: ProcessDataVariable[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'ProcessDataDDI',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'ProcessDataValue',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
        minValue: -2147483648,
        maxValue: 2147483647,
    },
    C: {
        name: 'ProductIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    D: {
        name: 'DeviceElementIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    E: {
        name: 'ValuePresentationIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    F: {
        name: 'ActualCulturalPracticeValue',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: true,
        minValue: -2147483648,
        maxValue: 2147483647,
    },
    G: {
        name: 'ElementTypeInstanceValue',
        type: 'xs:long',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: true,
        minValue: -2147483648,
        maxValue: 2147483647,
    },
}
const CHILD_TAGS = {
    PDV: { name: 'ProcessDataVariable', isOnlyV4: false },
}

export class ProcessDataVariable implements Entity {
    public tag = TAGS.ProcessDataVariable

    constructor(public attributes: ProcessDataVariableAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = ProcessDataVariable): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.ProcessDataVariable, ProcessDataVariable)
import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

export type ProcessDataVariableAttributes = {
    ProcessDataDDI: string
    ProcessDataValue: number
    ProductIdRef?: ISOXMLReference
    DeviceElementIdRef?: ISOXMLReference
    ValuePresentationIdRef?: ISOXMLReference
    ActualCulturalPracticeValue?: number
    ElementTypeInstanceValue?: number
    ProcessDataVariable?: ProcessDataVariable[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ProcessDataDDI', type: 'xs:hexBinary' },
    B: { name: 'ProcessDataValue', type: 'xs:long' },
    C: { name: 'ProductIdRef', type: 'xs:IDREF' },
    D: { name: 'DeviceElementIdRef', type: 'xs:IDREF' },
    E: { name: 'ValuePresentationIdRef', type: 'xs:IDREF' },
    F: { name: 'ActualCulturalPracticeValue', type: 'xs:long' },
    G: { name: 'ElementTypeInstanceValue', type: 'xs:long' },
}
const CHILD_TAGS = {
    PDV: { name: 'ProcessDataVariable' },
}

export class ProcessDataVariable implements Entity {
    public tag = 'PDV'

    constructor(public attributes: ProcessDataVariableAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, ProcessDataVariable, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('PDV', ProcessDataVariable)
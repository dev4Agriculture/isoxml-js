import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { AllocationStamp } from './AllocationStamp'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export type ProductAllocationAttributes = {
    ProductIdRef: ISOXMLReference
    QuantityDDI?: string
    QuantityValue?: number
    TransferMode?: string
    DeviceElementIdRef?: ISOXMLReference
    ValuePresentationIdRef?: ISOXMLReference
    ProductSubTypeIdRef?: ISOXMLReference
    AllocationStamp?: AllocationStamp[]
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ProductIdRef', type: 'xs:IDREF', isPrimaryId: false },
    B: { name: 'QuantityDDI', type: 'xs:hexBinary', isPrimaryId: false },
    C: { name: 'QuantityValue', type: 'xs:long', isPrimaryId: false },
    D: { name: 'TransferMode', type: 'xs:NMTOKEN', isPrimaryId: false },
    E: { name: 'DeviceElementIdRef', type: 'xs:IDREF', isPrimaryId: false },
    F: { name: 'ValuePresentationIdRef', type: 'xs:IDREF', isPrimaryId: false },
    G: { name: 'ProductSubTypeIdRef', type: 'xs:IDREF', isPrimaryId: false },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp' },
}

export class ProductAllocation implements Entity {
    public tag = 'PAN'

    constructor(public attributes: ProductAllocationAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ProductAllocation): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('PAN', ProductAllocation)
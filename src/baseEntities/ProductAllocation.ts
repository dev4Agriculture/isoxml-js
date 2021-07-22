import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { AllocationStamp } from './AllocationStamp'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export const enum ProductAllocationTransferModeEnum {
    Filling = '1',
    Emptying = '2',
    Remainder = '3',
}

export type ProductAllocationAttributes = {
    ProductIdRef: ISOXMLReference
    QuantityDDI?: string
    QuantityValue?: number
    TransferMode?: ProductAllocationTransferModeEnum
    DeviceElementIdRef?: ISOXMLReference
    ValuePresentationIdRef?: ISOXMLReference
    ProductSubTypeIdRef?: ISOXMLReference
    AllocationStamp?: AllocationStamp[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'ProductIdRef', type: 'xs:IDREF', isPrimaryId: false, isOnlyV4: false },
    B: { name: 'QuantityDDI', type: 'xs:hexBinary', isPrimaryId: false, isOnlyV4: false },
    C: { name: 'QuantityValue', type: 'xs:long', isPrimaryId: false, isOnlyV4: false },
    D: { name: 'TransferMode', type: 'xs:NMTOKEN', isPrimaryId: false, isOnlyV4: false },
    E: { name: 'DeviceElementIdRef', type: 'xs:IDREF', isPrimaryId: false, isOnlyV4: false },
    F: { name: 'ValuePresentationIdRef', type: 'xs:IDREF', isPrimaryId: false, isOnlyV4: false },
    G: { name: 'ProductSubTypeIdRef', type: 'xs:IDREF', isPrimaryId: false, isOnlyV4: true },
}
const CHILD_TAGS = {
    ASP: { name: 'AllocationStamp', isOnlyV4: false },
}

export class ProductAllocation implements Entity {
    public tag = TAGS.ProductAllocation

    constructor(public attributes: ProductAllocationAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ProductAllocation): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.ProductAllocation, ProductAllocation)
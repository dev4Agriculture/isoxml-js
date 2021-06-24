import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type TaskControllerCapabilitiesAttributes = {
    TaskControllerControlFunctionNAME: string
    TaskControllerDesignator: string
    VersionNumber: string
    ProvidedCapabilities: number
    NumberOfBoomsSectionControl: number
    NumberOfSectionsSectionControl: number
    NumberOfControlChannels: number
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'TaskControllerControlFunctionNAME', type: 'xs:hexBinary' },
    B: { name: 'TaskControllerDesignator', type: 'xs:string' },
    C: { name: 'VersionNumber', type: 'xs:NMTOKEN' },
    D: { name: 'ProvidedCapabilities', type: 'xs:unsignedByte' },
    E: { name: 'NumberOfBoomsSectionControl', type: 'xs:unsignedByte' },
    F: { name: 'NumberOfSectionsSectionControl', type: 'xs:unsignedByte' },
    G: { name: 'NumberOfControlChannels', type: 'xs:unsignedByte' },
}
const CHILD_TAGS = {
}

export class TaskControllerCapabilities implements Entity {
    public tag = 'TCC'

    constructor(public attributes: TaskControllerCapabilitiesAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = TaskControllerCapabilities): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('TCC', TaskControllerCapabilities)
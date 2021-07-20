import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export const enum TaskControllerCapabilitiesVersionNumberEnum {
    TheVersionOfTheDIS1FirstDraftInternationalStandard = '0',
    TheVersionOfTheFDIS1FinalDraftInternationalStandardFirstEdition = '1',
    TheVersionOfTheFDIS2AndTheFirstEditionPublishedAsAnInternationalStandard = '2',
    TheVersionOfTheSecondEditionPublishedAsADraftInternationalStandardE2DIS = '3',
    TheVersionOfTheSecondEditionPublishedAsAFinalDraftInternationalStandardE2FDIS = '4',
}

export type TaskControllerCapabilitiesAttributes = {
    TaskControllerControlFunctionNAME: string
    TaskControllerDesignator: string
    VersionNumber: TaskControllerCapabilitiesVersionNumberEnum
    ProvidedCapabilities: number
    NumberOfBoomsSectionControl: number
    NumberOfSectionsSectionControl: number
    NumberOfControlChannels: number
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'TaskControllerControlFunctionNAME', type: 'xs:hexBinary', isPrimaryId: false },
    B: { name: 'TaskControllerDesignator', type: 'xs:string', isPrimaryId: false },
    C: { name: 'VersionNumber', type: 'xs:NMTOKEN', isPrimaryId: false },
    D: { name: 'ProvidedCapabilities', type: 'xs:unsignedByte', isPrimaryId: false },
    E: { name: 'NumberOfBoomsSectionControl', type: 'xs:unsignedByte', isPrimaryId: false },
    F: { name: 'NumberOfSectionsSectionControl', type: 'xs:unsignedByte', isPrimaryId: false },
    G: { name: 'NumberOfControlChannels', type: 'xs:unsignedByte', isPrimaryId: false },
}
const CHILD_TAGS = {
}

export class TaskControllerCapabilities implements Entity {
    public tag = TAGS.TaskControllerCapabilities

    constructor(public attributes: TaskControllerCapabilitiesAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = TaskControllerCapabilities): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.TaskControllerCapabilities, TaskControllerCapabilities)
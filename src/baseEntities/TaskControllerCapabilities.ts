import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'


import { Entity, EntityConstructor, AttributesDescription } from '../types'

export enum TaskControllerCapabilitiesVersionNumberEnum {
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
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'TaskControllerControlFunctionNAME',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    B: {
        name: 'TaskControllerDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    C: {
        name: 'VersionNumber',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
    },
    D: {
        name: 'ProvidedCapabilities',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
        minValue: 0,
        maxValue: 63,
    },
    E: {
        name: 'NumberOfBoomsSectionControl',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
        minValue: 0,
        maxValue: 254,
    },
    F: {
        name: 'NumberOfSectionsSectionControl',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
        minValue: 0,
        maxValue: 254,
    },
    G: {
        name: 'NumberOfControlChannels',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: undefined,
        minValue: 0,
        maxValue: 254,
    },
}
const CHILD_TAGS = {
}

export class TaskControllerCapabilities implements Entity {
    public tag = TAGS.TaskControllerCapabilities

    constructor(public attributes: TaskControllerCapabilitiesAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = TaskControllerCapabilities): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.TaskControllerCapabilities, TaskControllerCapabilities)
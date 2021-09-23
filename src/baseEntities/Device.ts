import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { DeviceElement } from './DeviceElement'
import { DeviceProperty } from './DeviceProperty'
import { DeviceProcessData } from './DeviceProcessData'
import { DeviceValuePresentation } from './DeviceValuePresentation'

import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type DeviceAttributes = {
    DeviceDesignator?: string
    DeviceSoftwareVersion?: string
    ClientNAME: string
    DeviceSerialNumber?: string
    DeviceStructureLabel: string
    DeviceLocalizationLabel: string
    DeviceElement?: DeviceElement[]
    DeviceProperty?: DeviceProperty[]
    DeviceProcessData?: DeviceProcessData[]
    DeviceValuePresentation?: DeviceValuePresentation[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'DeviceId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'DeviceDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    C: {
        name: 'DeviceSoftwareVersion',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    D: {
        name: 'ClientNAME',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    E: {
        name: 'DeviceSerialNumber',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    F: {
        name: 'DeviceStructureLabel',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    G: {
        name: 'DeviceLocalizationLabel',
        type: 'xs:hexBinary',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
}
const CHILD_TAGS = {
    DET: { name: 'DeviceElement', isOnlyV4: false },
    DPT: { name: 'DeviceProperty', isOnlyV4: false },
    DPD: { name: 'DeviceProcessData', isOnlyV4: false },
    DVP: { name: 'DeviceValuePresentation', isOnlyV4: false },
}

export class Device implements Entity {
    public tag = TAGS.Device

    constructor(public attributes: DeviceAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = Device): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Device, Device)
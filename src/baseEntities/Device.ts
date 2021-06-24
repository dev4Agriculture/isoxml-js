import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { DeviceElement } from './DeviceElement'
import { DeviceProperty } from './DeviceProperty'
import { DeviceProcessData } from './DeviceProcessData'
import { DeviceValuePresentation } from './DeviceValuePresentation'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export type DeviceAttributes = {
    DeviceId: string
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
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'DeviceId', type: 'xs:ID' },
    B: { name: 'DeviceDesignator', type: 'xs:string' },
    C: { name: 'DeviceSoftwareVersion', type: 'xs:string' },
    D: { name: 'ClientNAME', type: 'xs:hexBinary' },
    E: { name: 'DeviceSerialNumber', type: 'xs:string' },
    F: { name: 'DeviceStructureLabel', type: 'xs:hexBinary' },
    G: { name: 'DeviceLocalizationLabel', type: 'xs:hexBinary' },
}
const CHILD_TAGS = {
    DET: { name: 'DeviceElement' },
    DPT: { name: 'DeviceProperty' },
    DPD: { name: 'DeviceProcessData' },
    DVP: { name: 'DeviceValuePresentation' },
}

export class Device implements Entity {
    public tag = 'DVC'

    constructor(public attributes: DeviceAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Device): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('DVC', Device)
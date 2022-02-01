import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { AttachedFile } from './AttachedFile'
import { BaseStation } from './BaseStation'
import { CodedComment } from './CodedComment'
import { CodedCommentGroup } from './CodedCommentGroup'
import { ColourLegend } from './ColourLegend'
import { CropType } from './CropType'
import { CulturalPractice } from './CulturalPractice'
import { Customer } from './Customer'
import { Device } from './Device'
import { Farm } from './Farm'
import { OperationTechnique } from './OperationTechnique'
import { Partfield } from './Partfield'
import { Product } from './Product'
import { ProductGroup } from './ProductGroup'
import { Task } from './Task'
import { TaskControllerCapabilities } from './TaskControllerCapabilities'
import { ValuePresentation } from './ValuePresentation'
import { Worker } from './Worker'
import { ExternalFileReference } from './ExternalFileReference'

import { Entity, EntityConstructor, AttributesDescription } from '../types'

export enum ISO11783TaskDataFileVersionMajorEnum {
    TheVersionOfTheSecondEditionPublishedAsAFinalDraftInternationalStandard = '4',
}
export enum ISO11783TaskDataFileVersionMinorEnum {
    Value0 = '0',
    Value1 = '1',
    Value2 = '2',
    Value3 = '3',
}
export enum ISO11783TaskDataFileDataTransferOriginEnum {
    FMIS = '1',
    MICS = '2',
}

export type ISO11783TaskDataFileAttributes = {
    VersionMajor: ISO11783TaskDataFileVersionMajorEnum
    VersionMinor: ISO11783TaskDataFileVersionMinorEnum
    ManagementSoftwareManufacturer: string
    ManagementSoftwareVersion: string
    TaskControllerManufacturer?: string
    TaskControllerVersion?: string
    DataTransferOrigin: ISO11783TaskDataFileDataTransferOriginEnum
    lang?: string
    AttachedFile?: AttachedFile[]
    BaseStation?: BaseStation[]
    CodedComment?: CodedComment[]
    CodedCommentGroup?: CodedCommentGroup[]
    ColourLegend?: ColourLegend[]
    CropType?: CropType[]
    CulturalPractice?: CulturalPractice[]
    Customer?: Customer[]
    Device?: Device[]
    Farm?: Farm[]
    OperationTechnique?: OperationTechnique[]
    Partfield?: Partfield[]
    Product?: Product[]
    ProductGroup?: ProductGroup[]
    Task?: Task[]
    TaskControllerCapabilities?: TaskControllerCapabilities[]
    ValuePresentation?: ValuePresentation[]
    Worker?: Worker[]
    ExternalFileReference?: ExternalFileReference[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    VersionMajor: {
        name: 'VersionMajor',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    VersionMinor: {
        name: 'VersionMinor',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    ManagementSoftwareManufacturer: {
        name: 'ManagementSoftwareManufacturer',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    ManagementSoftwareVersion: {
        name: 'ManagementSoftwareVersion',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    TaskControllerManufacturer: {
        name: 'TaskControllerManufacturer',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    TaskControllerVersion: {
        name: 'TaskControllerVersion',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    DataTransferOrigin: {
        name: 'DataTransferOrigin',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    lang: {
        name: 'lang',
        type: 'xs:language',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: true,
    },
}
const CHILD_TAGS = {
    AFE: { name: 'AttachedFile', isOnlyV4: true },
    BSN: { name: 'BaseStation', isOnlyV4: true },
    CCT: { name: 'CodedComment', isOnlyV4: false },
    CCG: { name: 'CodedCommentGroup', isOnlyV4: false },
    CLD: { name: 'ColourLegend', isOnlyV4: false },
    CTP: { name: 'CropType', isOnlyV4: false },
    CPC: { name: 'CulturalPractice', isOnlyV4: false },
    CTR: { name: 'Customer', isOnlyV4: false },
    DVC: { name: 'Device', isOnlyV4: false },
    FRM: { name: 'Farm', isOnlyV4: false },
    OTQ: { name: 'OperationTechnique', isOnlyV4: false },
    PFD: { name: 'Partfield', isOnlyV4: false },
    PDT: { name: 'Product', isOnlyV4: false },
    PGP: { name: 'ProductGroup', isOnlyV4: false },
    TSK: { name: 'Task', isOnlyV4: false },
    TCC: { name: 'TaskControllerCapabilities', isOnlyV4: true },
    VPN: { name: 'ValuePresentation', isOnlyV4: false },
    WKR: { name: 'Worker', isOnlyV4: false },
    XFR: { name: 'ExternalFileReference', isOnlyV4: false },
}

export class ISO11783TaskDataFile implements Entity {
    public tag = TAGS.ISO11783TaskDataFile

    constructor(public attributes: ISO11783TaskDataFileAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = ISO11783TaskDataFile): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('main', TAGS.ISO11783TaskDataFile, ISO11783TaskDataFile)
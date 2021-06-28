import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
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

export const enum ISO11783TaskDataFileVersionMajorEnum {
    TheVersionOfTheSecondEditionPublishedAsAFinalDraftInternationalStandard = '4',
}
export const enum ISO11783TaskDataFileVersionMinorEnum {
    Value0 = '0',
    Value1 = '1',
    Value2 = '2',
    Value3 = '3',
}
export const enum ISO11783TaskDataFileDataTransferOriginEnum {
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
}

const ATTRIBUTES: AttributesDescription = {
    VersionMajor: { name: 'VersionMajor', type: 'xs:NMTOKEN', isPrimaryId: false },
    VersionMinor: { name: 'VersionMinor', type: 'xs:NMTOKEN', isPrimaryId: false },
    ManagementSoftwareManufacturer: { name: 'ManagementSoftwareManufacturer', type: 'xs:string', isPrimaryId: false },
    ManagementSoftwareVersion: { name: 'ManagementSoftwareVersion', type: 'xs:string', isPrimaryId: false },
    TaskControllerManufacturer: { name: 'TaskControllerManufacturer', type: 'xs:string', isPrimaryId: false },
    TaskControllerVersion: { name: 'TaskControllerVersion', type: 'xs:string', isPrimaryId: false },
    DataTransferOrigin: { name: 'DataTransferOrigin', type: 'xs:NMTOKEN', isPrimaryId: false },
    lang: { name: 'lang', type: 'xs:language', isPrimaryId: false },
}
const CHILD_TAGS = {
    AFE: { name: 'AttachedFile' },
    BSN: { name: 'BaseStation' },
    CCT: { name: 'CodedComment' },
    CCG: { name: 'CodedCommentGroup' },
    CLD: { name: 'ColourLegend' },
    CTP: { name: 'CropType' },
    CPC: { name: 'CulturalPractice' },
    CTR: { name: 'Customer' },
    DVC: { name: 'Device' },
    FRM: { name: 'Farm' },
    OTQ: { name: 'OperationTechnique' },
    PFD: { name: 'Partfield' },
    PDT: { name: 'Product' },
    PGP: { name: 'ProductGroup' },
    TSK: { name: 'Task' },
    TCC: { name: 'TaskControllerCapabilities' },
    VPN: { name: 'ValuePresentation' },
    WKR: { name: 'Worker' },
    XFR: { name: 'ExternalFileReference' },
}

export class ISO11783TaskDataFile implements Entity {
    public tag = TAGS.ISO11783TaskDataFile

    constructor(public attributes: ISO11783TaskDataFileAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ISO11783TaskDataFile): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.ISO11783TaskDataFile, ISO11783TaskDataFile)
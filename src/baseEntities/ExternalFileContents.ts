import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
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
import { ValuePresentation } from './ValuePresentation'
import { Worker } from './Worker'

import { Entity, EntityConstructor, AttributesDescription } from '../types'


export type ExternalFileContentsAttributes = {
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
    ValuePresentation?: ValuePresentation[]
    Worker?: Worker[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
}
const CHILD_TAGS = {
    BSN: { name: 'BaseStation', isOnlyV4: undefined },
    CCT: { name: 'CodedComment', isOnlyV4: undefined },
    CCG: { name: 'CodedCommentGroup', isOnlyV4: undefined },
    CLD: { name: 'ColourLegend', isOnlyV4: undefined },
    CTP: { name: 'CropType', isOnlyV4: undefined },
    CPC: { name: 'CulturalPractice', isOnlyV4: undefined },
    CTR: { name: 'Customer', isOnlyV4: undefined },
    DVC: { name: 'Device', isOnlyV4: undefined },
    FRM: { name: 'Farm', isOnlyV4: undefined },
    OTQ: { name: 'OperationTechnique', isOnlyV4: undefined },
    PFD: { name: 'Partfield', isOnlyV4: undefined },
    PDT: { name: 'Product', isOnlyV4: undefined },
    PGP: { name: 'ProductGroup', isOnlyV4: undefined },
    TSK: { name: 'Task', isOnlyV4: undefined },
    VPN: { name: 'ValuePresentation', isOnlyV4: undefined },
    WKR: { name: 'Worker', isOnlyV4: undefined },
}

export class ExternalFileContents implements Entity {
    public tag = TAGS.ExternalFileContents

    constructor(public attributes: ExternalFileContentsAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = ExternalFileContents): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.ExternalFileContents, ExternalFileContents)
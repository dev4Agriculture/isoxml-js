import { ElementCompact } from 'xml-js'

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
}

const ATTRIBUTES: AttributesDescription = {
}
const CHILD_TAGS = {
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
    VPN: { name: 'ValuePresentation' },
    WKR: { name: 'Worker' },
}

export class ExternalFileContents implements Entity {
    public tag = 'XFC'

    constructor(public attributes: ExternalFileContentsAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = ExternalFileContents): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass('XFC', ExternalFileContents)
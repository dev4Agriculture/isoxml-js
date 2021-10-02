import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
import { XMLElement } from '../types'

import { TreatmentZone } from './TreatmentZone'
import { Time } from './Time'
import { OperTechPractice } from './OperTechPractice'
import { WorkerAllocation } from './WorkerAllocation'
import { DeviceAllocation } from './DeviceAllocation'
import { Connection } from './Connection'
import { ProductAllocation } from './ProductAllocation'
import { DataLogTrigger } from './DataLogTrigger'
import { CommentAllocation } from './CommentAllocation'
import { TimeLog } from './TimeLog'
import { Grid } from './Grid'
import { ControlAssignment } from './ControlAssignment'
import { GuidanceAllocation } from './GuidanceAllocation'

import { Entity, EntityConstructor, AttributesDescription, ISOXMLReference } from '../types'

export enum TaskTaskStatusEnum {
    Planned = '1',
    Running = '2',
    Paused = '3',
    Completed = '4',
    Template = '5',
    Canceled = '6',
}

export type TaskAttributes = {
    TaskDesignator?: string
    CustomerIdRef?: ISOXMLReference
    FarmIdRef?: ISOXMLReference
    PartfieldIdRef?: ISOXMLReference
    ResponsibleWorkerIdRef?: ISOXMLReference
    TaskStatus: TaskTaskStatusEnum
    DefaultTreatmentZoneCode?: number
    PositionLostTreatmentZoneCode?: number
    OutOfFieldTreatmentZoneCode?: number
    TreatmentZone?: TreatmentZone[]
    Time?: Time[]
    OperTechPractice?: OperTechPractice[]
    WorkerAllocation?: WorkerAllocation[]
    DeviceAllocation?: DeviceAllocation[]
    Connection?: Connection[]
    ProductAllocation?: ProductAllocation[]
    DataLogTrigger?: DataLogTrigger[]
    CommentAllocation?: CommentAllocation[]
    TimeLog?: TimeLog[]
    Grid?: Grid[]
    ControlAssignment?: ControlAssignment[]
    GuidanceAllocation?: GuidanceAllocation[]
    ProprietaryAttributes?: {[name: string]: string}
    ProprietaryTags?: {[tag: string]: XMLElement[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: {
        name: 'TaskId',
        type: 'xs:ID',
        isPrimaryId: true,
        isOptional: false,
        isOnlyV4: false,
    },
    B: {
        name: 'TaskDesignator',
        type: 'xs:string',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    C: {
        name: 'CustomerIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    D: {
        name: 'FarmIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    E: {
        name: 'PartfieldIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    F: {
        name: 'ResponsibleWorkerIdRef',
        type: 'xs:IDREF',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
    },
    G: {
        name: 'TaskStatus',
        type: 'xs:NMTOKEN',
        isPrimaryId: false,
        isOptional: false,
        isOnlyV4: false,
    },
    H: {
        name: 'DefaultTreatmentZoneCode',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 254,
    },
    I: {
        name: 'PositionLostTreatmentZoneCode',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 254,
    },
    J: {
        name: 'OutOfFieldTreatmentZoneCode',
        type: 'xs:unsignedByte',
        isPrimaryId: false,
        isOptional: true,
        isOnlyV4: false,
        minValue: 0,
        maxValue: 254,
    },
}
const CHILD_TAGS = {
    TZN: { name: 'TreatmentZone', isOnlyV4: false },
    TIM: { name: 'Time', isOnlyV4: false },
    OTP: { name: 'OperTechPractice', isOnlyV4: false },
    WAN: { name: 'WorkerAllocation', isOnlyV4: false },
    DAN: { name: 'DeviceAllocation', isOnlyV4: false },
    CNN: { name: 'Connection', isOnlyV4: false },
    PAN: { name: 'ProductAllocation', isOnlyV4: false },
    DLT: { name: 'DataLogTrigger', isOnlyV4: false },
    CAN: { name: 'CommentAllocation', isOnlyV4: false },
    TLG: { name: 'TimeLog', isOnlyV4: false },
    GRD: { name: 'Grid', isOnlyV4: false },
    CAT: { name: 'ControlAssignment', isOnlyV4: true },
    GAN: { name: 'GuidanceAllocation', isOnlyV4: true },
}

export class Task implements Entity {
    public tag = TAGS.Task

    constructor(public attributes: TaskAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string, targetClass: EntityConstructor = Task): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS, internalId)
    }

    toXML(): XMLElement {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Task, Task)
import { ElementCompact } from 'xml-js'

import { TAGS } from './constants'
import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'
import { fromXML, toXML } from '../utils'
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

export const enum TaskTaskStatusEnum {
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
    ProprietaryTags?: {[tag: string]: ElementCompact[]}
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'TaskId', type: 'xs:ID', isPrimaryId: true, isOnlyV4: false },
    B: { name: 'TaskDesignator', type: 'xs:string', isPrimaryId: false, isOnlyV4: false },
    C: { name: 'CustomerIdRef', type: 'xs:IDREF', isPrimaryId: false, isOnlyV4: false },
    D: { name: 'FarmIdRef', type: 'xs:IDREF', isPrimaryId: false, isOnlyV4: false },
    E: { name: 'PartfieldIdRef', type: 'xs:IDREF', isPrimaryId: false, isOnlyV4: false },
    F: { name: 'ResponsibleWorkerIdRef', type: 'xs:IDREF', isPrimaryId: false, isOnlyV4: false },
    G: { name: 'TaskStatus', type: 'xs:NMTOKEN', isPrimaryId: false, isOnlyV4: false },
    H: { name: 'DefaultTreatmentZoneCode', type: 'xs:unsignedByte', isPrimaryId: false, isOnlyV4: false },
    I: { name: 'PositionLostTreatmentZoneCode', type: 'xs:unsignedByte', isPrimaryId: false, isOnlyV4: false },
    J: { name: 'OutOfFieldTreatmentZoneCode', type: 'xs:unsignedByte', isPrimaryId: false, isOnlyV4: false },
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

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Task): Promise<Entity> {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Task, Task)
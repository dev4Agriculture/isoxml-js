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

export type TaskAttributes = {
    TaskDesignator?: string
    CustomerIdRef?: ISOXMLReference
    FarmIdRef?: ISOXMLReference
    PartfieldIdRef?: ISOXMLReference
    ResponsibleWorkerIdRef?: ISOXMLReference
    TaskStatus: string
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
}

const ATTRIBUTES: AttributesDescription = {
    A: { name: 'TaskId', type: 'xs:ID', isPrimaryId: true },
    B: { name: 'TaskDesignator', type: 'xs:string', isPrimaryId: false },
    C: { name: 'CustomerIdRef', type: 'xs:IDREF', isPrimaryId: false },
    D: { name: 'FarmIdRef', type: 'xs:IDREF', isPrimaryId: false },
    E: { name: 'PartfieldIdRef', type: 'xs:IDREF', isPrimaryId: false },
    F: { name: 'ResponsibleWorkerIdRef', type: 'xs:IDREF', isPrimaryId: false },
    G: { name: 'TaskStatus', type: 'xs:NMTOKEN', isPrimaryId: false },
    H: { name: 'DefaultTreatmentZoneCode', type: 'xs:unsignedByte', isPrimaryId: false },
    I: { name: 'PositionLostTreatmentZoneCode', type: 'xs:unsignedByte', isPrimaryId: false },
    J: { name: 'OutOfFieldTreatmentZoneCode', type: 'xs:unsignedByte', isPrimaryId: false },
}
const CHILD_TAGS = {
    TZN: { name: 'TreatmentZone' },
    TIM: { name: 'Time' },
    OTP: { name: 'OperTechPractice' },
    WAN: { name: 'WorkerAllocation' },
    DAN: { name: 'DeviceAllocation' },
    CNN: { name: 'Connection' },
    PAN: { name: 'ProductAllocation' },
    DLT: { name: 'DataLogTrigger' },
    CAN: { name: 'CommentAllocation' },
    TLG: { name: 'TimeLog' },
    GRD: { name: 'Grid' },
    CAT: { name: 'ControlAssignment' },
    GAN: { name: 'GuidanceAllocation' },
}

export class Task implements Entity {
    public tag = TAGS.Task

    constructor(public attributes: TaskAttributes, public isoxmlManager: ISOXMLManager) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, targetClass: EntityConstructor = Task): Entity {
        return fromXML(xml, isoxmlManager, targetClass, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(): ElementCompact {
        return toXML(this, ATTRIBUTES, CHILD_TAGS)
    }
}

registerEntityClass(TAGS.Task, Task)
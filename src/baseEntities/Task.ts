import { ElementCompact } from 'xml-js'

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

import { Entity, AttributesDescription, ISOXMLReference } from '../types'

export type TaskAttributes = {
    TaskId: string
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
    A: { name: 'TaskId', type: 'xs:ID' },
    B: { name: 'TaskDesignator', type: 'xs:string' },
    C: { name: 'CustomerIdRef', type: 'xs:IDREF' },
    D: { name: 'FarmIdRef', type: 'xs:IDREF' },
    E: { name: 'PartfieldIdRef', type: 'xs:IDREF' },
    F: { name: 'ResponsibleWorkerIdRef', type: 'xs:IDREF' },
    G: { name: 'TaskStatus', type: 'xs:NMTOKEN' },
    H: { name: 'DefaultTreatmentZoneCode', type: 'xs:unsignedByte' },
    I: { name: 'PositionLostTreatmentZoneCode', type: 'xs:unsignedByte' },
    J: { name: 'OutOfFieldTreatmentZoneCode', type: 'xs:unsignedByte' },
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
    public tag = 'TSK'

    constructor(public attributes: TaskAttributes) {
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Entity {
        return fromXML(xml, isoxmlManager, Task, ATTRIBUTES, CHILD_TAGS)
    }

    toXML(isoxmlManager: ISOXMLManager): ElementCompact {
        return toXML(this.attributes, isoxmlManager, ATTRIBUTES, CHILD_TAGS)

    }
}

registerEntityClass('TSK', Task)
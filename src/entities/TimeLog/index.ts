import BufferReader from './BufferReader'
import { TimelogTime, TimeLog, TimeLogAttributes, PositionAttributes } from "../../baseEntities"
import { TAGS } from "../../baseEntities/constants"
import { registerEntityClass } from "../../classRegistry"
import { ISOXMLManager } from "../../ISOXMLManager"
import { Entity, ValueInformation, XMLElement } from "../../types"
import { js2xml, xml2js } from "../../xmlManager"
import DDEntities from '../../DDEntities'

export interface TimeLogRecord {
    time: Date
    position: PositionAttributes,
    values: {[ddi: string]: number}
}

export type DataLogValueInfo = ValueInformation & {
    minValue?: number
    maxValue?: number
}

export interface TimeLogInfo {
    valuesInfo: DataLogValueInfo[]
    timeLogs: TimeLogRecord[]
    bbox?: [number, number, number, number]
}

export class ExtendedTimeLog extends TimeLog {
    public tag = TAGS.TimeLog

    public binaryData: Uint8Array
    public timeLogInfo: TimelogTime

    constructor(attributes: TimeLogAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static async fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
        const entity = await TimeLog.fromXML(xml, isoxmlManager, internalId, ExtendedTimeLog) as ExtendedTimeLog
        const xmlFilename = `${entity.attributes.Filename}.XML`
        const binFilename = `${entity.attributes.Filename}.BIN`
        entity.binaryData = await isoxmlManager.getParsedFile(binFilename, true)

        const xmlData = await isoxmlManager.getParsedFile(xmlFilename, false)
        const xmlTimelog = xml2js(xmlData)

        const infoIsoxmlManager = new ISOXMLManager({realm: 'timelog'})
        entity.timeLogInfo = await TimelogTime.fromXML(
            xmlTimelog[TAGS.Time][0],
            infoIsoxmlManager,
            `${xmlFilename}->${TAGS.Time}[0]`
        ) as TimelogTime

        infoIsoxmlManager.getWarnings().forEach(warning => {
            isoxmlManager.addWarning(warning)
        })

        return entity
    }

    toXML(): XMLElement { 
        const json = {
            [TAGS.Time]: this.timeLogInfo.toXML()
        }
        const xmlData = js2xml(json)

        this.isoxmlManager.addFileToSave(xmlData, `${this.attributes.Filename}.XML`) 
        this.isoxmlManager.addFileToSave(this.binaryData, `${this.attributes.Filename}.BIN`) 
        return super.toXML() 
    } 

    parseBinaryFile(): TimeLogInfo {

        const records: TimeLogRecord[] = []

        const reader = new BufferReader(this.binaryData.buffer)

        const headerPos = this.timeLogInfo.attributes.Position?.[0]?.attributes

        const minPoint: [number, number] = [ Infinity,  Infinity]
        const maxPoint: [number, number] = [-Infinity, -Infinity]

        const ranges: {[ddi: string]: {min: number, max: number}} = {}

        while (reader.tell() < this.binaryData.length) {
            const record: TimeLogRecord = {} as any

            const ms = reader.nextUint32()
            const days = reader.nextUint16()

            record.time = new Date(1000 * 60 * 60 * 24 * days + ms) //TODO: timezone ?

            if (headerPos) {
                const position: PositionAttributes = {} as any

                if (headerPos.PositionNorth === null) {
                    position.PositionNorth = reader.nextInt32() / 10000000
                } else {
                    position.PositionNorth = headerPos.PositionNorth
                }

                if (headerPos.PositionEast === null) {
                    position.PositionEast = reader.nextInt32() / 10000000
                } else {
                    position.PositionEast = headerPos.PositionEast
                }

                if (headerPos.PositionUp === null) {
                    position.PositionUp = reader.nextInt32()
                } else {
                    position.PositionUp = headerPos.PositionUp
                }

                if ((headerPos.PositionStatus as any) === '') {
                    position.PositionStatus = reader.nextUint8().toString()
                } else {
                    position.PositionStatus = headerPos.PositionStatus as any
                }

                if (headerPos.PDOP === null) {
                    position.PDOP = reader.nextUint16() / 10
                } else {
                    position.PDOP = headerPos.PDOP
                }

                if (headerPos.HDOP === null) {
                    position.HDOP = reader.nextUint16() / 10
                } else {
                    position.HDOP = headerPos.HDOP
                }

                if (headerPos.NumberOfSatellites === null) {
                    position.NumberOfSatellites = reader.nextUint8()
                } else {
                    position.NumberOfSatellites = headerPos.NumberOfSatellites
                }

                if (headerPos.GpsUtcTime === null) {
                    position.GpsUtcTime = reader.nextUint32()
                } else {
                    position.GpsUtcTime = headerPos.GpsUtcTime
                }

                if (headerPos.GpsUtcDate === null) {
                    position.GpsUtcDate = reader.nextUint16()
                } else {
                    position.GpsUtcDate = headerPos.GpsUtcDate
                }

                record.position = position

                minPoint[0] = Math.min(minPoint[0], position.PositionEast)
                minPoint[1] = Math.min(minPoint[1], position.PositionNorth)
                maxPoint[0] = Math.max(maxPoint[0], position.PositionEast)
                maxPoint[1] = Math.max(maxPoint[1], position.PositionNorth)
            }

            const count = reader.nextUint8()

            const values = {}

            for (var dlv = 0; dlv < count; dlv++) {
                const dlvIdx = reader.nextUint8()
                const ddi = this.timeLogInfo.attributes.DataLogValue[dlvIdx].attributes.ProcessDataDDI
                const value = reader.nextInt32()

                if (!ranges[ddi]) {
                    ranges[ddi] = {
                        min: value,
                        max: value
                    }
                } else {
                    ranges[ddi] = {
                        min: Math.min(ranges[ddi].min, value),
                        max: Math.max(ranges[ddi].max, value)
                    }
                }

                values[ddi] = value
            }

            record.values = values
            records.push(record)
        }

        const bbox = [...minPoint, ...maxPoint] as [number, number, number, number]

        const valuesInfo = (this.timeLogInfo.attributes.DataLogValue || []).map(dlv => {
            const ddi = dlv.attributes.ProcessDataDDI
            const ddiNumber = parseInt(dlv.attributes.ProcessDataDDI, 16)
            const ddEntity = DDEntities[ddiNumber]
            const unit = ddEntity.unit
            const scale = ddEntity.bitResolution
            const offset = 0
            const info: DataLogValueInfo = {
                DDINumber: ddiNumber,
                DDIString: ddi,
                DDEntityName: ddEntity.name,
                unit,
                scale,
                offset
            }

            if (ddi in ranges) {
                info.minValue = ranges[ddi].min
                info.maxValue = ranges[ddi].max
            }

            return info
        })

        return {
            bbox,
            valuesInfo,
            timeLogs: records
        }
    }
}

registerEntityClass('main', TAGS.TimeLog, ExtendedTimeLog)
import BufferReader from './BufferReader'
import {
    TimelogTime,
    TimeLog,
    TimeLogAttributes,
    PositionAttributes,
    TimelogDataLogValue,
    PositionPositionStatusEnum
} from "../../baseEntities"
import { TAGS } from "../../baseEntities/constants"
import { registerEntityClass } from "../../classRegistry"
import { ISOXMLManager } from "../../ISOXMLManager"
import { Entity, ValueInformation, XMLElement } from "../../types"
import { js2xml, xml2js } from "../../xmlManager"
import { ExtendedDeviceElement } from '../DeviceElement'
import { constructValueInformation } from '../../utils'

export interface TimeLogRecord {
    time: Date
    position: PositionAttributes,
    values: {[ddi_det: string]: number}
}

export type DataLogValueInfo = ValueInformation & {
    minValue?: number
    maxValue?: number
    deviceElementId: string
    deviceElementDesignator?: string
    valueKey: string
}

export interface TimeLogInfo {
    valuesInfo: DataLogValueInfo[]
    timeLogs: TimeLogRecord[]
    bbox?: [number, number, number, number]
}

export class ExtendedTimeLog extends TimeLog {
    public tag = TAGS.TimeLog

    public binaryData: Uint8Array
    public timeLogHeader: TimelogTime
    private parsedTimeLog: TimeLogInfo = null

    constructor(attributes: TimeLogAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static async fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
        const entity = await TimeLog.fromXML(xml, isoxmlManager, internalId, ExtendedTimeLog) as ExtendedTimeLog
        const xmlFilename = `${entity.attributes.Filename}.XML`
        const binFilename = `${entity.attributes.Filename}.BIN`
        entity.binaryData = await isoxmlManager.getParsedFile(binFilename, true)
        if (!entity.binaryData) {
            isoxmlManager.addWarning(`TimeLog binary file "${binFilename}" is missing`)
        }

        const xmlData = await isoxmlManager.getParsedFile(xmlFilename, false)
        if (!xmlData) {
            isoxmlManager.addWarning(`TimeLog header file "${xmlFilename}" is missing`)
            return entity
        }
        const xmlTimelog = xml2js(xmlData)

        const timeLogIsoxmlManager = new ISOXMLManager({realm: 'timelog'})
        entity.timeLogHeader = await TimelogTime.fromXML(
            xmlTimelog[TAGS.Time][0],
            timeLogIsoxmlManager,
            `${xmlFilename}->${TAGS.Time}[0]`
        ) as TimelogTime

        timeLogIsoxmlManager.getWarnings().forEach(warning => {
            isoxmlManager.addWarning(warning)
        })

        return entity
    }

    private findValuePresentation(dataLogValue: TimelogDataLogValue) {
        const detId = dataLogValue.attributes.DeviceElementIdRef?.xmlId
        if (!detId) {
            return null
        }

        const deviceElement = this.isoxmlManager.getEntityByXmlId<ExtendedDeviceElement>(detId)

        return deviceElement?.getValuePresentation(dataLogValue.attributes.ProcessDataDDI)
    }

    toXML(): XMLElement { 
        const json = {
            [TAGS.Time]: this.timeLogHeader.toXML()
        }
        const xmlData = js2xml(json)

        this.isoxmlManager.addFileToSave(xmlData, `${this.attributes.Filename}.XML`) 
        this.isoxmlManager.addFileToSave(this.binaryData, `${this.attributes.Filename}.BIN`) 
        return super.toXML() 
    } 

    parseBinaryFile(): TimeLogInfo {

        if (this.parsedTimeLog) {
            return this.parsedTimeLog
        }

        const records: TimeLogRecord[] = []

        const reader = new BufferReader(this.binaryData.buffer)

        const headerPos = this.timeLogHeader.attributes.Position?.[0]?.attributes

        const minPoint: [number, number] = [ Infinity,  Infinity]
        const maxPoint: [number, number] = [-Infinity, -Infinity]

        const ranges: {[ddi_det: string]: {min: number, max: number}} = {}

        while (reader.tell() < this.binaryData.length) {
            const record: TimeLogRecord = {} as any

            const ms = reader.nextUint32()
            const days = reader.nextUint16()

            record.time = new Date(1000 * 60 * 60 * 24 * days + ms) //TODO: timezone ?

            let isValidPosition = false // skip items with lat = lng = 0

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
                    position.PositionStatus = reader.nextUint8().toString() as PositionPositionStatusEnum
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

                isValidPosition = position.PositionEast !== 0 || position.PositionNorth !== 0

                record.position = position

                if (isValidPosition) {
                    minPoint[0] = Math.min(minPoint[0], position.PositionEast)
                    minPoint[1] = Math.min(minPoint[1], position.PositionNorth)
                    maxPoint[0] = Math.max(maxPoint[0], position.PositionEast)
                    maxPoint[1] = Math.max(maxPoint[1], position.PositionNorth)
                }
            }

            const count = reader.nextUint8()

            const values = {}

            for (let dlv = 0; dlv < count; dlv++) {
                const dlvIdx = reader.nextUint8()
                const ddi = this.timeLogHeader.attributes.DataLogValue[dlvIdx].attributes.ProcessDataDDI
                const detId = this.timeLogHeader.attributes.DataLogValue[dlvIdx].attributes.DeviceElementIdRef.xmlId
                const value = reader.nextInt32()

                const key = `${ddi}_${detId}`

                if (isValidPosition) {
                    if (!ranges[key]) {
                        ranges[key] = {
                            min: value,
                            max: value
                        }
                    } else {
                        ranges[key] = {
                            min: Math.min(ranges[key].min, value),
                            max: Math.max(ranges[key].max, value)
                        }
                    }
                }
                values[key] = value
            }

            record.values = values

            if (isValidPosition) {
                records.push(record)
            }
        }

        const bbox = [...minPoint, ...maxPoint] as [number, number, number, number]

        const valuesInfo = (this.timeLogHeader.attributes.DataLogValue || []).map(dlv => {
            const ddi = dlv.attributes.ProcessDataDDI
            const vpn = this.findValuePresentation(dlv)

            const info = constructValueInformation(ddi, vpn) as DataLogValueInfo

            const detId = dlv.attributes.DeviceElementIdRef.xmlId
            const deviceElement = this.isoxmlManager.getEntityByXmlId<ExtendedDeviceElement>(detId)
            const device = deviceElement?.getParentDevice()

            const key = `${ddi}_${detId}`

            const deviceName = device?.attributes.DeviceDesignator ?? ''
            const deviceElementName = deviceElement?.attributes.DeviceElementDesignator ?? ''

            info.deviceElementId = detId
            info.deviceElementDesignator = [deviceName, deviceElementName].join(' - ')
            info.valueKey = key


            if (key in ranges) {
                info.minValue = ranges[key].min
                info.maxValue = ranges[key].max
            }

            return info
        })

        this.parsedTimeLog = {
            bbox,
            valuesInfo,
            timeLogs: records
        }

        return this.parsedTimeLog
    }

    // This is a modified and a more conservative version of the Boxplot algorithm
    // It doesn't work well in all the cases, but sometimes it can be useful
    public rangesWithoutOutliyers(): {minValue: number, maxValue: number}[] {
        const parsedTimeLog = this.parseBinaryFile()
        const uniqueValues: {[valueKey: string]: Set<number>} = {}

        parsedTimeLog.valuesInfo.forEach(valueInfo => {
            uniqueValues[valueInfo.valueKey] = new Set<number>()
        })

        parsedTimeLog.timeLogs.forEach(item => {
            Object.keys(item.values).forEach(valueKey => {
                uniqueValues[valueKey].add(item.values[valueKey])
            })
        })

        const newValuesInfo = parsedTimeLog.valuesInfo.map(valueInfo => {
            const values = [...uniqueValues[valueInfo.valueKey]] 
            if (values.length < 8) {
                return {minValue: valueInfo.minValue, maxValue: valueInfo.maxValue}
            }

            values.sort((a, b) => a - b)

            const q1 = values[values.length >> 2]
            const q3 = values[(values.length * 3) >> 2]
            const iqr = q3 - q1
            const upperBoundary = q3 + 2.5 * iqr
            const lowerBoundary = q1 - 2.5 * iqr

            // console.log(values, q1, q3, lowerBoundary, upperBoundary)

            let minValue: number
            let maxValue: number

            for (let i = 0; i < values.length; i++) {
                if (values[i] >= lowerBoundary) {
                    minValue = values[i]
                    break
                }
            }

            for (let i = values.length - 1; i >= 0; i--) {
                if (values[i] <= upperBoundary) {
                    maxValue = values[i]
                    break
                }
            }

            return {
                minValue,
                maxValue
            }
        })

        return newValuesInfo
    }
}

registerEntityClass('main', TAGS.TimeLog, ExtendedTimeLog)
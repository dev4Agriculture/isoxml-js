import { readFileSync } from "fs"
import { ISOXMLManager, Task } from "../.."
import { ExtendedTimeLog } from "."

describe('TimeLog Entity', () => {
    it('should parse binary TimeLog files', async () => {
        const isoxmlData = readFileSync('./data/2021-04-09T15_33_26_taskdata.zip')
        const isoxmlManager = new ISOXMLManager({version: 4})

        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')

        const timeLog = isoxmlManager.getEntityByXmlId<Task>('TSK-1').attributes.TimeLog[0] as ExtendedTimeLog

        const parsedTimeLog = timeLog.parseBinaryFile()

        expect(parsedTimeLog.timeLogs).toHaveLength(207)
        expect(parsedTimeLog.valuesInfo).toHaveLength(4)
        expect(parsedTimeLog.bbox).toEqual([9.5777866, 45.5277534, 9.5779409, 45.5278066])
    })

    it('should detect outliers', async () => {
        const isoxmlData = readFileSync('./data/2021-04-09T15_33_26_taskdata.zip')
        const isoxmlManager = new ISOXMLManager()

        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')

        const timeLog = isoxmlManager.getEntityByXmlId<Task>('TSK-1').attributes.TimeLog[0] as ExtendedTimeLog

        const ranges = timeLog.rangesWithoutOutliers()

        expect(ranges[2].minValue).toBe(-2231)
        expect(ranges[2].maxValue).toBe(334)
    })
})

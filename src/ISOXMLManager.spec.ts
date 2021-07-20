import { readFileSync, writeFileSync } from 'fs'
import JSZip from 'jszip'
import { TaskTaskStatusEnum } from './baseEntities'
import { TAGS } from './baseEntities/constants'
import { ExtendedTask } from './entities/Task'
import { ISOXMLManager } from './ISOXMLManager'

describe('ISOXML Manager', () => {

    it('should parse ISOXML', async () => {
        const isoxmlData = readFileSync('./data/test1.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        expect(isoxmlManager.rootElement).toBeTruthy()
    })

    it('should parse ISOXML with external files', async () => {
        const isoxmlData = readFileSync('./data/2021-04-09T15_33_26_taskdata.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        expect(isoxmlManager.rootElement.attributes.Task).toBeTruthy()
        expect(isoxmlManager.getReferenceByXmlId('TSK-1').entity).toBeTruthy()
        expect(isoxmlManager.rootElement.attributes.ExternalFileReference).toHaveLength(0)
        // const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test1_out.zip', data)
    })

    it('should parse and save grid files', async () => {
        const isoxmlData = readFileSync('./data/task_with_grid.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test_grid_out.zip', data)
        expect(data.length).toBe(14080)

        const zip = await JSZip.loadAsync(data)
        expect(zip.file("TASKDATA/GRD00001.BIN")).toBeTruthy()
    })

    it('should parse and save timelog files', async () => {
        const isoxmlData = readFileSync('./data/2021-04-09T15_33_26_taskdata.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test_timelog_out.zip', data)

        const zip = await JSZip.loadAsync(data)
        expect(zip.file("TASKDATA/TLG00001.XML")).toBeTruthy()
        expect(zip.file("TASKDATA/TLG00001.BIN")).toBeTruthy()
    })

    it('should preserve attached files', async () => {
        const isoxmlData = readFileSync('./data/task_full.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test_grid_out.zip', data)

        const zip = await JSZip.loadAsync(data)
        expect(zip.file("TASKDATA/TEST1234.BIN")).toBeTruthy()
    })

    it('should preserve proprietary attributes and elements', async () => {
        const isoxmlData = readFileSync('./data/task_full.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test_grid_out.zip', data)

        const isoxmlManager2 = new ISOXMLManager()
        await isoxmlManager2.parseISOXMLFile(data, 'application/zip')
        expect(isoxmlManager2.rootElement.attributes.ProprietaryTags).toHaveProperty('P1234_Area')
        expect(
            isoxmlManager2.rootElement.attributes.BaseStation[0].attributes.ProprietaryAttributes
        ).toHaveProperty('P123_Area')
    })

    it('should parse and save ISOXML', async () => {
        const isoxmlData = readFileSync('./data/test1.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test1_out.zip', data)
        expect(data.length).toBe(3973)
    })

    it('should manually create ISOXML', async () => {
        const isoxmlManager = new ISOXMLManager()
        const task = isoxmlManager.createEntityFromAttributes(TAGS.Task, {
            TaskStatus: TaskTaskStatusEnum.Planned
        }) as ExtendedTask
        isoxmlManager.registerEntity(task)

        isoxmlManager.rootElement.attributes.Task = [task]

        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test1_out.zip', data)
        expect(data.length).toBe(464)
        const zip = await JSZip.loadAsync(data)
        expect(zip.file("TASKDATA/TASKDATA.XML")).toBeTruthy()
    })
    it('should preserve FMIS IDs', async () => {
        const isoxmlManager = new ISOXMLManager({fmisURI: 'http://example.com'})
        const task = isoxmlManager.createEntityFromAttributes(TAGS.Task, {
            TaskStatus: TaskTaskStatusEnum.Planned
        }) as ExtendedTask
        const ref = isoxmlManager.registerEntity(task, null, '777')

        isoxmlManager.rootElement.attributes.Task = [task]

        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test1_out.zip', data)

        const isoxmlManager2 = new ISOXMLManager({fmisURI: 'http://example.com'})
        await isoxmlManager2.parseISOXMLFile(data, 'application/zip')
        const parsedRef = isoxmlManager2.getReferenceByXmlId(ref.xmlId)
        expect(parsedRef.fmisId).toBe('777')
    })

    it('should support "rootFolder" option', async () => {
        const isoxmlManager = new ISOXMLManager({ rootFolder: "testFolder" })
        const task = isoxmlManager.createEntityFromAttributes(TAGS.Task, {
            TaskStatus: TaskTaskStatusEnum.Planned
        }) as ExtendedTask
        isoxmlManager.registerEntity(task)

        isoxmlManager.rootElement.attributes.Task = [task]

        const data = await isoxmlManager.saveISOXML()

        const zip = await JSZip.loadAsync(data)
        expect(zip.file("testFolder/TASKDATA.XML")).toBeTruthy()
    })
})
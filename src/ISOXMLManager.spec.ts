import { readFileSync } from 'fs'
import JSZip from 'jszip'
import { TaskTaskStatusEnum } from './baseEntities'
import { TAGS } from './baseEntities/constants'
import { ExtendedTask } from './entities/Task'
import { ISOXMLManager } from './ISOXMLManager'

describe('ISOXML Manager', () => {

    it('should parse ISOXML as ZIP', async () => {
        const isoxmlData = readFileSync('./data/test1.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        expect(isoxmlManager.rootElement).toBeTruthy()
        expect(isoxmlManager.getWarnings()).toHaveLength(0)
    })

    it('should parse TASKDATA.XML as string', async () => {
        const isoxmlData = readFileSync('./data/test1.zip')
        const zip = await JSZip.loadAsync(isoxmlData)
        const taskDataStr = await zip.file("TASKDATA/TASKDATA.XML").async('string')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(taskDataStr, 'application/xml')
        expect(isoxmlManager.rootElement).toBeTruthy()
        expect(isoxmlManager.rootElement.attributes.Task).toHaveLength(2)
        expect(isoxmlManager.options.rootFolder).toBe('')
    })

    it('should parse ISOXML with external files', async () => {
        const isoxmlData = readFileSync('./data/2021-04-09T15_33_26_taskdata.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        expect(isoxmlManager.rootElement.attributes.Task).toBeTruthy()
        expect(isoxmlManager.getReferenceByXmlId('TSK-1').entity).toBeTruthy()
        expect(isoxmlManager.rootElement.attributes.ExternalFileReference).toHaveLength(0)
        expect(isoxmlManager.getWarnings()).toHaveLength(2)
        // const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test1_out.zip', data)
    })

    it('should parse and save grid files', async () => {
        const isoxmlData = readFileSync('./data/task_with_grid.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        expect(isoxmlManager.getWarnings()).toHaveLength(1)
        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test_grid_out.zip', data)
        expect(data.length).toBe(14065)

        const zip = await JSZip.loadAsync(data)
        expect(zip.file("TASKDATA/GRD00001.bin")).toBeTruthy()
    })

    it('should parse and save timelog files', async () => {
        const isoxmlData = readFileSync('./data/2021-04-09T15_33_26_taskdata.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        expect(isoxmlManager.getWarnings()).toHaveLength(2)
        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test_timelog_out.zip', data)

        const zip = await JSZip.loadAsync(data)
        expect(zip.file("TASKDATA/TLG00001.xml")).toBeTruthy()
        expect(zip.file("TASKDATA/TLG00001.bin")).toBeTruthy()
    })

    it('should preserve attached files', async () => {
        const isoxmlData = readFileSync('./data/task_full.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        expect(isoxmlManager.getWarnings()).toHaveLength(0)
        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test_grid_out.zip', data)

        const zip = await JSZip.loadAsync(data)
        expect(zip.file("TASKDATA/TEST1234.BIN")).toBeTruthy()
    })

    it('should preserve proprietary attributes and elements', async () => {
        const isoxmlData = readFileSync('./data/task_full.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        expect(isoxmlManager.getWarnings()).toHaveLength(0)
        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test_grid_out.zip', data)

        const isoxmlManager2 = new ISOXMLManager()
        await isoxmlManager2.parseISOXMLFile(data, 'application/zip')
        expect(isoxmlManager2.getWarnings()).toHaveLength(0)
        expect(isoxmlManager2.rootElement.attributes.ProprietaryTags).toHaveProperty('P1234_Area')
        expect(
            isoxmlManager2.rootElement.attributes.BaseStation[0].attributes.ProprietaryAttributes
        ).toHaveProperty('P123_Area')
    })

    it('should parse and save ISOXML', async () => {
        const isoxmlData = readFileSync('./data/test1.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        expect(isoxmlManager.getWarnings()).toHaveLength(0)
        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test1_out.zip', data)
        expect(data.length).toBe(4044)
    })

    it('should manually create ISOXML', async () => {
        const isoxmlManager = new ISOXMLManager()
        const task = isoxmlManager.createEntityFromAttributes<ExtendedTask>(TAGS.Task, {
            TaskStatus: TaskTaskStatusEnum.Planned
        })
        isoxmlManager.registerEntity(task)

        isoxmlManager.rootElement.attributes.Task = [task]

        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test1_out.zip', data)
        expect(data.length).toBe(470)
        const zip = await JSZip.loadAsync(data)
        expect(zip.file("TASKDATA/TASKDATA.XML")).toBeTruthy()
    })

    it('should handle strings with special characters properly', async () => {
        const isoxmlManager = new ISOXMLManager()
        const task = isoxmlManager.createEntityFromAttributes<ExtendedTask>(TAGS.Task, {
            TaskStatus: TaskTaskStatusEnum.Planned
        })
        isoxmlManager.registerEntity(task)

        isoxmlManager.rootElement.attributes.Task = [task]

        isoxmlManager.updateOptions({fmisTitle: `&<>'"`})

        const data = await isoxmlManager.saveISOXML()

        // writeFileSync('./data/out_characters.zip', data)
        const isoxmlManager2 = new ISOXMLManager()
        await isoxmlManager2.parseISOXMLFile(data, 'application/zip')
        expect(isoxmlManager2.options.fmisTitle).toBe(`&<>'"`)
    })

    it('should preserve FMIS IDs', async () => {
        const isoxmlManager = new ISOXMLManager({fmisURI: 'http://example.com'})
        const task = isoxmlManager.createEntityFromAttributes<ExtendedTask>(TAGS.Task, {
            TaskStatus: TaskTaskStatusEnum.Planned
        })
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
        const task = isoxmlManager.createEntityFromAttributes<ExtendedTask>(TAGS.Task, {
            TaskStatus: TaskTaskStatusEnum.Planned
        })
        isoxmlManager.registerEntity(task)

        isoxmlManager.rootElement.attributes.Task = [task]

        const data = await isoxmlManager.saveISOXML()

        const zip = await JSZip.loadAsync(data)
        expect(zip.file("testFolder/TASKDATA.XML")).toBeTruthy()
    })

    it('should generate unique filenames', async () => {
        const isoxmlManager = new ISOXMLManager()
        const firstName = isoxmlManager.generateUniqueFilename(TAGS.Grid)
        expect(firstName).toBe('GRD00001')
        isoxmlManager.addFileToSave('', firstName + '.BIN')
        const secondName = isoxmlManager.generateUniqueFilename(TAGS.Grid)
        expect(secondName).toBe('GRD00002')
    })

    it('should not save V4Only elements in V3', async () => {
        const isoxmlData = readFileSync('./data/task_full.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        expect(isoxmlManager.getWarnings()).toHaveLength(0)
        isoxmlManager.updateOptions({version: 3})
        const data = await isoxmlManager.saveISOXML()
        // writeFileSync('./data/test_grid_out.zip', data)

        const isoxmlManager2 = new ISOXMLManager()
        await isoxmlManager2.parseISOXMLFile(data, 'application/zip')
        expect(isoxmlManager2.getWarnings()).toHaveLength(0)
        expect(isoxmlManager2.options.version).toBe(3)
        expect(isoxmlManager2.rootElement.attributes).not.toHaveProperty('BaseStation')
        expect(isoxmlManager2.rootElement.attributes.CropType[0].attributes).not.toHaveProperty('ProductGroupIdRef')
    })

    it('should add warnings', async () => {
        const isoxmlData = readFileSync('./data/task_with_warnings.zip')
        const isoxmlManager = new ISOXMLManager()
        await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')
        const warnings = isoxmlManager.getWarnings()
        expect(warnings).toHaveLength(3)
        expect(warnings.find(warn => warn.startsWith('[TSK1->TZN[1]]'))).toBeTruthy()
        expect(warnings.find(warn => warn.startsWith('[TSK1]'))).toBeTruthy()
    })
})
import {readFileSync, writeFileSync} from 'fs'
import { TaskTaskStatusEnum } from './baseEntities'
import { TAGS } from './baseEntities/constants'
import { ExtendedTask } from './entities/Task'
import { ISOXMLManager } from './ISOXMLManager'

describe('ISOXML Manager', () => {

  it('should parse ISOXML', async () => {
    const isoxmlData = readFileSync('./data/test1.zip')
    const isoxmlManager = new ISOXMLManager()
    await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip', null)
    expect(isoxmlManager.rootElement).toBeTruthy()
  })

  it('should parse ISOXML with external files', async () => {
    const isoxmlData = readFileSync('./data/2021-04-09T15_33_26_taskdata.zip')
    const isoxmlManager = new ISOXMLManager()
    await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip', null)
    expect(isoxmlManager.rootElement.attributes.Task).toBeTruthy()
    // const data = await isoxmlManager.saveISOXML()
    // writeFileSync('./data/test1_out.zip', data)
  })

  it('should parse and save grid files', async () => {
    const isoxmlData = readFileSync('./data/task_with_grid.zip')
    const isoxmlManager = new ISOXMLManager()
    await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip', null)
    const data = await isoxmlManager.saveISOXML()
    // writeFileSync('./data/test_grid_out.zip', data)
    expect(data.length).toBe(13757)
  })

  it('should parse and save ISOXML', async () => {
    const isoxmlData = readFileSync('./data/test1.zip')
    const isoxmlManager = new ISOXMLManager()
    await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip', null)
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

    isoxmlManager.rootElement.attributes.Task = [ task ]

    const data = await isoxmlManager.saveISOXML()
    // writeFileSync('./data/test1_out.zip', data)
    expect(data.length).toBe(464)
  })
})
import {readFileSync, writeFileSync} from 'fs'
import { ISOXMLManager } from './ISOXMLManager'

describe('ISOXML Manager', () => {

  it('should parse ISOXML', async () => {
    const isoxmlData = readFileSync('./data/test1.zip')
    const entitiesManager = new ISOXMLManager()
    await entitiesManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip', null)
    expect(entitiesManager.rootElement).toBeTruthy()
  })

  it('should parse ISOXML with external files', async () => {
    const isoxmlData = readFileSync('./data/2021-04-09T15_33_26_taskdata.zip')
    const entitiesManager = new ISOXMLManager()
    await entitiesManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip', null)
    expect(entitiesManager.rootElement.attributes.Task).toBeTruthy()
    // const data = await entitiesManager.saveISOXML()
    // writeFileSync('./data/test1_out.zip', data)
  })

  it('should parse and save grid files', async () => {
    const isoxmlData = readFileSync('./data/task_with_grid.zip')
    const entitiesManager = new ISOXMLManager()
    await entitiesManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip', null)
    const data = await entitiesManager.saveISOXML()
    // writeFileSync('./data/test1_out.zip', data)
    expect(data.length).toBe(13757)
  })

  it('should parse and save ISOXML', async () => {
    const isoxmlData = readFileSync('./data/test1.zip')
    const entitiesManager = new ISOXMLManager()
    await entitiesManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip', null)
    const data = await entitiesManager.saveISOXML()
    // writeFileSync('./data/test1_out.zip', data)
    expect(data.length).toBe(3973)
  })
})
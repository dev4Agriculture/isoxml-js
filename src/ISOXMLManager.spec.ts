import {readFileSync} from 'fs'
import { ISOXMLManager } from './ISOXMLManager'

describe('ISOXML Manager', () => {
  it('should parse ISOXML', async () => {
    const isoxmlData = readFileSync('./data/test1.zip')
    const entitiesManager = new ISOXMLManager()
    await entitiesManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip', null)
    expect(entitiesManager.rootElement).toBeTruthy()
  })
})
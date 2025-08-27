import {readFileSync} from 'fs'

import { ISOXMLManager } from '../../ISOXMLManager'
import { ExtendedGrid } from './Grid'
import { Task } from '../../baseEntities/Task'

describe('Grid Entity', () => {
  it('should create instance from GeoJSON', async () => {
    const geoJSONdata = JSON.parse(readFileSync('./data/test.geojson', 'utf-8'))
    const isoxmlManager = new ISOXMLManager()
    const grid = ExtendedGrid.fromGeoJSON(geoJSONdata, ['DOSE'], isoxmlManager)
    expect(grid.attributes.Filelength).toBe(22896)

    expect(grid.attributes.GridMinimumNorthPosition).toBe(55.82481700900832)
    expect(grid.attributes.GridMinimumEastPosition).toBe(39.138728173503324)
    expect(grid.attributes.Filename).toBe('GRD00001')

    const xml = grid.toXML()

    expect(xml).toBeTruthy()
    expect(Object.keys(isoxmlManager.filesToSave)).toHaveLength(1)
  })

  it('should convert Grid to GeoJSON', async () => {
    const geoJSONdata = JSON.parse(readFileSync('./data/test.geojson', 'utf-8'))
    const isoxmlManager = new ISOXMLManager()
    const grid = ExtendedGrid.fromGeoJSON(geoJSONdata, ['DOSE'], isoxmlManager)

    const geoJSON = grid.toGeoJSON(['DOSE'])

    expect(geoJSON).toBeTruthy()
    expect(geoJSON.features[0].properties!.DOSE).toBe(16) // 15.7 should be rounded to 16

  })

  it('should verify grid size correctly', async () => {
    const isoxmlData = readFileSync('./data/task_with_grid.zip')
    const isoxmlManager = new ISOXMLManager({version: 4})

    await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')

    const grid = isoxmlManager.getEntityByXmlId<Task>('TSK1').attributes.Grid![0] as ExtendedGrid

    const anotherIsoxmlManager = new ISOXMLManager({version: 4})

    grid.verifyGridSize(anotherIsoxmlManager, 1)
    expect(anotherIsoxmlManager.getWarnings()).toHaveLength(0)
    grid.verifyGridSize(anotherIsoxmlManager, 2)
    expect(anotherIsoxmlManager.getWarnings()).toHaveLength(1)
  })

  it('should parse a grid-element even when the binary-file is missing', async () => {
    const isoxmlData = readFileSync('./data/grid-without-binary.zip')
    const isoxmlManager = new ISOXMLManager()

    await isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip')

    expect(isoxmlManager.getWarnings()).toHaveLength(1)
  })
})

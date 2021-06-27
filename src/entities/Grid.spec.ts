import {readFileSync, writeFileSync} from 'fs'
import { ExtendedGrid } from './Grid'
import { ISOXMLManager } from '../ISOXMLManager'

describe('Grid Entity', () => {
  it('should create instance from GeoJSON', async () => {
    const geoJSONdata = JSON.parse(readFileSync('./data/test.geojson', 'utf-8'))
    const isoxmlManager = new ISOXMLManager()
    const grid = ExtendedGrid.fromGeoJSON(geoJSONdata, isoxmlManager)
    expect(grid.attributes.Filelength).toBe(22896)

    expect(grid.attributes.GridMinimumNorthPosition).toBe(55.82481700900832)
    expect(grid.attributes.GridMinimumEastPosition).toBe(39.138728173503324)

    const xml = grid.toXML()

    expect(xml).toBeTruthy()
    expect(Object.keys(isoxmlManager.filesToSave)).toHaveLength(1)
  })
})
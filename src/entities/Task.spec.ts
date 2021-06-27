import {readFileSync, writeFileSync} from 'fs'
import { ExtendedGrid } from './Grid'
import { ISOXMLManager } from '../ISOXMLManager'
import { ExtendedTask } from './Task'

describe('Task Entity', () => {
  it('should add Grid from GeoJSON', async () => {
    const geoJSONdata = JSON.parse(readFileSync('./data/test.geojson', 'utf-8'))
    const isoxmlManager = new ISOXMLManager()

    const task = isoxmlManager.createEntityFromAttributes('TSK', {
        TaskStatus: '2'
    }) as ExtendedTask

    task.addGridFromGeoJSON(geoJSONdata, '0001')
    
    expect(task.attributes.TreatmentZone).toHaveLength(2)
    expect(task.attributes.Grid).toHaveLength(1)
  })
})
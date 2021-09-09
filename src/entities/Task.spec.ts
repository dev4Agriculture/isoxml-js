import { readFileSync } from 'fs'
import { ISOXMLManager } from '../ISOXMLManager'
import { ExtendedTask } from './Task'
import { TaskTaskStatusEnum } from '../baseEntities'

describe('Task Entity', () => {
    it('should add Grid from GeoJSON', async () => {
        const geoJSONdata = JSON.parse(readFileSync('./data/test.geojson', 'utf-8'))
        const isoxmlManager = new ISOXMLManager()

        const task = new ExtendedTask({
            TaskStatus: TaskTaskStatusEnum.Planned
        }, isoxmlManager) as ExtendedTask

        task.addGridFromGeoJSON(geoJSONdata, 1)
        
        expect(task.attributes.TreatmentZone).toHaveLength(2)
        expect(task.attributes.Grid).toHaveLength(1)
    })

    it('should return Grid as GeoJSON', async () => {
        const geoJSONdata = JSON.parse(readFileSync('./data/test.geojson', 'utf-8'))
        const isoxmlManager = new ISOXMLManager()

        const task = new ExtendedTask({
            TaskStatus: TaskTaskStatusEnum.Planned
        }, isoxmlManager) as ExtendedTask

        task.addGridFromGeoJSON(geoJSONdata, 1)

        const geoJSON = task.getGridAsGeoJSON()

        expect(geoJSON).toBeTruthy()
        expect(geoJSON.features[0].properties.DOSE).toBe(16) // 15.7 should be rounded to 16
    })
})
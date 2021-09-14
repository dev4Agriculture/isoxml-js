import { readFileSync } from 'fs'
import { ISOXMLManager } from '../ISOXMLManager'
import { ExtendedTask } from './Task'
import { TaskTaskStatusEnum, ValuePresentation } from '../baseEntities'

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
        }, isoxmlManager)

        task.addGridFromGeoJSON(geoJSONdata, 1)

        const geoJSON = task.getGridAsGeoJSON()

        expect(geoJSON).toBeTruthy()
        expect(geoJSON.features[0].properties.DOSE).toBe(16) // 15.7 should be rounded to 16
    })

    it('should return grid values description', async () => {
        const geoJSONdata = JSON.parse(readFileSync('./data/test.geojson', 'utf-8'))
        const isoxmlManager = new ISOXMLManager()

        const task = new ExtendedTask({
            TaskStatus: TaskTaskStatusEnum.Planned
        }, isoxmlManager) as ExtendedTask

        const descriptionBefore = task.getGridValuesDescription()

        expect(descriptionBefore).toHaveLength(0)

        task.addGridFromGeoJSON(geoJSONdata, 1)

        const descriptionAfter = task.getGridValuesDescription()

        expect(descriptionAfter).toHaveLength(1)
        expect(descriptionAfter[0].DDI).toBe(1)
        expect(descriptionAfter[0].scale).toBe(0.01)
        expect(descriptionAfter[0].offset).toBe(0)

        const vpn = new ValuePresentation({
            Offset: 20,
            Scale: 2,
            NumberOfDecimals: 1,
            UnitDesignator: 'custom-unit'
        }, isoxmlManager)

        task.addGridFromGeoJSON(geoJSONdata, 1, null, isoxmlManager.registerEntity(vpn))
        const descriptionAfterWithVPN = task.getGridValuesDescription()

        expect(descriptionAfterWithVPN).toHaveLength(1)
        expect(descriptionAfterWithVPN[0].DDI).toBe(1)
        expect(descriptionAfterWithVPN[0].scale).toBe(2)
        expect(descriptionAfterWithVPN[0].offset).toBe(20)
        expect(descriptionAfterWithVPN[0].unit).toBe('custom-unit')
    })
})
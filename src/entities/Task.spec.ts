import { readFileSync } from 'fs'
import { ISOXMLManager } from '../ISOXMLManager'
import { ExtendedTask } from './Task'
import { ProcessDataVariable, TaskTaskStatusEnum, ValuePresentation } from '../baseEntities'
import { TAGS } from '../baseEntities/constants'

describe('Task Entity', () => {
    it('should add Grid from GeoJSON', async () => {
        const geoJSONdata = JSON.parse(readFileSync('./data/test.geojson', 'utf-8'))
        const isoxmlManager = new ISOXMLManager()

        const task = new ExtendedTask({
            TaskStatus: TaskTaskStatusEnum.Planned
        }, isoxmlManager) as ExtendedTask

        task.addGridFromGeoJSON(
            geoJSONdata,
            [isoxmlManager.createEntityFromAttributes(TAGS.ProcessDataVariable, {ProcessDataDDI: '0001'})],
            ['DOSE']
        )
        
        expect(task.attributes.TreatmentZone).toHaveLength(2)
        expect(task.attributes.Grid).toHaveLength(1)
    })

    it('should return Grid as GeoJSON', async () => {
        const geoJSONdata = JSON.parse(readFileSync('./data/test.geojson', 'utf-8'))
        const isoxmlManager = new ISOXMLManager()

        const task = new ExtendedTask({
            TaskStatus: TaskTaskStatusEnum.Planned
        }, isoxmlManager)

        task.addGridFromGeoJSON(
            geoJSONdata,
            [isoxmlManager.createEntityFromAttributes(TAGS.ProcessDataVariable, {ProcessDataDDI: '0001'})],
            ['DOSE']
        )

        const geoJSON = task.getGridAsGeoJSON(['DOSE'])

        expect(geoJSON).toBeTruthy()
        expect(geoJSON.features[0].properties!.DOSE).toBe(16) // 15.7 should be rounded to 16
    })

    it('should return grid values description', async () => {
        const geoJSONdata = JSON.parse(readFileSync('./data/test.geojson', 'utf-8'))
        const isoxmlManager = new ISOXMLManager()

        const task = new ExtendedTask({
            TaskStatus: TaskTaskStatusEnum.Planned
        }, isoxmlManager) as ExtendedTask

        const descriptionBefore = task.getGridValuesDescription()

        expect(descriptionBefore).toHaveLength(0)

        task.addGridFromGeoJSON(
            geoJSONdata,
            [isoxmlManager.createEntityFromAttributes(TAGS.ProcessDataVariable, {ProcessDataDDI: '0001'})],
            ['DOSE']
        )

        const descriptionAfter = task.getGridValuesDescription()

        expect(descriptionAfter).toHaveLength(1)
        expect(descriptionAfter[0].DDINumber).toBe(1)
        expect(descriptionAfter[0].scale).toBe(0.01)
        expect(descriptionAfter[0].offset).toBe(0)

        const vpn = new ValuePresentation({
            Offset: 20,
            Scale: 2,
            NumberOfDecimals: 1,
            UnitDesignator: 'custom-unit'
        }, isoxmlManager)

        task.addGridFromGeoJSON(
            geoJSONdata,
            [isoxmlManager.createEntityFromAttributes(
                TAGS.ProcessDataVariable,
                {
                    ProcessDataDDI: '0001',
                    ValuePresentationIdRef: isoxmlManager.registerEntity(vpn)
                }
            )],
            ['DOSE']
        )
        const descriptionAfterWithVPN = task.getGridValuesDescription()

        expect(descriptionAfterWithVPN).toHaveLength(1)
        expect(descriptionAfterWithVPN[0].DDINumber).toBe(1)
        expect(descriptionAfterWithVPN[0].scale).toBe(2)
        expect(descriptionAfterWithVPN[0].offset).toBe(20)
        expect(descriptionAfterWithVPN[0].unit).toBe('custom-unit')
    })

    it('should support positionLostValue and outOfFieldValue', async () => {
        const geoJSONdata = JSON.parse(readFileSync('./data/test.geojson', 'utf-8'))
        const isoxmlManager = new ISOXMLManager()

        const task = new ExtendedTask({
            TaskStatus: TaskTaskStatusEnum.Planned
        }, isoxmlManager)

        const pdv = isoxmlManager.createEntityFromAttributes<ProcessDataVariable>(
            TAGS.ProcessDataVariable,
            {
                ProcessDataDDI: '0001',
            }
        )
        task.addGridFromGeoJSON(geoJSONdata, [pdv], ['DOSE'], [11], [22], [33])

        expect(task.attributes.TreatmentZone).toHaveLength(4)

        const getTZNValue = (code: number) => {
            const tzn = task.attributes.TreatmentZone!.find(
                tzn => tzn.attributes.TreatmentZoneCode == code
            )
            return tzn?.attributes.ProcessDataVariable![0].attributes.ProcessDataValue
        }

        expect(getTZNValue(task.attributes.DefaultTreatmentZoneCode!)).toBe(11)
        expect(getTZNValue(task.attributes.PositionLostTreatmentZoneCode!)).toBe(22)
        expect(getTZNValue(task.attributes.OutOfFieldTreatmentZoneCode!)).toBe(33)

        const tznCodes = new Set([
            task.attributes.DefaultTreatmentZoneCode,
            task.attributes.PositionLostTreatmentZoneCode,
            task.attributes.OutOfFieldTreatmentZoneCode,
            task.attributes.Grid![0].attributes.TreatmentZoneCode
        ])
        expect(tznCodes.size).toBe(4) // all TZN codes are different
    })
})
import { DeviceProcessData, ValuePresentation } from "./baseEntities"
import { TAGS } from "./baseEntities/constants"
import { ISOXMLManager } from "./ISOXMLManager"
import { constructValueInformation } from "./utils"

describe('Utils', () => {
    it('constructValueInformation', async () => {

        const valueInfo = constructValueInformation('0001')

        expect(valueInfo.DDIString).toBe('0001')
        expect(valueInfo.DDINumber).toBe(1)
        expect(valueInfo.DDEntityName).toBe('Setpoint Volume Per Area Application Rate as [mm³/m²]')
        expect(valueInfo.unit).toBe('mm³/m²')
        expect(valueInfo.numberOfDecimals).toBe(2)
        expect(valueInfo.offset).toBe(0)
        expect(valueInfo.scale).toBe(0.01)
        expect(valueInfo.isProprietary).toBe(false)
    })

    it('constructValueInformation with ValuePresentation', async () => {
        const isoxmlManager = new ISOXMLManager()

        const valuePresentation = isoxmlManager.createEntityFromAttributes<ValuePresentation>(TAGS.ValuePresentation, {
            Offset: 0,
            Scale: 0.0001,
            NumberOfDecimals: 1,
            UnitDesignator: 'l/h'

        })

        const valueInfo = constructValueInformation('0001', valuePresentation)

        expect(valueInfo.DDIString).toBe('0001')
        expect(valueInfo.DDINumber).toBe(1)
        expect(valueInfo.DDEntityName).toBe('Setpoint Volume Per Area Application Rate as [mm³/m²]')
        expect(valueInfo.unit).toBe('l/h')
        expect(valueInfo.numberOfDecimals).toBe(1)
        expect(valueInfo.offset).toBe(0)
        expect(valueInfo.scale).toBe(0.0001)
        expect(valueInfo.isProprietary).toBe(false)
    })

    it('constructValueInformation with DeviceProcessData', async () => {
        const isoxmlManager = new ISOXMLManager()

        const dpd = isoxmlManager.createEntityFromAttributes<DeviceProcessData>(TAGS.DeviceProcessData, {
            DeviceProcessDataObjectId: 0,
            DeviceProcessDataDDI: 'FFFF',
            DeviceProcessDataProperty: 1,
            DeviceProcessDataTriggerMethods: 0,
            DeviceProcessDataDesignator: 'Test process'
        })

        const valueInfo = constructValueInformation('FFFF', null, dpd)

        expect(valueInfo.DDIString).toBe('FFFF')
        expect(valueInfo.DDINumber).toBe(0xFFFF)
        expect(valueInfo.DDEntityName).toBe('Test process')
    })

    it('constructValueInformation - unknown DDEntity', async () => {

        const valueInfo = constructValueInformation('FFFF')

        expect(valueInfo.DDIString).toBe('FFFF')
        expect(valueInfo.DDINumber).toBe(65535)
        expect(valueInfo.DDEntityName).toBe('')
        expect(valueInfo.unit).toBe('')
        expect(valueInfo.numberOfDecimals).toBe(-0)
        expect(valueInfo.offset).toBe(0)
        expect(valueInfo.scale).toBe(1)
    })

})
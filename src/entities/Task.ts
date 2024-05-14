import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'

import { Entity, ValueInformation, XMLElement } from '../types'

import { ProcessDataVariable, Task, TaskAttributes, TreatmentZone, ValuePresentation } from '../baseEntities'
import { ExtendedGrid } from './Grid'
import { FeatureCollection } from '@turf/helpers'
import { TAGS } from '../baseEntities/constants'
import { constructValueInformation } from '../utils'
import { ExtendedDeviceElement } from './DeviceElement'

export class ExtendedTask extends Task {
    public tag = TAGS.Task

    constructor(attributes: TaskAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
        return Task.fromXML(xml, isoxmlManager, internalId, ExtendedTask)
    }
    
    private findFreeTZNCode(): number | undefined {
        const tznCodes = new Set(this.attributes.TreatmentZone?.map(tzn => tzn.attributes.TreatmentZoneCode))
        for (let i = 0; i < 255; i++) {
            if (!tznCodes.has(i)) {
                return i
            }
        }
    }

    /** Adds Grid and corresponding TreatmentZones to the Task.
     * 
     * Implementation notes:
     * - this function doesn't remove any existing TreatmentZones from the task, it just adds new TZNs.
     * - TZN codes are generated automatically.
     * - if OutOfFieldTreatmentZone in the task is not defined,
     *   it will be created using outOfFieldValues (which are all 0 by default)
     * - if defaultTreatmentValues or positionLostValues are defined, corresponding TZNs will be created and used
     */
    addGridFromGeoJSON(
        geoJSON: FeatureCollection,
        processDataVariables: ProcessDataVariable[],
        geoJSONPropertyNames: string[], // one attribute name for each processDataVariable
        defaultTreatmentValues?: number[], // one value for each processDataVariable
        positionLostValues?: number[], // one value for each processDataVariable
        outOfFieldValues?: number[], // one value for each processDataVariable
    ): void {
        const createPDVs = (values: number[]) =>
            values.map((value, idx) => this.isoxmlManager.createEntityFromAttributes<ProcessDataVariable>(
                TAGS.ProcessDataVariable, {
                    ...processDataVariables[idx].attributes,
                    ProcessDataValue: value,
                }
            ))

        const arrayOfZeros = Array(processDataVariables.length).fill(0)
        this.attributes.TreatmentZone = this.attributes.TreatmentZone ?? []

        if (this.attributes.OutOfFieldTreatmentZoneCode === undefined || outOfFieldValues !== undefined) {
            this.attributes.OutOfFieldTreatmentZoneCode = this.findFreeTZNCode()
            this.attributes.TreatmentZone.push(
                this.isoxmlManager.createEntityFromAttributes(TAGS.TreatmentZone, {
                    TreatmentZoneCode: this.attributes.OutOfFieldTreatmentZoneCode,
                    ProcessDataVariable: createPDVs(outOfFieldValues ?? arrayOfZeros)
                })
            )
        }

        const gridTZNCode = this.findFreeTZNCode()
        this.attributes.TreatmentZone.push(
            this.isoxmlManager.createEntityFromAttributes(TAGS.TreatmentZone, {
                TreatmentZoneCode: gridTZNCode,
                ProcessDataVariable: createPDVs(arrayOfZeros)
            }) as TreatmentZone
        )

        this.attributes.Grid = [
            ExtendedGrid.fromGeoJSON(geoJSON, geoJSONPropertyNames, this.isoxmlManager, gridTZNCode)
        ]

        if (defaultTreatmentValues !== undefined) {
            this.attributes.DefaultTreatmentZoneCode = this.findFreeTZNCode()
            this.attributes.TreatmentZone.push(
                this.isoxmlManager.createEntityFromAttributes(TAGS.TreatmentZone, {
                    TreatmentZoneCode: this.attributes.DefaultTreatmentZoneCode,
                    ProcessDataVariable: createPDVs(defaultTreatmentValues)
                }) as TreatmentZone,
            )
        }

        if (positionLostValues !== undefined) {
            this.attributes.PositionLostTreatmentZoneCode = this.findFreeTZNCode()
            this.attributes.TreatmentZone.push(
                this.isoxmlManager.createEntityFromAttributes(TAGS.TreatmentZone, {
                    TreatmentZoneCode: this.attributes.PositionLostTreatmentZoneCode,
                    ProcessDataVariable: createPDVs(positionLostValues)
                }) as TreatmentZone,
            )
        }
    }

    getGridAsGeoJSON(propertyNames: string[]): FeatureCollection {
        if (!this.attributes.Grid) {
            return null
        }
        return (this.attributes.Grid[0] as ExtendedGrid).toGeoJSON(propertyNames)
    }

    getGridValuesDescription(): ValueInformation[] {
        const grid = this.attributes.Grid?.[0]
        if (!grid) {
            return []
        }

        const treatmentZoneCodes = (grid as ExtendedGrid).getAllReferencedTZNCodes()

        if (treatmentZoneCodes.length === 0) {
            return []
        }

        // we assume that all the referenced TreatmentZones have the same set of ProcessDataVariables
        const treatmentZone = (this.attributes.TreatmentZone || [])
            .find(tz => tz.attributes.TreatmentZoneCode === treatmentZoneCodes[0])

        if (!treatmentZone) {
            return []
        }

        return (treatmentZone.attributes.ProcessDataVariable || []).map(pdv => {
            const vpn = pdv.attributes.ValuePresentationIdRef?.entity as ValuePresentation
            const det = pdv.attributes.DeviceElementIdRef?.entity as ExtendedDeviceElement
            const pdp = det?.getDataProcess(pdv.attributes.ProcessDataDDI)
            return constructValueInformation(pdv.attributes.ProcessDataDDI, vpn, pdp)
        })
    }
}

registerEntityClass('main', TAGS.Task, ExtendedTask)

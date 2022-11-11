import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'

import { Entity, ValueInformation, ISOXMLReference, XMLElement } from '../types'

import { ProcessDataVariable, Task, TaskAttributes, TreatmentZone, ValuePresentation } from '../baseEntities'
import { ExtendedGrid } from './Grid'
import { FeatureCollection } from '@turf/helpers'
import { TAGS } from '../baseEntities/constants'
import { constructValueInformation, DDIToString } from '../utils'

export class ExtendedTask extends Task {
    public tag = TAGS.Task

    constructor(attributes: TaskAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
        return Task.fromXML(xml, isoxmlManager, internalId, ExtendedTask)
    }

    addGridFromGeoJSON(
        geoJSON: FeatureCollection,
        DDI: number,
        deviceElemRef?: ISOXMLReference,
        vpnRef?: ISOXMLReference
    ): void {
        const processDataVariable = this.isoxmlManager.createEntityFromAttributes<ProcessDataVariable>(
            TAGS.ProcessDataVariable, {
                ProcessDataDDI: DDIToString(DDI),
                ProcessDataValue: 0,
                ...deviceElemRef && { DeviceElementIdRef: deviceElemRef },
                ...vpnRef && { ValuePresentationIdRef: vpnRef }
            })
        this.attributes.TreatmentZone = [
            this.isoxmlManager.createEntityFromAttributes(TAGS.TreatmentZone, {
                TreatmentZoneCode: 0,
                ProcessDataVariable: [processDataVariable]
            }) as TreatmentZone,
            this.isoxmlManager.createEntityFromAttributes(TAGS.TreatmentZone, {
                TreatmentZoneCode: 1,
                ProcessDataVariable: [processDataVariable]
            }) as TreatmentZone
        ]

        this.attributes.OutOfFieldTreatmentZoneCode = 0
        this.attributes.Grid = [
            ExtendedGrid.fromGeoJSON(geoJSON, this.isoxmlManager, 1)
        ]
    }

    getGridAsGeoJSON(): FeatureCollection {
        if (!this.attributes.Grid) {
            return null
        }
        return (this.attributes.Grid[0] as ExtendedGrid).toGeoJSON()
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
            return constructValueInformation(pdv.attributes.ProcessDataDDI, vpn)
        })
    }
}

registerEntityClass('main', TAGS.Task, ExtendedTask)

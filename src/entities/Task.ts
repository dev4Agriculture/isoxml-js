import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'

import { Entity, GridValueDescription, ISOXMLReference } from '../types'

import { Task, TaskAttributes, TreatmentZone, ValuePresentation } from '../baseEntities'
import { ExtendedGrid } from './Grid'
import { FeatureCollection } from '@turf/helpers'
import { TAGS } from '../baseEntities/constants'
import { DDIToString } from '../utils'
import DDEntities from '../DDEntities'

export class ExtendedTask extends Task {
    public tag = TAGS.Task

    constructor(attributes: TaskAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
        return Task.fromXML(xml, isoxmlManager, internalId, ExtendedTask)
    }

    addGridFromGeoJSON(geoJSON: FeatureCollection, DDI: number, deviceElemRef?: ISOXMLReference, vpnRef?: ISOXMLReference): void {
        const processDataVariable = this.isoxmlManager.createEntityFromAttributes(
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

    getGridValuesDescription(): GridValueDescription[] {
        const grid = this.attributes.Grid?.[0]
        if (!grid) {
            return []
        }

        const treatmentZoneCode = grid.attributes.TreatmentZoneCode
        const treatmentZone = (this.attributes.TreatmentZone || [])
            .find(tz => tz.attributes.TreatmentZoneCode === treatmentZoneCode)

        if (!treatmentZone) {
            return []
        }

        return (treatmentZone.attributes.ProcessDataVariable || []).map(pdv => {
            const ddIndex = parseInt(pdv.attributes.ProcessDataDDI, 16)
            const ddEntity = DDEntities[ddIndex]

            const vpn = pdv.attributes.ValuePresentationIdRef?.entity as ValuePresentation

            const unit = vpn ? (vpn.attributes.UnitDesignator || '') : ddEntity.unit
            const scale = vpn ? vpn.attributes.Scale : ddEntity.bitResolution
            const offset = vpn ? vpn.attributes.Offset : 0
            return {
                DDI: ddIndex,
                name: ddEntity.name,
                unit,
                scale,
                offset
            }
        })
    }
}

registerEntityClass(TAGS.Task, ExtendedTask)

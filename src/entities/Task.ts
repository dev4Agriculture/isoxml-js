import { ElementCompact } from 'xml-js'

import { ISOXMLManager } from '../ISOXMLManager'
import { registerEntityClass } from '../classRegistry'

import { Entity, ISOXMLReference } from '../types'

import { Task, TaskAttributes, TreatmentZone } from '../baseEntities'
import { ExtendedGrid } from './Grid'
import { FeatureCollection } from '@turf/helpers'
import { TAGS } from '../baseEntities/constants'
import { DDIToString } from '../utils'

export class ExtendedTask extends Task {
    public tag = TAGS.Task

    constructor(attributes: TaskAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static fromXML(xml: ElementCompact, isoxmlManager: ISOXMLManager): Promise<Entity> {
        return Task.fromXML(xml, isoxmlManager, ExtendedTask)
    }

    toXML(): ElementCompact {
        return super.toXML()
    }

    addGridFromGeoJSON(geoJSON: FeatureCollection, DDI: number, deviceElemRef?: ISOXMLReference) {
        const processDataVariable = this.isoxmlManager.createEntityFromAttributes(
            TAGS.ProcessDataVariable, {
                ProcessDataDDI: DDIToString(DDI),
                ProcessDataValue: 0,
                ...deviceElemRef && { DeviceElementIdRef: deviceElemRef }
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
}

registerEntityClass(TAGS.Task, ExtendedTask)

/* This example suppose that the isoxml is built locally (run "npm run build" first) */

import { writeFileSync } from 'fs'
import {
    ISOXMLManager,
    TAGS,
    TaskTaskStatusEnum,
    ExtendedTask,
    ExtendedPolygon,
    Partfield,
    PolygonPolygonTypeEnum
} from '../dist'

const isoxmlManager = new ISOXMLManager()

const geoJSON = {
    type: "Polygon" as const,
    coordinates: [
        // outer ring
        [
            [52.1,7.1],
            [52.1,7.2],
            [52.2,7.2],
            [52.2,7.1],
            [52.1,7.1]
        ],
        // inner ring (hole)
        [
            [52.13,7.12],
            [52.13,7.18],
            [52.18,7.18],
            [52.18,7.12],
            [52.13,7.12]
        ]
    ]
}

// create ISOXML polygons from GeoJSON
const polygons = ExtendedPolygon.fromGeoJSON(
    geoJSON,
    PolygonPolygonTypeEnum.PartfieldBoundary,
    isoxmlManager
)

// create a Partfield
const partfield = isoxmlManager.createEntityFromAttributes(TAGS.Partfield, {
    PartfieldDesignator : "Test",
    PolygonnonTreatmentZoneonly: polygons
  }) as Partfield

// assign a local ID to the partfield ("PFD1" in our case)
const partFieldRef = isoxmlManager.registerEntity(partfield)

// add the partfield to the root element
isoxmlManager.rootElement.attributes.Partfield = [partfield]

// create an instance of Task entity
const task = isoxmlManager.createEntityFromAttributes(TAGS.Task, {
    TaskStatus: TaskTaskStatusEnum.Planned,
    PartfieldIdRef: partFieldRef
}) as ExtendedTask

// assign a local ID to the task ("TSK1" in our case)
isoxmlManager.registerEntity(task)
// add the task to the root element
isoxmlManager.rootElement.attributes.Task = [task]

// save ISOXML as a zip file
isoxmlManager.saveISOXML().then((data: Uint8Array) => {
    writeFileSync('./isoxml_with_partfield.zip', data)
})
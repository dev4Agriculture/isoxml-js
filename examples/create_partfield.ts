/* This example suppose that the isoxml is built locally (run "npm run build" first) */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { ISOXMLManager, TAGS, TaskTaskStatusEnum, ExtendedTask } from '../dist'
import {Polygon, PolygonPolygonTypeEnum} from '../dist'
import { Partfield,LineString, LineStringLineStringTypeEnum} from '../dist'
import { PointPointTypeEnum, Point } from '../dist'
const isoxmlManager = new ISOXMLManager()


//Create the Outer Boundary from an array of points
const outerBoundary = [
    [52.1,7.1],
    [52.1,7.2],
    [52.2,7.2],
    [52.2,7.1],
    [52.1,7.1]
]

const outerPoints = [] as Point[]
outerBoundary.forEach(entry =>
    {
        outerPoints.push(isoxmlManager.createEntityFromAttributes(TAGS.Point, {
            PointNorth: entry[0],
            PointEast: entry[1],
            PointType: PointPointTypeEnum.Other
        }) as Point)
    }
)

//Add an inner Boundary (a hole) to the Partfield
const outerLineString = isoxmlManager.createEntityFromAttributes(TAGS.LineString, {
    Point : outerPoints,
    LineStringType : LineStringLineStringTypeEnum.PolygonExterior,
}) as LineString

const innerBoundary = [
    [52.13,7.12],
    [52.13,7.18],
    [52.18,7.18],
    [52.18,7.12],
    [52.13,7.12]

]

const innerPoints = [] as Point[]
innerBoundary.forEach(entry =>
    {
        innerPoints.push(isoxmlManager.createEntityFromAttributes(TAGS.Point, {
            PointNorth: entry[0],
            PointEast: entry[1],
            PointType: PointPointTypeEnum.Other
        }) as Point)
    }
)

const innerLineString = isoxmlManager.createEntityFromAttributes(TAGS.LineString, {
    Point : innerPoints,
    LineStringType : LineStringLineStringTypeEnum.PolygonInterior,
}) as LineString


//Add the Polygon to the Partfield
const polygon = isoxmlManager.createEntityFromAttributes(TAGS.Polygon, {
    PolygonType: PolygonPolygonTypeEnum.PartfieldBoundary, 
    LineString : [outerLineString,innerLineString]
}) as Polygon


const partfield = isoxmlManager.createEntityFromAttributes(TAGS.Partfield, {
    PartfieldDesignator : "Test",
    PolygonnonTreatmentZoneonly: [polygon]
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
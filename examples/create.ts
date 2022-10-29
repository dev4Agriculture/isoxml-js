/* This example suppose that the isoxml is built locally (run "npm run build" first) */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { ISOXMLManager, TAGS, TaskTaskStatusEnum, ExtendedTask } from '../dist'

const isoxmlManager = new ISOXMLManager()

// create an instance of Task entity
const task = isoxmlManager.createEntityFromAttributes(TAGS.Task, {
    TaskStatus: TaskTaskStatusEnum.Planned
}) as ExtendedTask

const geoJSONdata = JSON.parse(readFileSync(join(__dirname, '../data/test.geojson'), 'utf-8'))

// add Grid to the task from GeoJSON. "1" is DDI
task.addGridFromGeoJSON(geoJSONdata, 1)

// assign a local ID to the task ("TSK1" in our case)
isoxmlManager.registerEntity(task)

// add the task to the root element
isoxmlManager.rootElement.attributes.Task = [task]

// save ISOXML as a zip file
isoxmlManager.saveISOXML().then((data: Uint8Array) => {
    writeFileSync('./isoxml.zip', data)
})
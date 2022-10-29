/* This example suppose that the isoxml is built locally (run "npm run build" first) */

import { readFileSync } from 'fs'
import { join } from 'path'
import { ISOXMLManager, Partfield } from '../dist'

// read a zipped ISOXML
const isoxmlData = readFileSync(join(__dirname, '../data/task_with_warnings.zip'))

// create new ISOXMLManager instance with default parameters
const isoxmlManager = new ISOXMLManager()

// parse the file
isoxmlManager.parseISOXMLFile(new Uint8Array(isoxmlData.buffer), 'application/zip').then(() => {

    // getWarnings() method returns all the warnings from the last parsing
    console.log(isoxmlManager.getWarnings())

    // all global attributes of the parsed file
    console.log(isoxmlManager.options)

    // get all the Partfileds
    const partfields: Partfield[] = isoxmlManager.rootElement.attributes.Partfield || []

    // print designators of all the Partfields
    partfields.forEach(partfield => {
        console.log(`${partfield.attributes.PartfieldDesignator}`)
    })
})
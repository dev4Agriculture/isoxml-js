## Introduction

ISOXML.js is a JavaScript library to parse and generate ISOXML (ISO11783-10) files.

The main features:
  * Supports all entities from the ISOXML v4.3 (ISO11783-10:2015) including proprietart attributes and elements
  * Works in both browsers and NodeJS
  * Can handle ISOXML of both versions 4 and 3 (including transformation between versions)
  * ISOXML Grids can be generated from GeoJSON polygons
  * Uses LINKLIST file to keep FMIS identificators (only in v4)
  * Field and TreatmentZones geometry can be provided as GeoJSON
  * Includes TypeScript types
  * ISOXML files validation (WiP)

## Installation
Just run
```
npm install isoxml
```
or 
```
yarn add isoxml
```

## Usage Examples

Parse ISOXML (Node.js environments):
```
import { readFileSync } from 'fs'
import { join } from 'path'
import { ISOXMLManager, Partfield } from 'isoxml'

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
```

Create manually and save ISOXML (Node.js environment):
```
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { ISOXMLManager, TAGS, TaskTaskStatusEnum, ExtendedTask } from 'isoxml'

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
```

You can find these examples in the `examples` folder. Note, that you must build the library before running them locally. For example:
```
npm run build
ts-node examples/parse.ts
```

## Classes Overview

### ISOMXLManager

ISOMXLManager is the main class. It handles all the operations with ISOXML files.

#### Constructor
```
new ISOXMLManager(options)
```

Options are:
```
rootFolder?: string   // the folder with TASKDATA.XML file. Default: "TASKDATA"
fmisTitle?: string    // FMIS title. Default: "FMIS"
fmisURI?: string      // FMIS URL. Used in LINKLIST.XML file to store matching with FMIS IDs
fmisVersion?: string  // FMIS version. Default: "1.0"
version?: number      // Version of ISOXML file. Only values "3" and "4" are supported. Default: "4"
```

If you want to save matchings between FMIS IDs and ISOXML IDs, you must set `fmisURI` option before parsing any ISOXML files. All the rest parameters will be overwritten during ISOXML parsing.

#### Parse ISOXML file

```
parseISOXMLFile(data: Uint8Array|string, dataType: string): Promise<void> 
```

This method parses the ISOXML file and saves all the parsed information in the ISOXMLManager
"dataType" can be either "text/xml" (standalone TASKDATA.XML file) or "application/zip" (zipped folder). Notes:
  * ISOXMLManager's options will be updated
  * All the entities added the ISOXMLManager before calling this method will be removed
  * You can check parsing errors and warnings using "getWarnings(): string[]" method

#### Save ISOXML file
```
saveISOXML(): Promise<Uint8Array>
```
All the entities will be saved as a ZIP archive.

#### Modify ISOXML Entities Manually

There are two types of Entities in the ISO11783-10 standard: the entities with ID and entities without ID. IDs must be unique inside the ISOXML file. IDs are not part of Entity instances. Instead, they are stored separately in ISOXMLManager and accessable as `xmlReferences` public property.

You can create new Entity using the following method
```
createEntityFromAttributes(tagName: TAGS, attrs: EntityAttributes): Entity
```

Note, that you can't provide ID in this method. To assign an ID, you need to "register" the entity using the following method:
```
registerEntity(entity?: Entity, xmlId?: string, fmisId?: string): ISOXMLReference
```
If you provide only `entity`, ISOXMLManager will generate a unique ID for it and internally saves it. Instead, you can explicitly set `xmlId`. Also, you always can add `fmisId` for an entity - it will be saved in "LINKLIST.XML" file for future utilization by FMIS.

To add en entity to the ISOXML file, use the `rootElement: ExtendedISO11783TaskDataFile` public property of the ISOXMLManager. For example:
```
isoxmlManager.rootElement.attributes.Task = [task]
```
You can modify entities in the same way.

## Internal Structure

The base classes and types are generated from XSD files. The generation script is stored in the `/generation` folder. To run the generation, call the command `npm run gen`. The output of generation is class defenitions and types stored in the `/src/baseEntities` folder (note that the folder will be reset during generation). The generated files are part of the project.

The original XSDs are taken from https://www.isobus.net/isobus/file/supportingDocuments

## All NPM Commands

  * `npm run gen` - generate base classes and put them in `/src/baseEntities` folder
  * `npm run build` - generate JS files in `/dist` folder
  * `npm run test` - run tests (based on Jest)
  * `npm run coverage` - show test coverage report

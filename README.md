### Introduction

This is a JavaScript library to parse and generate ISOXML (ISO11783-10) files. The main class in `ISOXMLManager`.

### Internal structure

The base classes and types are generated from XSD files. The generation script is stored in the `/generation` folder. To run the generation, call the command `npm run gen`. The output of generation is class defenitions and types stored in the `/src/baseEntities` folder (note that the folder will be reset during generation). The generated files are part of the project.

The original XSDs are taken from https://www.isobus.net/isobus/file/supportingDocuments

### NPM commands

  * `npm run gen` - generate base classes and put them in `/src/baseEntities` folder
  * `npm run build` - generate JS files in `/dist` folder
  * `npm run test` - run tests (based on Jest)
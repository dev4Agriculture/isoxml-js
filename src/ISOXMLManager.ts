import { js2xml, xml2js, ElementCompact } from "xml-js";
import JSZip, { file } from 'jszip'
import { Entity, ISOFileInformation, ISOXMLReference } from "./types";
import { getEntityClassByTag } from './classRegistry'

import './baseEntities'
import './entities'

import { ExtendedISO11783TaskDataFile } from "./entities/ISO11783TaskDataFile";

type ISOXMLManagerOptions = {
    fmisURI?: string
}

const MAIN_FILENAME = 'TASKDATA.XML';
const LINKLIST_FILENAME = 'LINKLIST.XML';
const ROOT_FOLDER = 'TASKDATA';

export class ISOXMLManager {
    private xmlReferences: {[xmlId: string]: ISOXMLReference} = {}
    private nextIds: {[xmlId: string]: number} = {}
    public rootElement: ExtendedISO11783TaskDataFile
    public parsedFiles: ISOFileInformation[]
    public filesToSave: {[filename: string]: {binaryData?: Uint8Array, textData?: string}}


    constructor(private options: ISOXMLManagerOptions = {}) {}

    public addFileToSave(data: Uint8Array, isBinary: true, xmlTag: string, filename?: string): string
    public addFileToSave(data: string, isBinary: false, xmlTag: string, filename?: string): string
    public addFileToSave(data: Uint8Array | string, isBinary: boolean, xmlTag: string, filename?: string): string {
        if (!filename) {
            const indexes = Object.keys(this.filesToSave)
                .filter(filename => filename.startsWith(xmlTag))
                .map(filename => parseInt(filename.match(/^\w{3}(.*)$/)[1], 10))
            const nextIndex = Math.max.apply(null, indexes) + 1
            filename = xmlTag + ('0000' + nextIndex).substr(-5) + (isBinary ? 'BIN' : 'XML')
        }

        this.filesToSave[filename] = this.filesToSave[filename] || {}

        if (isBinary) {
            this.filesToSave[filename].binaryData = data as Uint8Array
        } else {
            this.filesToSave[filename].textData = data as string
        }

        return filename
    }

    public registerXMLReference(xmlId: string): ISOXMLReference {
        this.xmlReferences[xmlId] = this.xmlReferences[xmlId] || {xmlId}
        return this.xmlReferences[xmlId]
    }

    public registerEntity(entity: Entity): ISOXMLReference {
        this.nextIds[entity.tag] = (this.nextIds[entity.tag] || 0) + 1
        const xmlId = `${entity.tag}${this.nextIds[entity.tag]}`
        const ref = this.registerXMLReference(xmlId)
        ref.reference = entity
        return ref
    }

    public createEntity(tagName: string, xml: ElementCompact): Entity {
        const entityClass = getEntityClassByTag(tagName)
        if (!entityClass) {
            return null
        }

        return entityClass.fromXML(xml, this)
    }

    public async parseISOXMLFile(data: string, dataType: 'text/xml' | 'application/xml', fmisURI: string): Promise<void>
    public async parseISOXMLFile(data: Uint8Array, dataType: 'application/zip', fmisURI: string): Promise<void>
    public async parseISOXMLFile(data: Uint8Array|string, dataType: string, fmisURI: string): Promise<void> {
        if (dataType === 'application/xml' || dataType === 'text/xml') {
            const mainXML = xml2js(data as string, { compact: true, alwaysArray: true })
            getEntityClassByTag('ISO11783_TaskData').fromXML(mainXML, this)
        } else if (dataType === 'application/zip') {
            const zip = await JSZip.loadAsync(data)
            const mainFile = zip.file(new RegExp(MAIN_FILENAME + '$', 'i'))[0]
            const matchFile = zip.file(new RegExp(LINKLIST_FILENAME + '$', 'i'))[0]
            if (!mainFile) {
                throw new Error("Zip file doesn't contain TASKDATA.XML")
            }

            const mainXmlPromise = mainFile.async('string').then(xml => {
                return xml2js(xml, { compact: true, alwaysArray: true });
            });

            const matchXmlPromise = matchFile
                ? matchFile.async('string').then(xml => {
                    return {}
                })
                : Promise.resolve({});

            const isBin = path => !!path.match(/\.bin$/i)
            const isXml = path => !!path.match(/\.xml$/i)

            const filePromises = zip
                .filter((path, file) => file !== mainFile && file !== matchFile && (isBin(path) || isXml(path)))
                .map(async file => {
                    const isBinary = isBin(file.name)
                    const fileData = await file.async(isBinary ? 'uint8array' : 'string')
                    return { isBinary, data: fileData, filename: file.name.split('/').pop() }
                });

            const [mainXml, matchIDs, ...files] = await Promise.all([mainXmlPromise, matchXmlPromise, ...filePromises]);
            this.parsedFiles = files as ISOFileInformation[]
            // const externalReferences = mainXml['ISO11783_TaskData'][0][TAGS.ExternalFileReference] || []

            if (!mainXml['ISO11783_TaskData']) {
                throw new Error('Incorrect structure of TASKDATA.XML')
            }

            this.rootElement = getEntityClassByTag('ISO11783_TaskData').fromXML(mainXml['ISO11783_TaskData'][0], this) as ExtendedISO11783TaskDataFile
            const externalFiles = this.rootElement.attributes.ExternalFileReference || []

            externalFiles.forEach(externalFile => {
                const filename = externalFile.attributes.Filename
                const file = files.find(file => (file as any).filename.match(new RegExp(`${filename}\\.XML$`, 'i')))
                const xml = xml2js((file as any).data, { compact: true, alwaysArray: true })
                const fileContent = getEntityClassByTag('XFC').fromXML(xml['XFC'][0], this)
                this.rootElement.appendFromExternalFile(fileContent)
            })
        } else {
            throw new Error('This data type is not supported')
        }
    }

    public async saveISOXML(): Promise<Uint8Array> {
        this.filesToSave = {}
        const json = {
            _declaration: {
                _attributes: {
                version: '1.0',
                encoding: 'utf-8'
                }
            },
            ISO11783_TaskData: this.rootElement.toXML(this)
        }

        const mainXML = js2xml(json, { compact: true, spaces: 2 });

        const zipWriter = new JSZip()
        zipWriter.file(`${ROOT_FOLDER}/${MAIN_FILENAME}`, mainXML)

        Object.keys(this.filesToSave).forEach(filename => {
            const fileInfo = this.filesToSave[filename]
            if (fileInfo.binaryData) {
                zipWriter.file(`${ROOT_FOLDER}/${filename}.BIN`, fileInfo.binaryData, {binary: true})
            }
            if (fileInfo.textData) {
                zipWriter.file(`${ROOT_FOLDER}/${filename}.BIN`, fileInfo.textData, {binary: false})
            }
        })

        return zipWriter.generateAsync({type: 'uint8array'})
    }
}
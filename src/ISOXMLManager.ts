import { js2xml, xml2js, ElementCompact } from "xml-js"
import JSZip from 'jszip'
import { Entity, EntityAttributes, ISOXMLReference } from "./types"
import { getEntityClassByTag } from './classRegistry'

import './baseEntities'
import './entities'

import { ExtendedISO11783TaskDataFile } from "./entities/ISO11783TaskDataFile"
import { TAGS } from "./baseEntities/constants"
import { GridGenerator, GridParametersGenerator } from "./entities"

export type ISOXMLManagerOptions = {
    rootFolder?: string
    fmisTitle?: string
    fmisURI?: string
    fmisVersion?: string
    version?: number
    gridRaramsGenerator?: GridParametersGenerator,
    gridGenerator?: GridGenerator
}

const MAIN_FILENAME = 'TASKDATA.XML'
const ROOT_FOLDER = 'TASKDATA'

export class ISOXMLManager {
    private nextIds: {[xmlId: string]: number} = {}
    private originalZip: JSZip
    private parsingWarnings: string[] = []

    public xmlReferences: {[xmlId: string]: ISOXMLReference} = {}
    public rootElement: ExtendedISO11783TaskDataFile
    public filesToSave: { [filenameWithExtension: string]: (Uint8Array | string) } = {}

    public options: ISOXMLManagerOptions

    constructor(options: ISOXMLManagerOptions = {}) {
        this.options = {
            version: 4,
            fmisTitle: 'FMIS',
            fmisVersion: '1.0',
            rootFolder: ROOT_FOLDER
        }

        this.updateOptions(options)

        this.rootElement = ExtendedISO11783TaskDataFile.fromISOXMLManagerOptions(this)
    }

    private parseXmlId(xmlId: string) {
        const match = xmlId.match(/([A-Z]{3})(-?\d+)/)
        if (!match) {
            return null
        }

        return {
            tag: match[1],
            id: parseInt(match[2], 10)
        }
    }

    public generateUniqueFilename(xmlTag: TAGS): string {
        const indexes = Object.keys(this.filesToSave)
            .map(filename => filename.match(new RegExp(`^${xmlTag}(\\d{5})\\.\\w{3}$/`)))
            .filter(e => e)
            .map(matchResults => parseInt(matchResults[1]))
        const nextIndex = indexes.length ? Math.max.apply(null, indexes) + 1 : 1
        return xmlTag + ('0000' + nextIndex).substr(-5)
    }

    public addFileToSave(data: Uint8Array | string, filenameWithExtension: string): void {
        this.filesToSave[filenameWithExtension] = data
    }

    /**
     * if "xmlId" is provided:
     *   - if such reference exists, update its content with "entity" and "fmis"
     *   - otherwise, generate new reference
     * if "xmlId" is not provided, do the following:
     *   - try to find the "entity" (the same JS object) in references
     *   - try to find the entity with the same type and "fmisId" if references
     *   - if both above failed, create new reference
     */
    public registerEntity(entity?: Entity, xmlId?: string, fmisId?: string): ISOXMLReference {
        if (!entity && !xmlId) {
            return
        }

        if (!xmlId) {
            const tag = entity.tag
            const existingReference = Object.values(this.xmlReferences)
                .filter(ref => ref.xmlId.startsWith(tag))
                .find(ref =>  ref.entity === entity || (fmisId && fmisId === ref.fmisId))

            if (existingReference) {
                xmlId = existingReference.xmlId
            } else {
                this.nextIds[entity.tag] = this.nextIds[entity.tag] || 1
                xmlId = `${entity.tag}${this.nextIds[entity.tag]++}`
            }
        } else {
            const {tag, id} = this.parseXmlId(xmlId)
            this.nextIds[tag] = Math.max(this.nextIds[tag] || 1, id + 1)
        }

        this.xmlReferences[xmlId] = this.xmlReferences[xmlId] || {xmlId}
        const ref = this.xmlReferences[xmlId]

        if (entity) {
            ref.entity = entity
        }

        if (fmisId) {
            ref.fmisId = fmisId
        }

        return ref
    }

    public createEntityFromXML(tagName: TAGS, xml: ElementCompact, internalId?: string): Promise<Entity> {
        const entityClass = getEntityClassByTag(tagName)
        if (!entityClass) {
            return null
        }

        return entityClass.fromXML(xml, this, internalId)
    }

    public createEntityFromAttributes(tagName: TAGS, attrs: EntityAttributes): Entity {
        const entityClass = getEntityClassByTag(tagName)
        if (!entityClass) {
            return null
        }

        return new entityClass(attrs, this)
    }

    public async parseISOXMLFile(data: string, dataType: 'text/xml' | 'application/xml'): Promise<void>
    public async parseISOXMLFile(data: Uint8Array, dataType: 'application/zip'): Promise<void>
    public async parseISOXMLFile(data: Uint8Array|string, dataType: string): Promise<void> {
        if (dataType === 'application/xml' || dataType === 'text/xml') {
            const mainXML = xml2js(data as string, { compact: true, alwaysArray: true })
            getEntityClassByTag(TAGS.ISO11783TaskDataFile).fromXML(mainXML, this, '')
        } else if (dataType === 'application/zip') {
            this.originalZip = await JSZip.loadAsync(data)
            const mainFile = this.originalZip.file(new RegExp(MAIN_FILENAME + '$', 'i'))[0]
            if (!mainFile) {
                throw new Error("Zip file doesn't contain TASKDATA.XML")
            }

            const mainXmlString = await mainFile.async('string')
            const mainXml = xml2js(mainXmlString, { compact: true, alwaysArray: true })

            this.options.rootFolder = mainFile.name.match(/(.*[/\\])/)?.[1] ?? ''

            if (!mainXml['ISO11783_TaskData']) {
                throw new Error('Incorrect structure of TASKDATA.XML')
            }

            this.rootElement = await getEntityClassByTag(TAGS.ISO11783TaskDataFile)
                .fromXML(mainXml[TAGS.ISO11783TaskDataFile][0], this, '') as ExtendedISO11783TaskDataFile
        } else {
            throw new Error('This data type is not supported')
        }
    }

    public async saveISOXML(): Promise<Uint8Array> {
        this.filesToSave = {}

        if (this.options.fmisURI) {
            this.rootElement.addLinkListFile()
        }

        const json = {
            _declaration: {
                _attributes: {
                version: '1.0',
                encoding: 'utf-8'
                }
            },
            ISO11783_TaskData: this.rootElement.toXML()
        }

        const mainXML = js2xml(json, { compact: true, spaces: 2 })

        const zipWriter = new JSZip()
        zipWriter.file(`${this.options.rootFolder}${MAIN_FILENAME}`, mainXML)

        Object.keys(this.filesToSave).forEach(filename => {
            const data = this.filesToSave[filename]
            zipWriter.file(`${this.options.rootFolder}${filename}`, data, {binary: typeof data !== 'string'})
        })

        return zipWriter.generateAsync({type: 'uint8array'})
    }

    public getReferenceByEntity(entity: Entity): ISOXMLReference {
        return Object.values(this.xmlReferences).find(ref => ref.entity === entity)
    }
    public getReferenceByXmlId(xmlId: string): ISOXMLReference {
        return this.xmlReferences[xmlId]
    }

    public getEntityByXmlId<T extends Entity>(xmlId: string): T {
        if (!this.xmlReferences[xmlId]?.entity) {
            return null
        }
        return this.xmlReferences[xmlId].entity as T
    }

    public getEntitiesOfTag<T extends Entity>(tag: TAGS): T[] {
        return Object.values(this.xmlReferences)
            .filter(ref => this.parseXmlId(ref.xmlId).tag === tag && ref.entity)
            .map(ref => ref.entity as T)
    }

    public updateOptions(newOptions: ISOXMLManagerOptions): void {
        this.options = {
            ...this.options,
            ...newOptions
        }

        // normalize root folder
        if (this.options.rootFolder && !this.options.rootFolder.endsWith('/')) {
            this.options.rootFolder += '/'
        }
    }

    public getParsedFile(filenameWithExtension: string, isBinary: true): Promise<Uint8Array> 
    public getParsedFile(filenameWithExtension: string, isBinary: false): Promise<string> 
    public getParsedFile(filenameWithExtension: string, isBinary: boolean): Promise<Uint8Array | string> {
        if (!this.originalZip) {
            return null
        }

        const file = this.originalZip.file(`${this.options.rootFolder}${filenameWithExtension}`)

        if (!file) {
            return null
        }

        return file.async(isBinary ? 'uint8array' : 'string')
    }

    public addWarning(warning: string): void {
        this.parsingWarnings.push(warning)
    }

    public getWarnings(): string[] {
        return this.parsingWarnings
    }
}
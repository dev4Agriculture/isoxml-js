import JSZip, { JSZipObject } from 'jszip'
import { Entity, EntityAttributes, ISOXMLReference, XMLElement } from './types'
import { getEntityClassByTag } from './classRegistry'

import './baseEntities'
import './entities'

import { ExtendedISO11783TaskDataFile } from "./entities/ISO11783TaskDataFile"
import { TAGS } from "./baseEntities/constants"
import { GridGenerator, GridParametersGenerator } from "./entities"
import { js2xml, xml2js } from './xmlManager'

export type ISOXMLManagerOptions = {
    rootFolder?: string
    fmisTitle?: string
    fmisURI?: string
    fmisVersion?: string
    version?: number
    gridParamsGenerator?: GridParametersGenerator,
    gridGenerator?: GridGenerator,
    realm?: string
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
            rootFolder: ROOT_FOLDER,
            realm: 'main'
        }

        this.updateOptions(options)

        this.rootElement = ExtendedISO11783TaskDataFile.fromISOXMLManagerOptions(this)
    }

    static parseXmlId(xmlId: string) {
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
            .map(filename => filename.match(new RegExp(`^${xmlTag}(\\d{5})\\.\\w{3}$`)))
            .filter(e => e)
            .map(matchResults => parseInt(matchResults[1], 10))
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
     *   - try to find the entity with the same type and "fmisId" if provided
     *   - if both above failed, create new reference
     * Returns undefined if failed to create reference
     */
    public registerEntity(entity?: Entity, xmlId?: string, fmisId?: string): ISOXMLReference {
        if (!entity && !xmlId) {
            return
        }

        if (!xmlId) {
            const tag = entity.tag
            const existingReference = Object.values(this.xmlReferences)
                .filter(ref => ref.xmlId.startsWith(tag))
                .find(ref => ref.entity === entity || (fmisId && fmisId === ref.fmisId))

            if (existingReference) {
                xmlId = existingReference.xmlId
            } else {
                this.nextIds[entity.tag] = this.nextIds[entity.tag] || 1
                xmlId = `${entity.tag}${this.nextIds[entity.tag]++}`
            }
        } else {
            const parsedXmlId = ISOXMLManager.parseXmlId(xmlId)
            if (!parsedXmlId) {
                return
            }

            // check consistency between xmlId and entity
            if (entity && entity.tag !== parsedXmlId.tag) {
                return
            }

            this.nextIds[parsedXmlId.tag] = Math.max(this.nextIds[parsedXmlId.tag] || 1, parsedXmlId.id + 1)
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

    public createEntityFromXML(tagName: TAGS, xml: XMLElement, internalId?: string): Promise<Entity> {
        const entityClass = getEntityClassByTag(this.options.realm, tagName)
        if (!entityClass) {
            return null
        }

        return entityClass.fromXML(xml, this, internalId)
    }

    public createEntityFromAttributes<T extends Entity = Entity>(tagName: TAGS, attrs: EntityAttributes): T {
        const entityClass = getEntityClassByTag(this.options.realm, tagName)
        if (!entityClass) {
            return null
        }

        return new entityClass(attrs, this) as T
    }

    public async parseISOXMLFile(data: string, dataType: 'text/xml' | 'application/xml'): Promise<void>
    public async parseISOXMLFile(data: Uint8Array, dataType: 'application/zip'): Promise<void>
    public async parseISOXMLFile(data: Uint8Array|string, dataType: string): Promise<void> {
        if (dataType === 'application/xml' || dataType === 'text/xml') {
            this.options.rootFolder = ''
            const mainXml = xml2js(data as string)

            if (!mainXml['ISO11783_TaskData']) {
                throw new Error('Incorrect structure of TASKDATA.XML')
            }

            this.rootElement = await getEntityClassByTag(this.options.realm, TAGS.ISO11783TaskDataFile)
                .fromXML(mainXml[TAGS.ISO11783TaskDataFile][0], this, '') as ExtendedISO11783TaskDataFile

        } else if (dataType === 'application/zip') {
            this.originalZip = await JSZip.loadAsync(data)
            const mainFilenames = Object.keys(this.originalZip.files).filter(path => {
                const splitted = path.split('/')
                return splitted[splitted.length - 1].toLowerCase() === MAIN_FILENAME.toLowerCase()
            })

            if (mainFilenames.length === 0) {
                throw new Error("ZIP file doesn't contain TASKDATA.XML")
            }

            if (mainFilenames.length > 1) {
                this.addWarning("More than one TASKDATA.XML files found in ZIP file - selecting one of them")
            }

            const mainFilename = mainFilenames.find(
                filename => filename.toLowerCase() === `${ROOT_FOLDER}/${MAIN_FILENAME}`.toLowerCase()
            ) ?? mainFilenames[0]

            if (mainFilename.slice(-MAIN_FILENAME.length) !== MAIN_FILENAME) {
                this.addWarning(`Name of the main file must be uppercase (real name: ${mainFilename})`)
            }

            this.options.rootFolder = mainFilename.slice(0, -MAIN_FILENAME.length)

            const mainFile = this.originalZip.file(mainFilename)

            const mainXmlString = await mainFile.async('string')
            const mainXml = xml2js(mainXmlString)

            if (!mainXml['ISO11783_TaskData']) {
                throw new Error('Incorrect structure of TASKDATA.XML')
            }

            this.rootElement = await getEntityClassByTag(this.options.realm, TAGS.ISO11783TaskDataFile)
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
            ISO11783_TaskData: this.rootElement.toXML()
        }

        const mainXML = js2xml(json)

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
            .filter(ref => ISOXMLManager.parseXmlId(ref.xmlId).tag === tag && ref.entity)
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
    public getParsedFile(
        filenameWithExtension: string,
        isBinary: boolean,
        addLetterCaseWarning = true
    ): Promise<Uint8Array | string> {
        if (!this.originalZip) {
            return null
        }

        let file: JSZipObject = null
        this.originalZip.folder(this.options.rootFolder).forEach((relativePath, f) => {
            if (relativePath.toUpperCase() === filenameWithExtension.toUpperCase()) {
                if (relativePath !== filenameWithExtension && addLetterCaseWarning) {
                    this.addWarning(
                        `Letter case of filename ${filenameWithExtension} doesn't match (real file: ${relativePath})`
                    )
                }
                file = f
            }
        })

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

import {
    ISO11783LinkListFile,
    ISO11783LinkListFileAttributes,
    ISO11783LinkListFileDataTransferOriginEnum,
    Link,
    LinkGroup,
    LinkGroupLinkGroupTypeEnum
} from "../baseEntities"
import { TAGS } from "../baseEntities/constants"
import { registerEntityClass } from "../classRegistry"
import { ISOXMLManager } from "../ISOXMLManager"
import { Entity, XMLElement } from "../types"

export class ExtendedISO11783LinkListFile extends ISO11783LinkListFile {
    public tag = TAGS.ISO11783LinkListFile

    public fileData: Uint8Array

    constructor(attributes: ISO11783LinkListFileAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static async fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId?: string): Promise<Entity> {
        const entity = await ISO11783LinkListFile.fromXML(
            xml,
            isoxmlManager,
            internalId,
            ExtendedISO11783LinkListFile
        ) as ISO11783LinkListFile

        const linkGroup = entity.attributes.LinkGroup?.find(group => 
            group.attributes.LinkGroupType === LinkGroupLinkGroupTypeEnum.UniqueResolvableURIs &&
            group.attributes.LinkGroupNamespace === isoxmlManager.options.fmisURI
        )

        linkGroup?.attributes.Link?.forEach(link => {
            isoxmlManager.registerEntity(null, link.attributes.ObjectIdRef.xmlId, link.attributes.LinkValue)
        })
        return entity
    }

    toXML(): XMLElement { 
        this.attributes.LinkGroup = []
        if (this.isoxmlManager.options.fmisURI) {
            const links = Object.values(this.isoxmlManager.xmlReferences)
                .filter(ref => ref.fmisId)
                .map(ref => new Link({
                    ObjectIdRef: ref,
                    LinkValue: ref.fmisId 
                }, this.isoxmlManager))
            const linkGroup = this.isoxmlManager.createEntityFromAttributes<LinkGroup>(TAGS.LinkGroup, {
                LinkGroupType: LinkGroupLinkGroupTypeEnum.UniqueResolvableURIs,
                LinkGroupNamespace: this.isoxmlManager.options.fmisURI,
                Link: links
            })
            this.isoxmlManager.registerEntity(linkGroup)
            this.attributes.LinkGroup = [linkGroup]
        }
        return super.toXML() 
    } 

    static fromISOXMLManager(isoxmlManager: ISOXMLManager): ExtendedISO11783LinkListFile {
        const version = isoxmlManager.options.version
        return new ExtendedISO11783LinkListFile({
            VersionMajor: (version === 4 ? '4' : '3') as any,
            VersionMinor: (version === 4 ? '2' : '3') as any,
            ManagementSoftwareManufacturer: isoxmlManager.options.fmisTitle,
            ManagementSoftwareVersion: isoxmlManager.options.fmisVersion,
            DataTransferOrigin: ISO11783LinkListFileDataTransferOriginEnum.FMIS
        }, isoxmlManager)
    }
}

registerEntityClass('main', TAGS.ISO11783LinkListFile, ExtendedISO11783LinkListFile)

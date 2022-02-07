import { Device, DeviceElement, DeviceElementAttributes, DeviceValuePresentation } from "../baseEntities"
import { TAGS } from "../baseEntities/constants"
import { registerEntityClass } from "../classRegistry"
import { ISOXMLManager } from "../ISOXMLManager"
import { Entity, XMLElement } from "../types"

export class ExtendedDeviceElement extends DeviceElement {
    public tag = TAGS.DeviceElement

    constructor(attributes: DeviceElementAttributes, isoxmlManager: ISOXMLManager) {
        super(attributes, isoxmlManager)
    }

    static fromXML(xml: XMLElement, isoxmlManager: ISOXMLManager, internalId: string): Promise<Entity> {
        return DeviceElement.fromXML(xml, isoxmlManager, internalId, ExtendedDeviceElement)
    }

    getParentDevice() {
        return this.isoxmlManager.getEntitiesOfTag<Device>(TAGS.Device).find(
            device => (device.attributes.DeviceElement || []).find(deviceElement => deviceElement === this)
        )
    }

    getValuePresentation(ddi: string): DeviceValuePresentation {
        const device = this.getParentDevice()

        if (!device) {
            return null
        }

        const processData = (device.attributes.DeviceProcessData || []).find(
            dpd => dpd.attributes.DeviceProcessDataDDI === ddi &&
                (this.attributes.DeviceObjectReference || [])
                    .find(ref => ref.attributes.DeviceObjectId === dpd.attributes.DeviceProcessDataObjectId)
        )

        const dvpObjectId = processData?.attributes.DeviceValuePresentationObjectId
        if (!dvpObjectId) {
            return null
        }

        return (device.attributes.DeviceValuePresentation || [])
            .find(dvp => dvp.attributes.DeviceValuePresentationObjectId === dvpObjectId)
    }
}

registerEntityClass('main', TAGS.DeviceElement, ExtendedDeviceElement)
import {EntityConstructor} from './types'

const availableEntityClasses: {[tagName: string]: EntityConstructor} = {}

export function registerEntityClass(tagName: string, entityClasses: EntityConstructor) {
    availableEntityClasses[tagName] = entityClasses
}

export function getEntityClassByTag(tagName: string) {
    return availableEntityClasses[tagName]
}
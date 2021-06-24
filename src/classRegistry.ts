import {EntityConstructor} from './types'

const availableEntityClasses: {[tagName: string]: EntityConstructor} = {}

export function registerEntityClass(tagName: string, entityClass: EntityConstructor) {
    availableEntityClasses[tagName] = entityClass
}

export function getEntityClassByTag(tagName: string) {
    return availableEntityClasses[tagName]
}
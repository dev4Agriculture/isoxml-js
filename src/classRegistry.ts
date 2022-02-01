import { TAGS } from './baseEntities/constants'
import {EntityConstructor} from './types'

const availableEntityClasses: {
    [realm: string]: {[tagName: string]: EntityConstructor}
} = {}

export function registerEntityClass(realm: string, tagName: TAGS, entityClass: EntityConstructor): void {
    availableEntityClasses[realm] = availableEntityClasses[realm] || {}
    availableEntityClasses[realm][tagName] = entityClass
}

export function getEntityClassByTag(realm: string, tagName: TAGS): EntityConstructor {
    return availableEntityClasses[realm][tagName]
}
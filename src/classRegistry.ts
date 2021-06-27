import { TAGS } from './baseEntities/constants'
import {EntityConstructor} from './types'

const availableEntityClasses: {[tagName: string]: EntityConstructor} = {}

export function registerEntityClass(tagName: TAGS, entityClass: EntityConstructor) {
    availableEntityClasses[tagName] = entityClass
}

export function getEntityClassByTag(tagName: TAGS) {
    return availableEntityClasses[tagName]
}
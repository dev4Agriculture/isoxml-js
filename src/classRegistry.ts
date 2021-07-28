import { TAGS } from './baseEntities/constants'
import {EntityConstructor} from './types'

const availableEntityClasses: {[tagName: string]: EntityConstructor} = {}

export function registerEntityClass(tagName: TAGS, entityClass: EntityConstructor): void {
    availableEntityClasses[tagName] = entityClass
}

export function getEntityClassByTag(tagName: TAGS): EntityConstructor {
    return availableEntityClasses[tagName]
}
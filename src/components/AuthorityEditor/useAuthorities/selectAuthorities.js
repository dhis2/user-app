import endsWith from 'lodash.endswith'
import { PUBLIC_ADD_SUFFIX, PRIVATE_ADD_SUFFIX } from './constants'

export const isPublicAdd = id => endsWith(id, PUBLIC_ADD_SUFFIX)
export const isPrivateAdd = id => endsWith(id, PRIVATE_ADD_SUFFIX)
const selectMetaDataSubItems = (subItems, selectedSet) => {
    const hasPublicAddSelected =
        selectedSet.has(subItems[0].id) && isPublicAdd(subItems[0].id)

    return subItems.map(subItem => {
        const implicitlySelected =
            hasPublicAddSelected && isPrivateAdd(subItem.id)
        const selected = selectedSet.has(subItem.id) || implicitlySelected

        return {
            ...subItem,
            selected,
            implicitlySelected,
        }
    })
}

const selectAuthorities = ({ authorities, selectedSet }) =>
    Object.entries(authorities).reduce((groups, [groupName, group]) => {
        groups[groupName] = {
            ...group,
            items: group.items.map(item => {
                if (Array.isArray(item.items)) {
                    return {
                        ...item,
                        items: selectMetaDataSubItems(item.items, selectedSet),
                    }
                } else {
                    return {
                        ...item,
                        selected: selectedSet.has(item.id),
                    }
                }
            }),
        }
        return groups
    }, {})

export { selectAuthorities }

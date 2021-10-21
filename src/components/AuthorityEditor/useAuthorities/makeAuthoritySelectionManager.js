import endsWith from 'lodash.endswith'
import { PUBLIC_ADD_SUFFIX, PRIVATE_ADD_SUFFIX } from './constants'

export const isPublicAdd = id => endsWith(id, PUBLIC_ADD_SUFFIX)
export const convertPublicAddIdToPrivate = id =>
    id.replace(PUBLIC_ADD_SUFFIX, PRIVATE_ADD_SUFFIX)

const makeAuthoritySelectionManager = (
    initiallySelected
    // reduxFormOnChange
) => {
    const authoritiesMap = new Map()

    const isEmpty = () => authoritiesMap.size === 0

    // const getSelectionArray = authoritiesMap
    //     .values()
    //     .filter(({ selected }) => selected)
    //     .map(({ id }) => id)

    const registerStateSetters = (id, setSelected, setImplicitlySelected) => {
        const authority = authoritiesMap.get(id)

        if (authority) {
            authority.setSelected = setSelected
            authority.setImplicitlySelected = setImplicitlySelected
        } else {
            authoritiesMap.set(id, {
                id,
                setSelected,
                setImplicitlySelected,
            })
        }
    }

    const updateAuthority = (id, selected /*, skipFormUpdate*/) => {
        console.log(id)
        const authority = authoritiesMap.get(id)
        authority.selected = selected
        authority.setSelected(selected)

        // Update implicitlySelected state for public/private add pairs
        if (isPublicAdd(id)) {
            const privateAddAuthority = authoritiesMap.get(
                convertPublicAddIdToPrivate(id)
            )
            if (privateAddAuthority) {
                privateAddAuthority.implicitlySelected = selected
                privateAddAuthority.setImplicitlySelected(selected)
            }
        }

        // !skipFormUpdate && reduxFormOnChange(getSelectionArray())
    }

    const updateAuthorities = (ids, selected) => {
        ids.forEach(id => {
            updateAuthority(id, selected, true)
        })
        // reduxFormOnChange(getSelectionArray())
    }

    const isSelected = id => !!authoritiesMap.get(id)?.selected

    const isImplicitlySelected = id =>
        !!authoritiesMap.get(id)?.implicitlySelected

    const areAllSelected = ids =>
        ids.length > 0 && ids.every(id => authoritiesMap.get(id)?.selected)

    const populate = systemAuthorities => {
        systemAuthorities.forEach(authority =>
            authoritiesMap.set(authority.id, authority)
        )
        initiallySelected.forEach(id => {
            updateAuthority(id, true)
        })
    }

    return {
        registerStateSetters,
        updateAuthority,
        updateAuthorities,
        isSelected,
        isImplicitlySelected,
        areAllSelected,
        populate,
        isEmpty,
    }
}

export { makeAuthoritySelectionManager }

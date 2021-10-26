import endsWith from 'lodash.endswith'
import { PUBLIC_ADD_SUFFIX, PRIVATE_ADD_SUFFIX, METADATA } from './constants'

export const isPublicAdd = id => endsWith(id, PUBLIC_ADD_SUFFIX)
export const convertPublicAddIdToPrivate = id =>
    id.replace(PUBLIC_ADD_SUFFIX, PRIVATE_ADD_SUFFIX)

const makeAuthoritySelectionManager = (
    initiallySelected,
    reduxFormOnChange
) => {
    const authoritiesMap = new Map()
    const columnHeadersMap = new Map()

    const isEmpty = () => authoritiesMap.size === 0

    const getSelectionArray = () =>
        Array.from(authoritiesMap.values())
            .filter(({ selected }) => selected)
            .map(({ id }) => id)

    const registerStateSetters = (id, setSelected, setImplicitlySelected) => {
        const authority = authoritiesMap.get(id)

        authoritiesMap.set(id, {
            ...authority,
            setSelected,
            setImplicitlySelected,
        })
    }

    const registerColumnHeaderStateSetters = (columnId, setSelected) => {
        const columnHeader = columnHeadersMap.get(columnId)
        columnHeadersMap.set(columnId, {
            ...columnHeader,
            setSelected,
        })
    }

    const updateColumnHeaders = filteredAuthorityGroups => {
        Object.entries(filteredAuthorityGroups).forEach(([id, group]) => {
            if (id === METADATA) {
                updateMetadaColumnHeaders(group)
            } else {
                updateColumnHeader(id, group)
            }
        })
    }

    const updateColumnHeader = (id, group) => {
        const columnHeader = columnHeadersMap.get(id)
        const prevSelected = !!columnHeader?.selected
        const selected = group.items.every(
            item => authoritiesMap.get(item.id).selected
        )
        const authorityIds = group.items.map(item => item.id)

        columnHeadersMap.set(id, {
            ...columnHeader,
            selected,
            authorityIds,
        })

        if (prevSelected !== selected) {
            columnHeader?.setSelected(selected)
        }
    }

    const updateMetadaColumnHeaders = group => {
        group.headers.slice(1).forEach((_, columnIndex) => {
            const headerId = `${METADATA}_${columnIndex}`
            const columnHeader = columnHeadersMap.get(headerId)
            const authorityIds = group.items.reduce((acc, item) => {
                if (item.items[columnIndex].id) {
                    acc.push(item.items[columnIndex].id)
                }
                return acc
            }, [])
            const selected = authorityIds.every(
                item => authoritiesMap.get(item).selected
            )
            const prevSelected = !!columnHeader?.selected

            columnHeadersMap.set(headerId, {
                ...columnHeader,
                selected,
                authorityIds,
            })

            if (prevSelected !== selected) {
                columnHeader?.setSelected(selected)
            }
        })
    }

    const toggleAuthority = ({
        authorityId,
        columnId,
        selected,
        skipFormUpdate,
    }) => {
        const authority = authoritiesMap.get(authorityId)
        /**
         * The authority is updated conditionally to catch an edge case.
         * It has happened that a user had an authority assigned to it
         * which was not present in the array of `systemAuthorities`.
         * This means the authority never got added to the `authoritiesMap`
         * and this function threw an error.
         */
        if (authority) {
            authority.selected = selected
            authority.setSelected?.(selected)
        }

        // Update implicitlySelected state for public/private add pairs
        if (isPublicAdd(authorityId)) {
            const privateAddAuthority = authoritiesMap.get(
                convertPublicAddIdToPrivate(authorityId)
            )
            if (privateAddAuthority) {
                privateAddAuthority.implicitlySelected = selected
                privateAddAuthority.setImplicitlySelected?.(selected)
            }
        }

        if (columnId) {
            const columnHeader = columnHeadersMap.get(columnId)
            const newColumnHeaderSelected = columnHeader.authorityIds.every(
                id => !!authoritiesMap.get(id)?.selected
            )

            if (columnHeader.selected !== newColumnHeaderSelected) {
                columnHeader.selected = newColumnHeaderSelected
                columnHeader.setSelected(newColumnHeaderSelected)
            }
        }

        if (!skipFormUpdate) {
            reduxFormOnChange(getSelectionArray())
        }
    }

    const toggleColumnHeader = (columnId, selected) => {
        const columnHeader = columnHeadersMap.get(columnId)

        columnHeader.selected = selected
        columnHeader.setSelected(selected)
        columnHeader.authorityIds.forEach(authorityId => {
            toggleAuthority({
                authorityId,
                selected,
                skipFormUpdate: true,
            })
        })
        reduxFormOnChange(getSelectionArray())
    }

    const isSelected = id => !!authoritiesMap.get(id)?.selected

    const isColumnSelected = columnId =>
        !!columnHeadersMap.get(columnId)?.selected

    const isImplicitlySelected = id =>
        !!authoritiesMap.get(id)?.implicitlySelected

    const populate = (systemAuthorities, groupedAuthorities) => {
        systemAuthorities.forEach(authority => {
            authoritiesMap.set(authority.id, authority)
        })
        initiallySelected.forEach(authorityId => {
            toggleAuthority({
                authorityId,
                selected: true,
                skipFormUpdate: true,
            })
        })
        updateColumnHeaders(groupedAuthorities)
    }

    return {
        isEmpty,
        isImplicitlySelected,
        isSelected,
        isColumnSelected,
        populate,
        registerColumnHeaderStateSetters,
        registerStateSetters,
        toggleAuthority,
        toggleColumnHeader,
        updateColumnHeaders,
    }
}

export { makeAuthoritySelectionManager }

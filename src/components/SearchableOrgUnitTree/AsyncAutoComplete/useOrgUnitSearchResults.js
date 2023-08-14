import { useDataQuery } from '@dhis2/app-runtime'
import { debounce } from 'lodash-es'
import { useState, useEffect, useRef } from 'react'
import { useCurrentUser } from '../../../hooks/useCurrentUser.js'
import { PAGE_SIZE, MIN_CHAR_LENGTH, DEBOUNCE_TIME } from './constants.js'
import { getRestrictedOrgUnits } from './getRestrictedOrgUnits.js'

const query = {
    organisationUnits: {
        resource: 'organisationUnits',
        params: ({ searchText }) => ({
            fields: [
                'id',
                'path',
                'displayName',
                'children::isNotEmpty',
                'ancestors',
            ],
            filter: `displayName:ilike:${searchText}`,
            paging: true,
            pageSize: PAGE_SIZE,
        }),
    },
}

const useOrgUnitSearchResults = ({ searchText, orgUnitType }) => {
    const currentUser = useCurrentUser()
    const [organisationUnits, setOrganisationUnits] = useState([])
    const [waiting, setWaiting] = useState(false)
    const { refetch, fetching, error, data } = useDataQuery(query, {
        lazy: true,
    })

    const debouncedRefetchRef = useRef(debounce(refetch, DEBOUNCE_TIME))

    useEffect(() => {
        if (searchText.length >= MIN_CHAR_LENGTH) {
            setWaiting(true)
            debouncedRefetchRef.current({ searchText })
        }
    }, [searchText, orgUnitType])

    useEffect(() => {
        if (fetching && waiting) {
            setWaiting(false)
        }

        if (!fetching && data) {
            setOrganisationUnits(
                getRestrictedOrgUnits(
                    data.organisationUnits.organisationUnits,
                    orgUnitType,
                    currentUser
                )
            )
        }

        if (!fetching && !data) {
            setOrganisationUnits([])
        }
    }, [data, fetching])

    return {
        clear: () => setOrganisationUnits([]),
        error,
        fetching,
        organisationUnits,
        totalSearchResultCount: data?.organisationUnits.pager.total,
        waiting,
    }
}

export default useOrgUnitSearchResults

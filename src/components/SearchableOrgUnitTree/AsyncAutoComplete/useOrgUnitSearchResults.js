import { useDataQuery } from '@dhis2/app-runtime'
import debounce from 'lodash.debounce'
import { useState, useEffect, useRef } from 'react'
import { PAGE_SIZE, MIN_CHAR_LENGTH, DEBOUNCE_TIME } from './constants.js'
import { getRestrictedOrgUnits } from './getRestrictedOrgUnits.js'

PAGE_SIZE

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
            filter: `identifiable:token:${searchText}`,
            paging: true,
            pageSize: PAGE_SIZE,
        }),
    },
}

const useOrgUnitSearchResults = ({ searchText, orgUnitType }) => {
    const [organisationUnits, setOrganisationUnits] = useState([])
    const { refetch, fetching, error, data } = useDataQuery(query, {
        lazy: true,
    })
    const debouncedRefetchRef = useRef(debounce(refetch, DEBOUNCE_TIME))

    useEffect(() => {
        if (searchText.length >= MIN_CHAR_LENGTH) {
            debouncedRefetchRef.current({ searchText })
        }
    }, [searchText, orgUnitType])

    useEffect(() => {
        setOrganisationUnits(
            data
                ? getRestrictedOrgUnits(
                      data.organisationUnits.organisationUnits,
                      orgUnitType
                  )
                : []
        )
    }, [data])

    return {
        fetching,
        error,
        organisationUnits,
        totalSearchResultCount: data?.organisationUnits.pager.total,
        clear: () => setOrganisationUnits([]),
    }
}

export default useOrgUnitSearchResults

import { useState } from 'react'
import {
    withDefault,
    StringParam,
    NumberParam,
    BooleanParam,
} from 'use-query-params'
import { useQueryParam } from '../../hooks/useQueryParams'

export const useFilters = () => {
    const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 1))
    const [pageSize, setPageSize] = useQueryParam(
        'pageSize',
        withDefault(NumberParam, 50)
    )
    const [query, setQuery] = useQueryParam(
        'query',
        withDefault(StringParam, '')
    )
    const [inactiveMonths, setInactiveMonths] = useQueryParam(
        'inactiveMonths',
        StringParam
    )
    const [invitationStatus, setInvitationStatus] = useQueryParam(
        'invitationStatus',
        StringParam
    )
    const [selfRegistered, setSelfRegistered] = useQueryParam(
        'selfRegistered',
        withDefault(BooleanParam, false)
    )
    const [nameSortDirection, setNameSortDirection] = useQueryParam(
        'nameSortDirection',
        withDefault(StringParam, 'asc')
    )
    const [organisationUnits, setOrganisationUnits] = useState([])

    const withPushIn = setFn => value => {
        setFn(value, 'pushIn')
    }
    const clearPager = () => {
        setPage()
        setPageSize()
    }
    const withClearPager = setFn => value => {
        clearPager()
        setFn(value)
    }

    return {
        page,
        setPage: withPushIn(setPage),
        pageSize,
        setPageSize: withPushIn(setPageSize),
        query,
        setQuery: withClearPager(setQuery),
        inactiveMonths,
        setInactiveMonths: withClearPager(setInactiveMonths),
        invitationStatus,
        setInvitationStatus: withClearPager(setInvitationStatus),
        selfRegistered,
        setSelfRegistered: withClearPager(setSelfRegistered),
        nameSortDirection,
        toggleNameSortDirection: withClearPager(() => {
            setNameSortDirection(nameSortDirection === 'asc' ? 'desc' : 'asc')
        }),
        organisationUnits,
        setOrganisationUnits: withClearPager(setOrganisationUnits),
        clearFilters: () => {
            setQuery()
            setInactiveMonths()
            setInvitationStatus()
            setNameSortDirection()
            setOrganisationUnits([])
        },
    }
}

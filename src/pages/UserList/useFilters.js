import {
    withDefault,
    StringParam,
    BooleanParam,
    JsonParam,
} from 'use-query-params'
import {
    useQueryParam,
    usePagerQueryParams,
    useNameSortDirectionQueryParam,
} from '../../hooks/useQueryParams.js'

export const useFilters = () => {
    const { page, setPage, pageSize, setPageSize, withClearPager } =
        usePagerQueryParams()
    const [query, setQuery] = useQueryParam(
        'query',
        withDefault(StringParam, '')
    )
    const [organisationUnits, setOrganisationUnits] = useQueryParam(
        'organisationUnits',
        withDefault(JsonParam, [])
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
    const { nameSortDirection, toggleNameSortDirection } =
        useNameSortDirectionQueryParam()

    return {
        page,
        setPage,
        pageSize,
        setPageSize,
        query,
        setQuery: withClearPager(setQuery),
        organisationUnits,
        setOrganisationUnits: withClearPager(setOrganisationUnits),
        inactiveMonths,
        setInactiveMonths: withClearPager(setInactiveMonths),
        invitationStatus,
        setInvitationStatus: withClearPager(setInvitationStatus),
        selfRegistered,
        setSelfRegistered: withClearPager(setSelfRegistered),
        nameSortDirection,
        toggleNameSortDirection: withClearPager(toggleNameSortDirection),
        clearFilters: () => {
            setSelfRegistered(false)
            setQuery()
            setOrganisationUnits([])
            setInactiveMonths()
            setInvitationStatus()
        },
    }
}

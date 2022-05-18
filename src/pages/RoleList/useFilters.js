import { withDefault, StringParam } from 'use-query-params'
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
    const { nameSortDirection, toggleNameSortDirection } =
        useNameSortDirectionQueryParam()

    return {
        page,
        setPage,
        pageSize,
        setPageSize,
        query,
        setQuery: withClearPager(setQuery),
        nameSortDirection,
        toggleNameSortDirection: withClearPager(toggleNameSortDirection),
    }
}

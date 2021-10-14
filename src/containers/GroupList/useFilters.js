import { withDefault, StringParam, NumberParam } from 'use-query-params'
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

    const withPushIn = setFn => value => {
        setFn(value, 'pushIn')
    }
    const clearPager = () => {
        setPage()
        setPageSize()
    }

    return {
        page,
        setPage: withPushIn(setPage),
        pageSize,
        setPageSize: withPushIn(setPageSize),
        query,
        setQuery: query => {
            clearPager()
            setQuery(query)
        },
    }
}

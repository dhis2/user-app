import {
    useQueryParams as _useQueryParams,
    useQueryParam as _useQueryParam,
    withDefault,
    StringParam,
    NumberParam,
} from 'use-query-params'

// A default update type of 'replaceIn' instead of 'pushIn' is more useful for
// this app's use cases
const defaultUpdateType = 'replaceIn'

export const useQueryParams = (config) => {
    const [queryParams, setQueryParams] = _useQueryParams(config)
    const setQueryParamsReplace = (values, updateType = defaultUpdateType) => {
        setQueryParams(values, updateType)
    }
    return [queryParams, setQueryParamsReplace]
}

export const useQueryParam = (name, config) => {
    const [queryParam, setQueryParam] = _useQueryParam(name, config)
    const setQueryParamReplace = (value, updateType = defaultUpdateType) => {
        setQueryParam(value, updateType)
    }
    return [queryParam, setQueryParamReplace]
}

export const usePagerQueryParams = () => {
    const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 1))
    const [pageSize, setPageSize] = useQueryParam(
        'pageSize',
        withDefault(NumberParam, 50)
    )

    const withPushIn = (setFn) => (value) => {
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
        withClearPager: (setFn) => (value) => {
            clearPager()
            setFn(value)
        },
    }
}

export const useNameSortDirectionQueryParam = () => {
    const [nameSortDirection, setNameSortDirection] = useQueryParam(
        'nameSortDirection',
        withDefault(StringParam, 'asc')
    )

    return {
        nameSortDirection,
        toggleNameSortDirection: () => {
            setNameSortDirection(nameSortDirection === 'asc' ? 'desc' : 'asc')
        },
    }
}

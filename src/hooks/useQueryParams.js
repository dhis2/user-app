import {
    useQueryParams as _useQueryParams,
    useQueryParam as _useQueryParam,
} from 'use-query-params'

const defaultUpdateType = 'replaceIn'

export const useQueryParams = config => {
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

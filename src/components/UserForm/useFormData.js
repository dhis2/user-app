import { useDataQuery } from '@dhis2/app-runtime'
import { uniqBy } from 'lodash-es'
import { useMemo } from 'react'
import { userAttributesQuery } from '../../attributes.js'

const query = {
    interfaceLanguages: {
        resource: 'locales/ui',
        params: {
            fields: ['locale', 'name', 'displayName'],
        },
    },
    databaseLanguages: {
        resource: 'locales/db',
        params: {
            fields: ['locale', 'name', 'displayName'],
        },
    },
    userRoles: {
        resource: 'userRoles',
        params: {
            fields: ['id', 'displayName'],
            canIssue: true,
            paging: false,
        },
    },
    userGroups: {
        resource: 'userGroups',
        params: {
            fields: ['id', 'displayName'],
            paging: false,
        },
    },
    dimensionConstraints: {
        resource: 'dimensions/constraints',
        params: {
            fields: ['id', 'name', 'dimensionType'],
            paging: false,
        },
    },
    filledOrganisationUnitLevels: {
        resource: 'filledOrganisationUnitLevels',
    },
    attributes: userAttributesQuery,
}

const optionsFromLanguages = (languages) =>
    // It is possible for the server to return duplicate entries for database locales
    uniqBy(
        languages.map(({ name, displayName, locale }) => ({
            label: name === displayName ? name : `${name} — ${displayName}`,
            value: locale,
        })),
        'value'
    )

const makeOptions = (array) =>
    array.map(({ displayName, name, id }) => ({
        label: displayName || name,
        value: id,
    }))

export const useFormData = () => {
    const { loading, error, data } = useDataQuery(query)
    const formData = useMemo(() => {
        if (!data) {
            return
        }

        const {
            interfaceLanguages,
            databaseLanguages,
            userRoles: { userRoles },
            userGroups: { userGroups },
            dimensionConstraints: { dimensions: dimensionConstraints },
            attributes: { attributes },
            filledOrganisationUnitLevels,
        } = data

        return {
            interfaceLanguageOptions: optionsFromLanguages(interfaceLanguages),
            databaseLanguageOptions: optionsFromLanguages(databaseLanguages),
            userRoleOptions: makeOptions(userRoles),
            userGroupOptions: makeOptions(userGroups),
            dimensionConstraints,
            dimensionConstraintOptions: makeOptions(dimensionConstraints),
            filledOrganisationUnitLevels,
            attributes,
        }
    }, [data])

    if (loading || error) {
        return { loading, error }
    }
    return formData
}

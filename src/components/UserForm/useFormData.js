import { useDataQuery } from '@dhis2/app-runtime'
import uniqBy from 'lodash.uniqby'

const query = {
    interfaceLanguages: {
        resource: 'locales/ui',
    },
    databaseLanguages: {
        resource: 'locales/db',
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
    allDimensionConstraints: {
        resource: 'dimensions/constraints',
        params: {
            fields: ['id', 'name', 'dimensionType'],
            paging: false,
        },
    },
}

const optionsFromLanguages = languages =>
    // It is possible for the server to return duplicate entries for database locales
    uniqBy(
        languages.map(({ name, locale }) => ({
            label: name,
            value: locale,
        })),
        'value'
    )

const makeOptions = array =>
    array.map(({ displayName, name, id }) => ({
        label: displayName || name,
        value: id,
    }))

export const useFormData = () => {
    const { loading, error, data } = useDataQuery(query)

    if (loading || error) {
        return { loading, error }
    }

    const {
        interfaceLanguages,
        databaseLanguages,
        userRoles: { userRoles },
        userGroups: { userGroups },
        allDimensionConstraints: { dimensions: allDimensionConstraints },
    } = data

    return {
        interfaceLanguageOptions: optionsFromLanguages(interfaceLanguages),
        databaseLanguageOptions: optionsFromLanguages(databaseLanguages),
        userRoleOptions: makeOptions(userRoles),
        userGroupOptions: makeOptions(userGroups),
        allDimensionConstraintOptions: makeOptions(allDimensionConstraints),
    }
}

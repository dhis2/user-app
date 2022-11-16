import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Layer, CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

const CurrentUserContext = createContext({})

const query = {
    me: {
        resource: '/me',
        params: {
            fields: [
                'userGroups[id]',
                'userCredentials[userRoles[id]]',
                'organisationUnits[id,path,displayName,children::isNotEmpty]',
                'dataViewOrganisationUnits[id,path,displayName,children::isNotEmpty]',
                'teiSearchOrganisationUnits[id,path,displayName,children::isNotEmpty]',
            ],
        },
    },
    systemOrganisationUnitRoots: {
        resource: '/organisationUnits',
        params: {
            paging: false,
            level: 1,
            fields: 'id,path,displayName,children::isNotEmpty',
        },
    },
}

const CurrentUserProvider = ({ children }) => {
    const { data, error, fetching, loading, refetch } = useDataQuery(query)

    if (loading || fetching) {
        return (
            <Layer translucent>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </Layer>
        )
    }

    if (error) {
        return (
            <NoticeBox error title={i18n.t('Network error')}>
                {i18n.t('Could not load current user information.')}
            </NoticeBox>
        )
    }

    const value = {
        userGroupIds: data.me.userGroups.map(({ id }) => id),
        userRoleIds: data.me.userCredentials.userRoles.map(({ id }) => id),
        organisationUnits: data.me.organisationUnits ?? [],
        dataViewOrganisationUnits: data.me.dataViewOrganisationUnits ?? [],
        teiSearchOrganisationUnits: data.me.teiSearchOrganisationUnits ?? [],
        systemOrganisationUnitRoots:
            data.systemOrganisationUnitRoots.organisationUnits ?? [],
        refreshCurrentUser: refetch,
    }

    return (
        <CurrentUserContext.Provider value={value}>
            {children}
        </CurrentUserContext.Provider>
    )
}

CurrentUserProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

const useCurrentUser = () => useContext(CurrentUserContext)

export { CurrentUserProvider, useCurrentUser }

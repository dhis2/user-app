import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Layer, CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { createContext } from 'react'

const CurrentUserContext = createContext({})

const query = {
    me: {
        resource: '/me',
        params: {
            fields: [
                'id',
                'username',
                'surname',
                'firstName',
                'authorities',
                'userRoles[id]',
                'userGroups[id]',
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

const AUTH_LOOKUP = {
    APP: new Set(['ALL', 'M_dhis-web-user']),
    USER: new Set([
        'ALL',
        'F_USER_VIEW',
        'F_REPLICATE_USER',
        'F_USER_ADD',
        'F_USER_ADD_WITHIN_MANAGED_GROUP',
        'F_USER_DELETE',
        'F_USER_DELETE_WITHIN_MANAGED_GROUP',
    ]),
    GROUP: new Set([
        'ALL',
        'F_USERGROUP_DELETE',
        'F_USERGROUP_PRIVATE_ADD',
        'F_USERGROUP_PUBLIC_ADD',
        'F_USER_GROUPS_READ_ONLY_ADD_MEMBERS',
        'F_USERGROUP_MANAGING_RELATIONSHIPS_ADD',
        'F_USERGROUP_MANAGING_RELATIONSHIPS_VIEW',
    ]),
    ROLE: new Set([
        'ALL',
        'F_USERROLE_DELETE',
        'F_USERROLE_PRIVATE_ADD',
        'F_USERROLE_PUBLIC_ADD',
    ]),
    USER_CREATE: new Set([
        'ALL',
        'F_USER_ADD',
        'F_USER_ADD_WITHIN_MANAGED_GROUP',
    ]),
    GROUP_CREATE: new Set([
        'ALL',
        'F_USERGROUP_PRIVATE_ADD',
        'F_USERGROUP_PUBLIC_ADD',
        'F_USER_GROUPS_READ_ONLY_ADD_MEMBERS',
        'F_USERGROUP_MANAGING_RELATIONSHIPS_ADD',
    ]),
    ROLE_CREATE: new Set([
        'ALL',
        'F_USERROLE_PRIVATE_ADD',
        'F_USERROLE_PUBLIC_ADD',
    ]),
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
        id: data.me.id,
        username: data.me.username,
        surname: data.me.surname,
        firstName: data.me.firstName,
        authorities: data.me.authorities,
        userGroupIds: data.me.userGroups.map(({ id }) => id),
        userRoleIds: data.me.userRoles.map(({ id }) => id),
        organisationUnits: data.me.organisationUnits ?? [],
        dataViewOrganisationUnits: data.me.dataViewOrganisationUnits ?? [],
        teiSearchOrganisationUnits: data.me.teiSearchOrganisationUnits ?? [],
        systemOrganisationUnitRoots:
            data.systemOrganisationUnitRoots.organisationUnits ?? [],
        hasAppAccess: data.me.authorities.some((auth) =>
            AUTH_LOOKUP.APP.has(auth)
        ),
        hasUserSectionAccess: data.me.authorities.some((auth) =>
            AUTH_LOOKUP.USER.has(auth)
        ),
        hasGroupSectionAccess: data.me.authorities.some((auth) =>
            AUTH_LOOKUP.GROUP.has(auth)
        ),
        hasRoleSectionAccess: data.me.authorities.some((auth) =>
            AUTH_LOOKUP.ROLE.has(auth)
        ),
        canCreateUsers: data.me.authorities.some((auth) =>
            AUTH_LOOKUP.USER_CREATE.has(auth)
        ),
        canCreateGroups: data.me.authorities.some((auth) =>
            AUTH_LOOKUP.GROUP_CREATE.has(auth)
        ),
        canCreateRoles: data.me.authorities.some((auth) =>
            AUTH_LOOKUP.ROLE_CREATE.has(auth)
        ),
        refresh: refetch,
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

export { CurrentUserProvider, CurrentUserContext }

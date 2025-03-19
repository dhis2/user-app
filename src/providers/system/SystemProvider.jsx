import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Layer, CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { SystemContext } from './SystemContext.js'

const query = {
    systemAuthorities: {
        resource: 'authorities',
    },
    systemSettings: {
        resource: 'systemSettings',
    },
    loginConfig: {
        resource: 'loginConfig',
    },
}

const EXCLUDED_AUTHORITIES = ['F_PREVIOUS_IMPERSONATOR_AUTHORITY']

export const SystemProvider = ({ children }) => {
    const { data, error, fetching, loading } = useDataQuery(query)

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
                {i18n.t('Could not load system information.')}
            </NoticeBox>
        )
    }

    if (!data) {
        return null
    }

    const value = {
        authorities:
            data.systemAuthorities?.systemAuthorities?.filter(
                (a) => !EXCLUDED_AUTHORITIES.includes(a?.id)
            ) ?? [],
        authorityIdToNameMap: !data.systemAuthorities?.systemAuthorities
            ? new Map()
            : data.systemAuthorities?.systemAuthorities?.reduce(
                  (authMap, { id, name }) => {
                      authMap.set(id, name)
                      return authMap
                  },
                  new Map()
              ),
        usersCanAssignOwnUserRoles: Boolean(
            data.systemSettings?.keyCanGrantOwnUserAuthorityGroups
        ),
        minPasswordLength: Number.isInteger(
            Number(data.systemSettings?.minPasswordLength)
        )
            ? data.systemSettings?.minPasswordLength
            : 8,
        maxPasswordLength: Number.isInteger(
            Number(data.systemSettings?.maxPasswordLength)
        )
            ? data.systemSettings?.maxPasswordLength
            : 72,
    }

    return (
        <SystemContext.Provider value={value}>
            {children}
        </SystemContext.Provider>
    )
}

SystemProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

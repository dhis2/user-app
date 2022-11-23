import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import PageHeader from '../components/PageHeader.js'
import RoleForm from '../components/RoleForm/index.js'

const query = {
    role: {
        resource: 'userRoles',
        id: ({ roleId }) => roleId,
        params: {
            fields: [':owner', 'access', 'displayName', 'authorities'],
        },
    },
}

const useRole = (roleId) => {
    const { called, loading, fetching, error, data, refetch } = useDataQuery(
        query,
        {
            lazy: true,
        }
    )

    useEffect(() => {
        refetch({ roleId })
    }, [roleId])

    return {
        // Don't use SWR for forms as react final form only renders the first
        // value passed to the initialValue prop - subsequent updates are
        // ignored.
        loading: !called || loading || fetching,
        error,
        role: data?.role,
    }
}

const EditRole = ({ roleId }) => {
    const { loading, error, role } = useRole(roleId)

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox error title={i18n.t('Error fetching role')}>
                    {i18n.t('There was an error fetching this role.')}
                </NoticeBox>
            </CenteredContent>
        )
    }

    return (
        <>
            <PageHeader>{i18n.t('Edit role')}</PageHeader>
            <RoleForm role={role} submitButtonLabel={i18n.t('Save changes')} />
        </>
    )
}

EditRole.propTypes = {
    roleId: PropTypes.string.isRequired,
}

export default EditRole

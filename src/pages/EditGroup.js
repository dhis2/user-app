import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import GroupForm from '../components/GroupForm/index.js'
import PageHeader from '../components/PageHeader.js'

const query = {
    group: {
        resource: 'userGroups',
        id: ({ groupId }) => groupId,
        params: {
            fields: [':owner', 'access', 'displayName', '!users'],
        },
    },
}

const useGroup = (groupId) => {
    const { called, loading, fetching, error, data, refetch } = useDataQuery(
        query,
        {
            lazy: true,
        }
    )

    useEffect(() => {
        refetch({ groupId })
    }, [groupId])

    return {
        // Don't use SWR for forms as react final form only renders the first
        // value passed to the initialValue prop - subsequent updates are
        // ignored.
        loading: !called || loading || fetching,
        error,
        group: data?.group,
    }
}

const EditGroup = ({ groupId }) => {
    const { loading, error, group } = useGroup(groupId)

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
                <NoticeBox error title={i18n.t('Error fetching group')}>
                    {i18n.t('There was an error fetching this group.')}
                </NoticeBox>
            </CenteredContent>
        )
    }

    return (
        <>
            <PageHeader>{i18n.t('Edit group')}</PageHeader>
            <GroupForm
                group={group}
                submitButtonLabel={i18n.t('Save changes')}
            />
        </>
    )
}

EditGroup.propTypes = {
    groupId: PropTypes.string.isRequired,
}

export default EditGroup

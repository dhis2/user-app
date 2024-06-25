import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import PageHeader from '../components/PageHeader.js'
import UserForm from '../components/UserForm/index.js'

const userQuery = {
    user: {
        resource: 'users',
        id: ({ id }) => id,
        params: {
            fields: [
                ':owner',
                'access',
                'displayName',
                'userGroups[id,displayName]',
                'organisationUnits[id,displayName,path]',
                'dataViewOrganisationUnits[id,displayName,path]',
                'teiSearchOrganisationUnits[id,displayName,path]',
                'dataViewMaxOrganisationUnitLevel',
                'id',
                'username',
                'accountExpiry',
                'lastLogin',
                'externalAuth',
                'userRoles[id,displayName]',
                'cogsDimensionConstraints[id,displayName,dimensionType]',
                'catDimensionConstraints[id,displayName,dimensionType]',
                'openId',
                'ldapId',
                'disabled',
                'whatsApp',
                'facebookMessenger',
                'skype',
                'telegram',
                'twitter',
            ],
        },
    },
}

const userSettingsQuery = {
    userSettings: {
        resource: 'userSettings',
        params: ({ username }) => ({
            user: username,
            // Field filters don't work, but let's pass them anyway
            fields: ['keyUiLocale', 'keyDbLocale'],
        }),
    },
}

const useUser = (userId) => {
    const user = useDataQuery(userQuery, { lazy: true })
    const username = user.data?.user?.username
    const userSettings = useDataQuery(userSettingsQuery, { lazy: true })

    useEffect(() => {
        const currentUserId = user.data?.user.id
        if (
            !currentUserId ||
            (currentUserId && userId && currentUserId !== userId)
        ) {
            user.refetch({ id: userId })
        }
    }, [user, userId])

    useEffect(() => {
        if (username) {
            userSettings.refetch({ username })
        }
    }, [username])

    const loading =
        !user.called ||
        !userSettings.called ||
        user.loading ||
        userSettings.loading ||
        user.fetching ||
        userSettings.fetching
    const error = loading ? undefined : user.error || userSettings.error
    const shouldReturnData = !loading && !error

    return {
        loading,
        error,
        user: shouldReturnData ? user.data.user : undefined,
        userInterfaceLanguage: shouldReturnData
            ? userSettings.data.userSettings.keyUiLocale
            : undefined,
        userDatabaseLanguage: shouldReturnData
            ? userSettings.data.userSettings.keyDbLocale
            : undefined,
    }
}

const EditUser = ({ userId }) => {
    const {
        loading,
        error,
        user,
        userInterfaceLanguage,
        userDatabaseLanguage,
    } = useUser(userId)

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
                <NoticeBox error title={i18n.t('Error fetching user')}>
                    {i18n.t('There was an error fetching this user.')}
                </NoticeBox>
            </CenteredContent>
        )
    }

    return (
        <>
            <PageHeader>{i18n.t('Edit user')}</PageHeader>
            <UserForm
                user={user}
                userInterfaceLanguage={userInterfaceLanguage || 'en'}
                userDatabaseLanguage={userDatabaseLanguage}
                submitButtonLabel={i18n.t('Save changes')}
            />
        </>
    )
}

EditUser.propTypes = {
    userId: PropTypes.string.isRequired,
}

export default EditUser

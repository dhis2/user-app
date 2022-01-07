import { useDataEngine } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
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
                'teiSearchOrganisationUnits[id,path]',
                'userCredentials[id,username,accountExpiry,lastLogin,externalAuth,userRoles[id,displayName],cogsDimensionConstraints[id,displayName,dimensionType],catDimensionConstraints[id,displayName,dimensionType],openId,ldapId,disabled]',
                'whatsApp',
                'facebookMessenger',
                'skype',
                'telegram',
                'twitter',
            ],
        },
    },
}

const useUser = userId => {
    const engine = useDataEngine()
    const { d2 } = useD2()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)

    const fetch = async () => {
        setLoading(true)
        setError(null)
        setData(null)
        try {
            const { user } = await engine.query(userQuery, {
                variables: { id: userId },
            })
            const { username } = user.userCredentials
            // Use d2 to fetch locales as userSettings endpoint sets the
            // content-type of its responses to application/json even when they
            // are invalid JSON, causing issues with the data engine
            const userInterfaceLanguage = await d2.Api.getApi().get(
                `/userSettings/keyUiLocale?user=${username}`
            )
            const userDatabaseLanguage = await d2.Api.getApi().get(
                `/userSettings/keyDbLocale?user=${username}`
            )
            setData({ user, userInterfaceLanguage, userDatabaseLanguage })
        } catch (error) {
            setError(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetch()
    }, [userId])

    return {
        loading,
        error,
        ...data,
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
            <h2>{i18n.t('Edit user')}</h2>
            <UserForm
                user={user}
                userInterfaceLanguage={userInterfaceLanguage}
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

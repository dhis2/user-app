import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import UserForm from '../components/UserForm'

const query = {
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

const EditUser = ({ userId }) => {
    // TODO: Reload current user if current user's ID matches userId prop
    const { called, loading, data, error, refetch } = useDataQuery(query, {
        lazy: true,
    })

    useEffect(() => {
        refetch({ id: userId })
    }, [userId])

    if (!called || loading) {
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

    const handleSubmit = () => {
        throw new Error('TODO')
    }

    // TODO: pass user interface language and user database language props. See
    // `getSelectedAndAvailableLocales` method of `api/index.js` for how to get
    // values from `userSettings` endpoint
    return (
        <>
            <h2>{i18n.t('Edit user')}</h2>
            <UserForm
                user={data.user}
                submitButtonLabel={i18n.t('Save changes')}
                onSubmit={handleSubmit}
            />
        </>
    )
}

EditUser.propTypes = {
    userId: PropTypes.string.isRequired,
}

export default EditUser

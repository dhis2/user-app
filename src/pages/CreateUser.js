import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import React from 'react'
import UserForm from '../components/UserForm/index.js'

const query = {
    userInterfaceLanguage: {
        resource: 'systemSettings/keyUiLocale',
    },
}

const CreateUser = () => {
    const { loading, error, data } = useDataQuery(query)

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error) {
        return (
            <NoticeBox
                error
                title={i18n.t('Error fetching interface language')}
            >
                {i18n.t(
                    'There was an error fetching the default interface language.'
                )}
            </NoticeBox>
        )
    }

    return (
        <>
            <h2>{i18n.t('New user')}</h2>
            <UserForm
                userInterfaceLanguage={data.userInterfaceLanguage.keyUiLocale}
                userDatabaseLanguage="USE_DB_LOCALE"
                submitButtonLabel={i18n.t('Create user')}
            />
        </>
    )
}

export default CreateUser

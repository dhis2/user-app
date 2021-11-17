import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { useDataQuery } from '@dhis2/app-runtime'
import UserForm from '../components/UserForm'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'

const query = {
    interfaceLanguages: {
        resource: 'locales/ui'
    },
    databaseLanguages: {
        resource: 'locales/db'
    },
    userInterfaceLanguage: {
        resource: 'systemSettings/keyUiLocale'
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
            <NoticeBox error={i18n.t('Error fetching languages')}>
                {i18n.t('There was an error fetching interface and database languages.')}
            </NoticeBox>
        )
    }

    const { interfaceLanguages, databaseLanguages, userInterfaceLanguage } = data
    const handleSubmit = () => {
        throw new Error('TODO')
    }

    return (
        <>
            <h2>{i18n.t('New user')}</h2>
            <UserForm
                submitButtonLabel={i18n.t('Create user')}
                interfaceLanguages={interfaceLanguages}
                userInterfaceLanguage={userInterfaceLanguage}
                databaseLanguages={databaseLanguages}
                onSubmit={handleSubmit}
            />
        </>
    )
}

export default CreateUser

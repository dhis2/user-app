import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    composeValidators,
    hasValue,
    dhis2Username,
    dhis2Password,
    email,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Form, {
    FormSection,
    TextField,
    SingleSelectField,
    CheckboxField,
} from './Form'

const query = {
    interfaceLanguages: {
        resource: 'locales/ui',
    },
    databaseLanguages: {
        resource: 'locales/db',
    },
}

const optionsFromLanguages = languages =>
    languages.map(({ name, locale }) => ({
        label: name,
        value: locale,
    }))

const createRepeatPasswordValidator = password => repeatPassword => {
    if (password !== repeatPassword) {
        return i18n.t('Passwords do not match')
    }
}

const UserForm = ({
    submitButtonLabel,
    onSubmit,
    user,
    userInterfaceLanguage,
    userDatabaseLanguage,
}) => {
    const { loading, error, data } = useDataQuery(query)
    const history = useHistory()

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error) {
        return (
            <NoticeBox error title={i18n.t('Error fetching languages')}>
                {i18n.t(
                    'There was an error fetching interface and database languages.'
                )}
            </NoticeBox>
        )
    }

    const { interfaceLanguages, databaseLanguages } = data

    // TODO: implement 'invite user' fields (and hide appropriate fields when selected)

    return (
        <Form
            submitButtonLabel={submitButtonLabel}
            onSubmit={onSubmit}
            onCancel={() => history.push('/users')}
        >
            {({ values }) => (
                <>
                    <FormSection title={i18n.t('Basic information')}>
                        <TextField
                            required
                            name="username"
                            label={i18n.t('Username')}
                            initialValue={user?.userCredentials.username}
                            autoComplete="new-password"
                            validate={composeValidators(
                                hasValue,
                                dhis2Username
                            )}
                        />
                        <TextField
                            name="email"
                            label={i18n.t('Email address')}
                            initialValue={user?.email}
                            validate={composeValidators(hasValue, email)}
                        />
                        <TextField
                            required
                            name="firstName"
                            label={i18n.t('First name')}
                            initialValue={user?.firstName}
                            validate={hasValue}
                        />
                        <TextField
                            required
                            name="surname"
                            label={i18n.t('Last name')}
                            initialValue={user?.surname}
                            validate={hasValue}
                        />
                        <SingleSelectField
                            required
                            name="interfaceLanguage"
                            label={i18n.t('Interface language')}
                            initialValue={userInterfaceLanguage}
                            options={optionsFromLanguages(interfaceLanguages)}
                            validate={hasValue}
                        />
                        <SingleSelectField
                            required
                            name="databaseLanguage"
                            label={i18n.t('Database language')}
                            initialValue={
                                userDatabaseLanguage || 'USE_DB_LOCALE'
                            }
                            options={[
                                {
                                    label: i18n.t(
                                        'Use database locale / no translation'
                                    ),
                                    value: 'USE_DB_LOCALE',
                                },
                                optionsFromLanguages(databaseLanguages),
                            ]}
                            validate={hasValue}
                        />
                        <CheckboxField
                            name="disabled"
                            label={i18n.t('Disable this user account')}
                            initialValue={user?.userCredentials.disabled}
                        />
                    </FormSection>
                    <FormSection
                        title={i18n.t('Security')}
                        description={i18n.t(
                            'Settings for how this user can log in.'
                        )}
                    >
                        <TextField
                            required
                            name="password"
                            label={i18n.t('Password')}
                            type="password"
                            initialValue=""
                            autoComplete="new-password"
                            validate={composeValidators(
                                hasValue,
                                dhis2Password
                            )}
                        />
                        <TextField
                            required
                            name="repeatPassword"
                            label={i18n.t('Retype password')}
                            type="password"
                            initialValue=""
                            autoComplete="new-password"
                            validate={composeValidators(
                                hasValue,
                                createRepeatPasswordValidator(values.password)
                            )}
                        />
                    </FormSection>
                </>
            )}
        </Form>
    )
}

UserForm.propTypes = {
    submitButtonLabel: PropTypes.string.isRequired,
    userInterfaceLanguage: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    user: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        surname: PropTypes.string.isRequired,
        userCredentials: PropTypes.shape({
            disabled: PropTypes.bool.isRequired,
            username: PropTypes.string.isRequired,
        }).isRequired,
        email: PropTypes.string,
    }),
    userDatabaseLanguage: PropTypes.string,
}

export default UserForm

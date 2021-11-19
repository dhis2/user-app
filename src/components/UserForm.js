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
    PasswordField,
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

    // TODO
    const emailConfigured = true

    return (
        <Form
            submitButtonLabel={submitButtonLabel}
            onSubmit={onSubmit}
            onCancel={() => history.push('/users')}
        >
            {({ values }) => (
                <>
                    {!user && emailConfigured && (
                        <FormSection title={i18n.t('Invite user')}>
                            <SingleSelectField
                                name="inviteUser"
                                label={i18n.t(
                                    'Create account or email invitation'
                                )}
                                initialValue="SET_PASSWORD"
                                options={[
                                    {
                                        label: i18n.t(
                                            'Create account with user details'
                                        ),
                                        value: 'SET_PASSWORD',
                                    },
                                    {
                                        label: i18n.t(
                                            'Email invitation to create account'
                                        ),
                                        value: 'INVITE_USER',
                                    },
                                ]}
                            />
                        </FormSection>
                    )}
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
                            required={values.inviteUser === 'INVITE_USER'}
                            name="email"
                            label={i18n.t('Email address')}
                            initialValue={user?.email}
                            validate={
                                values.inviteUser
                                    ? composeValidators(hasValue, email)
                                    : email
                            }
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
                    {values.inviteUser !== 'INVITE_USER' && (
                        <FormSection
                            title={i18n.t('Security')}
                            description={i18n.t(
                                'Settings for how this user can log in.'
                            )}
                        >
                            {!values.externalAuth && (
                                <>
                                    <PasswordField
                                        required={!user}
                                        name="password"
                                        label={i18n.t('Password')}
                                        helpText={i18n.t(
                                            'Minimum 8 characters, one uppercase and lowercase letter and one number'
                                        )}
                                        initialValue=""
                                        autoComplete="new-password"
                                        validate={
                                            user
                                                ? dhis2Password
                                                : composeValidators(
                                                      hasValue,
                                                      dhis2Password
                                                  )
                                        }
                                    />
                                    {/* TODO: rename label to 'Repeat password' (need to update transifex key) */}
                                    <PasswordField
                                        required={!user}
                                        name="repeatPassword"
                                        label={i18n.t('Retype password')}
                                        initialValue=""
                                        autoComplete="new-password"
                                        validate={
                                            user
                                                ? createRepeatPasswordValidator(
                                                      values.password
                                                  )
                                                : composeValidators(
                                                      hasValue,
                                                      createRepeatPasswordValidator(
                                                          values.password
                                                      )
                                                  )
                                        }
                                    />
                                </>
                            )}
                            <TextField
                                name="openId"
                                label={i18n.t('OIDC mapping value')}
                                helpText={i18n.t(
                                    'OpenID Connect mapping claim for your identity platform'
                                )}
                                initialValue=""
                                autoComplete="off"
                            />
                            <TextField
                                name="ldapId"
                                label={i18n.t('LDAP identifier')}
                                initialValue=""
                                autoComplete="off"
                            />
                            <CheckboxField
                                name="externalAuth"
                                label={i18n.t(
                                    'External authentication only (OpenID / LDAP)'
                                )}
                                initialValue={
                                    user?.userCredentials.externalAuth
                                }
                            />
                        </FormSection>
                    )}
                    <FormSection title={i18n.t('Contact details')}>
                        <TextField
                            name="phoneNumber"
                            label={i18n.t('Mobile phone number')}
                            initialValue={user?.phoneNumber}
                        />
                        <TextField
                            name="whatsApp"
                            label={i18n.t('WhatsApp')}
                            initialValue={user?.whatsApp}
                        />
                        <TextField
                            name="facebookMessenger"
                            label={i18n.t('Facebook Messenger')}
                            initialValue={user?.facebookMessenger}
                        />
                        <TextField
                            name="skype"
                            label={i18n.t('Skype')}
                            initialValue={user?.skype}
                        />
                        <TextField
                            name="telegram"
                            label={i18n.t('Telegram')}
                            initialValue={user?.telegram}
                        />
                        <TextField
                            name="twitter"
                            label={i18n.t('Twitter')}
                            initialValue={user?.twitter}
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
            externalAuth: PropTypes.bool.isRequired,
            username: PropTypes.string.isRequired,
        }).isRequired,
        email: PropTypes.string,
        facebookMessenger: PropTypes.string,
        phoneNumber: PropTypes.string,
        skype: PropTypes.string,
        telegram: PropTypes.string,
        twitter: PropTypes.string,
        whatsApp: PropTypes.string,
    }),
    userDatabaseLanguage: PropTypes.string,
}

export default UserForm

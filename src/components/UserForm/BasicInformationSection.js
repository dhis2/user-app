import i18n from '@dhis2/d2-i18n'
import { composeValidators, hasValue, email } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useForm } from 'react-final-form'
import {
    FormSection,
    TextField,
    EmailField,
    SingleSelectField,
    CheckboxField,
} from '../Form.js'
import { useUserNameValidator } from './validators.js'

const hasOption = (options, value) =>
    !!options.find((option) => option.value === value)

const INVITE_USER = 'INVITE_USER'

const BasicInformationSection = React.memo(
    ({
        user,
        inviteUser,
        userInterfaceLanguage,
        interfaceLanguageOptions,
        userDatabaseLanguage,
        databaseLanguageOptions,
        currentUserId,
    }) => {
        const { resetFieldState } = useForm()
        const validateUserName = useUserNameValidator({
            user,
            isInviteUser: inviteUser === INVITE_USER,
        })
        const userInterfaceLanguageInitialValue = hasOption(
            interfaceLanguageOptions,
            userInterfaceLanguage
        )
            ? userInterfaceLanguage
            : undefined
        const userDatabaseLanguageInitialValue = hasOption(
            databaseLanguageOptions,
            userDatabaseLanguage
        )
            ? userDatabaseLanguage
            : undefined

        useEffect(() => {
            resetFieldState('username')
            resetFieldState('email')
        }, [inviteUser, resetFieldState])

        return (
            <FormSection title={i18n.t('Basic information')}>
                <TextField
                    required={inviteUser !== INVITE_USER}
                    name="username"
                    label={i18n.t('Username')}
                    initialValue={user?.username}
                    disabled={!!user}
                    autoComplete="new-password"
                    validate={validateUserName}
                />
                <EmailField
                    required={inviteUser === INVITE_USER}
                    name="email"
                    label={i18n.t('Email address')}
                    initialValue={user?.email}
                    validate={
                        inviteUser === INVITE_USER
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
                    initialValue={userInterfaceLanguageInitialValue}
                    filterable
                    options={interfaceLanguageOptions}
                    validate={hasValue}
                />
                <SingleSelectField
                    required
                    name="databaseLanguage"
                    label={i18n.t('Database language')}
                    initialValue={
                        userDatabaseLanguageInitialValue || 'USE_DB_LOCALE'
                    }
                    filterable
                    options={[
                        {
                            label: i18n.t(
                                'Use database locale / no translation'
                            ),
                            value: 'USE_DB_LOCALE',
                        },
                        ...databaseLanguageOptions,
                    ]}
                    validate={hasValue}
                />
                <CheckboxField
                    name="disabled"
                    label={i18n.t('Disable this user account')}
                    initialValue={user?.disabled}
                    disabled={user && user.id === currentUserId}
                />
            </FormSection>
        )
    }
)

BasicInformationSection.propTypes = {
    currentUserId: PropTypes.string.isRequired,
    databaseLanguageOptions: PropTypes.array.isRequired,
    interfaceLanguageOptions: PropTypes.array.isRequired,
    userInterfaceLanguage: PropTypes.string.isRequired,
    inviteUser: PropTypes.string,
    user: PropTypes.object,
    userDatabaseLanguage: PropTypes.string,
}

export default BasicInformationSection

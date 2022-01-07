import { useConfig, useDataEngine } from '@dhis2/app-runtime'
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
import keyBy from 'lodash.keyby'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Form, {
    FormSection,
    TextField,
    PasswordField,
    DateField,
    SingleSelectField,
    CheckboxField,
    SearchableOrgUnitTreeField,
    TransferField,
} from '../Form'
import { getUserData } from './getUserData'
import { useFormData } from './useFormData'
import styles from './UserForm.module.css'
import {
    makeUniqueUsernameValidator,
    createRepeatPasswordValidator,
    hasSelectionValidator,
} from './validators'

const UserForm = ({
    submitButtonLabel,
    user,
    userInterfaceLanguage,
    userDatabaseLanguage,
}) => {
    const {
        systemInfo: { emailConfigured },
    } = useConfig()
    const history = useHistory()
    const engine = useDataEngine()
    const {
        loading,
        error,
        interfaceLanguageOptions,
        databaseLanguageOptions,
        userRoleOptions,
        userGroupOptions,
        dimensionConstraints,
        dimensionConstraintOptions,
    } = useFormData()

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error) {
        return (
            <NoticeBox error title={i18n.t('Error fetching form')}>
                {i18n.t('There was an error fetching this form.')}
            </NoticeBox>
        )
    }

    const handleSubmit = async ({ values }) => {
        // TODO: Reload current user if current user's ID matches userId prop
        const userData = getUserData({
            values,
            dimensionConstraintsById: keyBy(dimensionConstraints, 'id'),
            user,
        })
        try {
            if (user) {
                await engine.mutate({
                    resource: `users/${userData.id}`,
                    type: 'update',
                    data: userData,
                })
            } else {
                const inviteUser = values.inviteUser === 'INVITE_USER'
                await engine.mutate({
                    resource: inviteUser ? 'users/invite' : 'users',
                    type: 'create',
                    data: userData,
                })
            }

            if (values.interfaceLanguage !== userInterfaceLanguage) {
                await engine.mutate({
                    resource: 'userSettings/keyUiLocale',
                    type: 'create',
                    params: {
                        user: values.username,
                        value: values.interfaceLanguage,
                    },
                })
            }
            if (values.databaseLanguage !== userDatabaseLanguage) {
                if (values.databaseLanguage === 'USE_DB_LOCALE') {
                    await engine.mutate({
                        resource: 'userSettings/keyDbLocale',
                        type: 'delete',
                        params: {
                            user: values.username,
                        },
                    })
                } else {
                    await engine.mutate({
                        resource: 'userSettings/keyDbLocale',
                        type: 'create',
                        params: {
                            user: values.username,
                            value: values.databaseLanguage,
                        },
                    })
                }
            }

            // TODO: send user to user list page
        } catch (error) {
            // TODO: render error
        }
    }

    return (
        <Form
            submitButtonLabel={submitButtonLabel}
            onSubmit={handleSubmit}
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
                            disabled={!!user}
                            autoComplete="new-password"
                            validate={composeValidators(
                                hasValue,
                                dhis2Username,
                                makeUniqueUsernameValidator(engine)
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
                            filterable
                            options={interfaceLanguageOptions}
                            validate={hasValue}
                        />
                        <SingleSelectField
                            required
                            name="databaseLanguage"
                            label={i18n.t('Database language')}
                            initialValue={
                                userDatabaseLanguage || 'USE_DB_LOCALE'
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
                                    {user && (
                                        <CheckboxField
                                            name="changePassword"
                                            label={i18n.t(
                                                'Change user password'
                                            )}
                                            initialValue={false}
                                        />
                                    )}
                                    <div
                                        className={
                                            user
                                                ? styles.indentedPasswordFields
                                                : undefined
                                        }
                                    >
                                        <PasswordField
                                            required={!user}
                                            name="password"
                                            disabled={
                                                user && !values.changePassword
                                            }
                                            label={
                                                user
                                                    ? i18n.t('New password')
                                                    : i18n.t('Password')
                                            }
                                            helpText={i18n.t(
                                                'Minimum 8 characters, one uppercase and lowercase letter and one number'
                                            )}
                                            initialValue=""
                                            autoComplete="new-password"
                                            validate={
                                                user && !values.changePassword
                                                    ? dhis2Password
                                                    : composeValidators(
                                                          hasValue,
                                                          dhis2Password
                                                      )
                                            }
                                        />
                                        <PasswordField
                                            required={!user}
                                            name="repeatPassword"
                                            disabled={
                                                user && !values.changePassword
                                            }
                                            label={
                                                user
                                                    ? i18n.t(
                                                          'Repeat new password'
                                                      )
                                                    : i18n.t('Repeat password')
                                            }
                                            initialValue=""
                                            autoComplete="new-password"
                                            validate={
                                                user && !values.changePassword
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
                                    </div>
                                </>
                            )}
                            <DateField
                                name="accountExpiry"
                                label={i18n.t('Account expiration date')}
                                initialValue={
                                    user?.userCredentials.accountExpiry
                                }
                            />
                            <TextField
                                name="openId"
                                label={i18n.t('OIDC mapping value')}
                                helpText={i18n.t(
                                    'OpenID Connect mapping claim for your identity platform'
                                )}
                                initialValue={user?.userCredentials.openId}
                                autoComplete="off"
                            />
                            <TextField
                                name="ldapId"
                                label={i18n.t('LDAP identifier')}
                                initialValue={user?.userCredentials.ldapId}
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
                    <FormSection
                        title={i18n.t('Organisation unit access')}
                        description={i18n.t(
                            'Customise the organisation units this user has access to for searching, capturing and managing data.'
                        )}
                    >
                        <NoticeBox
                            title={i18n.t(
                                'Organisation unit selections are recursive'
                            )}
                            className={styles.organisationUnitsNoticeBox}
                        >
                            {i18n.t(
                                'Selecting a unit gives access to all units in its sub-hierarchy.'
                            )}
                        </NoticeBox>
                        <SearchableOrgUnitTreeField
                            required
                            name="organisationUnits"
                            orgUnitType="organisationUnits"
                            headerText={i18n.t('Data capture and maintenance')}
                            description={i18n.t(
                                'The organisation units that this user can enter and edit data for.'
                            )}
                            initialValue={user?.organisationUnits || []}
                            validate={hasSelectionValidator}
                        />
                        <SearchableOrgUnitTreeField
                            name="dataViewOrganisationUnits"
                            orgUnitType="dataViewOrganisationUnits"
                            headerText={i18n.t('Data output and analysis')}
                            description={i18n.t(
                                'The organisation units that this user can export and analyse.'
                            )}
                            initialValue={user?.dataViewOrganisationUnits || []}
                        />
                        <SearchableOrgUnitTreeField
                            name="teiSearchOrganisationUnits"
                            orgUnitType="teiSearchOrganisationUnits"
                            headerText={i18n.t('Search')}
                            description={i18n.t(
                                'The organisation that this user can search for and in.'
                            )}
                            initialValue={
                                user?.teiSearchOrganisationUnits || []
                            }
                        />
                    </FormSection>
                    <FormSection
                        title={i18n.t('Roles and groups')}
                        description={i18n.t(
                            'Manage what roles and groups this user is a member of.'
                        )}
                    >
                        <TransferField
                            required
                            name="userRoles"
                            leftHeader={i18n.t('Available user roles')}
                            rightHeader={i18n.t(
                                'User roles this user is assigned'
                            )}
                            options={userRoleOptions}
                            initialValue={
                                user?.userCredentials.userRoles.map(
                                    ({ id }) => id
                                ) || []
                            }
                        />
                        <TransferField
                            name="userGroups"
                            leftHeader={i18n.t('Available user groups')}
                            rightHeader={i18n.t(
                                'User groups this user is a member of'
                            )}
                            options={userGroupOptions}
                            initialValue={
                                user?.userGroups.map(({ id }) => id) || []
                            }
                        />
                    </FormSection>
                    <FormSection
                        title={i18n.t('Analytics dimension restrictions')}
                    >
                        <TransferField
                            name="dimensionConstraints"
                            leftHeader={i18n.t('Available restrictions')}
                            rightHeader={i18n.t('Selected restrictions')}
                            options={dimensionConstraintOptions}
                            initialValue={
                                user
                                    ? []
                                          .concat(
                                              user.userCredentials
                                                  .cogsDimensionConstraints,
                                              user.userCredentials
                                                  .catDimensionConstraints
                                          )
                                          .map(({ id }) => id)
                                    : []
                            }
                        />
                    </FormSection>
                </>
            )}
        </Form>
    )
}

const OrganisationUnitsPropType = PropTypes.arrayOf(
    PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
    }).isRequired
)

UserForm.propTypes = {
    submitButtonLabel: PropTypes.string.isRequired,
    userDatabaseLanguage: PropTypes.string.isRequired,
    userInterfaceLanguage: PropTypes.string.isRequired,
    user: PropTypes.shape({
        dataViewOrganisationUnits: OrganisationUnitsPropType.isRequired,
        firstName: PropTypes.string.isRequired,
        organisationUnits: OrganisationUnitsPropType.isRequired,
        surname: PropTypes.string.isRequired,
        teiSearchOrganisationUnits: OrganisationUnitsPropType.isRequired,
        userCredentials: PropTypes.shape({
            catDimensionConstraints: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                }).isRequired
            ).isRequired,
            cogsDimensionConstraints: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                }).isRequired
            ).isRequired,
            disabled: PropTypes.bool.isRequired,
            externalAuth: PropTypes.bool.isRequired,
            userRoles: PropTypes.arrayOf(
                PropTypes.shape({
                    displayName: PropTypes.string.isRequired,
                    id: PropTypes.string.isRequired,
                }).isRequired
            ).isRequired,
            username: PropTypes.string.isRequired,
            accountExpiry: PropTypes.string,
            ldapId: PropTypes.string,
            openId: PropTypes.string,
        }).isRequired,
        userGroups: PropTypes.arrayOf(
            PropTypes.shape({
                displayName: PropTypes.string.isRequired,
                id: PropTypes.string.isRequired,
            }).isRequired
        ).isRequired,
        email: PropTypes.string,
        facebookMessenger: PropTypes.string,
        phoneNumber: PropTypes.string,
        skype: PropTypes.string,
        telegram: PropTypes.string,
        twitter: PropTypes.string,
        whatsApp: PropTypes.string,
    }),
}

export default UserForm

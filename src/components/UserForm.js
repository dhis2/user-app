import { useDataQuery, useConfig } from '@dhis2/app-runtime'
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
import uniqBy from 'lodash.uniqby'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Form, {
    FormSection,
    TextField,
    PasswordField,
    SingleSelectField,
    CheckboxField,
    SearchableOrgUnitTreeField,
    TransferField,
} from './Form'
import styles from './UserForm.module.css'

const query = {
    interfaceLanguages: {
        resource: 'locales/ui',
    },
    databaseLanguages: {
        resource: 'locales/db',
    },
    userRoles: {
        resource: 'userRoles',
        params: {
            fields: ['id', 'displayName'],
            canIssue: true,
            paging: false,
        },
    },
    userGroups: {
        resource: 'userGroups',
        params: {
            fields: ['id', 'displayName'],
            paging: false,
        },
    },
    allDimensionConstraints: {
        resource: 'dimensions/constraints',
        params: {
            fields: ['id', 'name', 'dimensionType'],
            paging: false,
        },
    },
}

const optionsFromLanguages = languages =>
    // It is possible for the server to return duplicate entries for database locales
    uniqBy(
        languages.map(({ name, locale }) => ({
            label: name,
            value: locale,
        })),
        'value'
    )

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
    const {
        systemInfo: { emailConfigured },
    } = useConfig()
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
            <NoticeBox error title={i18n.t('Error fetching form')}>
                {i18n.t('There was an error fetching this form.')}
            </NoticeBox>
        )
    }

    const {
        interfaceLanguages,
        databaseLanguages,
        userRoles: { userRoles },
        userGroups: { userGroups },
        allDimensionConstraints: { dimensions: allDimensionConstraints },
    } = data

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
                            filterable
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
                            filterable
                            options={[
                                {
                                    label: i18n.t(
                                        'Use database locale / no translation'
                                    ),
                                    value: 'USE_DB_LOCALE',
                                },
                                ...optionsFromLanguages(databaseLanguages),
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
                            initiallySelected={user?.organisationUnits || []}
                        />
                        <SearchableOrgUnitTreeField
                            name="dataViewOrganisationUnits"
                            orgUnitType="dataViewOrganisationUnits"
                            headerText={i18n.t('Data output and analysis')}
                            description={i18n.t(
                                'The organisation units that this user can export and analyse.'
                            )}
                            initiallySelected={
                                user?.dataViewOrganisationUnits || []
                            }
                        />
                        <SearchableOrgUnitTreeField
                            name="teiSearchOrganisationUnits"
                            orgUnitType="teiSearchOrganisationUnits"
                            headerText={i18n.t('Search')}
                            description={i18n.t(
                                'The organisation that this user can search for and in.'
                            )}
                            initiallySelected={
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
                            name="userRoles"
                            leftHeader={i18n.t('Available user roles')}
                            rightHeader={i18n.t(
                                'User roles this user is assigned'
                            )}
                            options={userRoles.map(({ displayName, id }) => ({
                                label: displayName,
                                value: id,
                            }))}
                            selected={
                                values.userRoles ||
                                user?.userCredentials.userRoles.map(
                                    ({ id }) => id
                                ) ||
                                []
                            }
                        />
                        <TransferField
                            name="userGroups"
                            leftHeader={i18n.t('Available user groups')}
                            rightHeader={i18n.t(
                                'User groups this user is a member of'
                            )}
                            options={userGroups.map(({ displayName, id }) => ({
                                label: displayName,
                                value: id,
                            }))}
                            selected={
                                values.userGroups ||
                                user?.userGroups.map(({ id }) => id) ||
                                []
                            }
                        />
                    </FormSection>
                    <FormSection
                        title={i18n.t('Analytics dimension restrictions')}
                    >
                        <TransferField
                            name="allDimensionConstraints"
                            leftHeader={i18n.t('Available restrictions')}
                            rightHeader={i18n.t('Selected restrictions')}
                            options={allDimensionConstraints.map(
                                ({ name, id }) => ({
                                    label: name,
                                    value: id,
                                })
                            )}
                            selected={
                                values.allDimensionConstraints ||
                                (user
                                    ? []
                                          .concat(
                                              user.userCredentials
                                                  .cogsDimensionConstraints,
                                              user.userCredentials
                                                  .catDimensionConstraints
                                          )
                                          .map(({ id }) => id)
                                    : [])
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
    userInterfaceLanguage: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
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
    userDatabaseLanguage: PropTypes.string,
}

export default UserForm

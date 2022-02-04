import { useConfig, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, FinalForm } from '@dhis2/ui'
import { keyBy } from 'lodash-es'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Attributes from '../Attributes'
import Form, { FormSection } from '../Form'
import AnalyticsDimensionsRestrictionsSection from './AnalyticsDimensionRestrictionsSection'
import BasicInformationSection from './BasicInformationSection'
import ContactDetailsSection from './ContactDetailsSection'
import { getUserData } from './getUserData'
import InviteUserSection from './InviteUserSection'
import OrganisationUnitsSection from './OrganisationUnitsSection'
import RolesSection from './RolesSection'
import SecuritySection from './SecuritySection'
import { useFormData } from './useFormData'
import styles from './UserForm.module.css'

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
        attributes,
    } = useFormData()
    const handleSubmit = async values => {
        // TODO: Reload current user if current user's ID matches userId prop
        const userData = getUserData({
            values,
            dimensionConstraintsById: keyBy(dimensionConstraints, 'id'),
            user,
            attributes,
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

            history.push('/users')
        } catch (error) {
            return (
                error?.details?.response?.errorReports?.reduce(
                    (errors, error) => {
                        switch (error.errorCode) {
                            case 'E4049':
                                errors.username = i18n.t('Invalid username')
                                break
                            case 'E4027':
                                errors.whatsApp = i18n.t(
                                    'Invalid WhatsApp number'
                                )
                                break
                            default: {
                                const field =
                                    error.errorProperty || FinalForm.FORM_ERROR
                                errors[field] = error.message
                            }
                        }
                        return errors
                    },
                    {}
                ) || { [FinalForm.FORM_ERROR]: error }
            )
        }
    }

    return (
        <Form
            loading={loading}
            error={error}
            submitButtonLabel={submitButtonLabel}
            onSubmit={handleSubmit}
            onCancel={() => history.push('/users')}
        >
            {({ values, submitError }) => (
                <>
                    {submitError && (
                        <NoticeBox
                            error
                            title={
                                user
                                    ? i18n.t('Error updating user')
                                    : i18n.t('Error creating user')
                            }
                            className={styles.noticeBox}
                        >
                            {submitError.message}
                        </NoticeBox>
                    )}
                    <InviteUserSection
                        user={user}
                        emailConfigured={emailConfigured}
                    />
                    <BasicInformationSection
                        user={user}
                        inviteUser={values.inviteUser}
                        userInterfaceLanguage={userInterfaceLanguage}
                        interfaceLanguageOptions={interfaceLanguageOptions}
                        userDatabaseLanguage={userDatabaseLanguage}
                        databaseLanguageOptions={databaseLanguageOptions}
                    />
                    <SecuritySection
                        user={user}
                        inviteUser={values.inviteUser}
                        externalAuth={values.externalAuth}
                        changePassword={values.changePassword}
                        password={values.password}
                    />
                    <ContactDetailsSection user={user} />
                    <OrganisationUnitsSection user={user} />
                    <RolesSection
                        user={user}
                        userGroupOptions={userGroupOptions}
                        userRoleOptions={userRoleOptions}
                    />
                    <AnalyticsDimensionsRestrictionsSection
                        user={user}
                        dimensionConstraintOptions={dimensionConstraintOptions}
                    />
                    {attributes.length > 0 && (
                        <FormSection title={i18n.t('Attributes')}>
                            <Attributes
                                attributes={attributes}
                                attributeValues={user?.attributeValues}
                            />
                        </FormSection>
                    )}
                </>
            )}
        </Form>
    )
}

const OrganisationUnitsPropType = PropTypes.arrayOf(
    PropTypes.shape({
        id: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        displayName: PropTypes.string,
    }).isRequired
)

UserForm.propTypes = {
    submitButtonLabel: PropTypes.string.isRequired,
    userInterfaceLanguage: PropTypes.string.isRequired,
    user: PropTypes.shape({
        attributeValues: PropTypes.arrayOf(PropTypes.object.isRequired)
            .isRequired,
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
    userDatabaseLanguage: PropTypes.string,
}

export default UserForm

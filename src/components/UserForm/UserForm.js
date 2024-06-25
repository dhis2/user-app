import { useConfig, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, FinalForm } from '@dhis2/ui'
import { keyBy } from 'lodash-es'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useCurrentUser.js'
import { useReferrerInfo } from '../../providers/index.js'
import navigateTo from '../../utils/navigateTo.js'
import Attributes from '../Attributes/index.js'
import Form, { FormSection } from '../Form.js'
import AnalyticsDimensionsRestrictionsSection from './AnalyticsDimensionRestrictionsSection.js'
import BasicInformationSection from './BasicInformationSection.js'
import ContactDetailsSection from './ContactDetailsSection.js'
import { getJsonPatch } from './getJsonPatch.js'
import { getUserData } from './getUserData.js'
import InviteUserSection from './InviteUserSection.js'
import OrganisationUnitsSection from './OrganisationUnitsSection.js'
import RolesSection from './RolesSection.js'
import SecuritySection from './SecuritySection.js'
import { useFormData } from './useFormData.js'
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
    const [isInvite, setIsInvite] = useState(false)
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
        filledOrganisationUnitLevels,
        attributes,
    } = useFormData()
    const currentUser = useCurrentUser()
    const { referrer } = useReferrerInfo()
    const history = useHistory()
    const handleSubmit = async (values, form) => {
        const userData = getUserData({
            values,
            dimensionConstraintsById: keyBy(dimensionConstraints, 'id'),
            user,
            attributes,
        })

        try {
            if (user) {
                const dirtyFields = new Set(
                    Object.keys(form.getState().dirtyFields)
                )

                await engine.mutate({
                    resource: `users/${user.id}`,
                    type: 'json-patch',
                    data: getJsonPatch({
                        userData,
                        dirtyFields,
                    }),
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

            navigateTo('/users')
            if (user && user.id === currentUser.id) {
                currentUser.refresh()
            }
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
            submitButtonLabel={
                isInvite ? i18n.t('Send invite') : submitButtonLabel
            }
            cancelButtonLabel={
                isInvite
                    ? i18n.t('Cancel invite')
                    : i18n.t('Cancel without saving')
            }
            onSubmit={handleSubmit}
            onCancel={() => {
                if (referrer === 'users') {
                    history.goBack()
                } else {
                    navigateTo('/users')
                }
            }}
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
                        setIsInvite={setIsInvite}
                    />
                    <BasicInformationSection
                        user={user}
                        inviteUser={values.inviteUser}
                        userInterfaceLanguage={userInterfaceLanguage}
                        interfaceLanguageOptions={interfaceLanguageOptions}
                        userDatabaseLanguage={userDatabaseLanguage}
                        databaseLanguageOptions={databaseLanguageOptions}
                        currentUserId={currentUser.id}
                    />
                    <SecuritySection
                        user={user}
                        inviteUser={values.inviteUser}
                        externalAuth={values.externalAuth}
                        changePassword={values.changePassword}
                        password={values.password}
                    />
                    <ContactDetailsSection user={user} />
                    <OrganisationUnitsSection
                        user={user}
                        filledOrganisationUnitLevels={
                            filledOrganisationUnitLevels
                        }
                    />
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
                                entity={user}
                                entityType="users"
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
        dataViewOrganisationUnits: OrganisationUnitsPropType.isRequired,
        disabled: PropTypes.bool.isRequired,
        externalAuth: PropTypes.bool.isRequired,
        firstName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        organisationUnits: OrganisationUnitsPropType.isRequired,
        surname: PropTypes.string.isRequired,
        teiSearchOrganisationUnits: OrganisationUnitsPropType.isRequired,
        userGroups: PropTypes.arrayOf(
            PropTypes.shape({
                displayName: PropTypes.string.isRequired,
                id: PropTypes.string.isRequired,
            }).isRequired
        ).isRequired,
        userRoles: PropTypes.arrayOf(
            PropTypes.shape({
                displayName: PropTypes.string.isRequired,
                id: PropTypes.string.isRequired,
            }).isRequired
        ).isRequired,
        username: PropTypes.string.isRequired,
        accountExpiry: PropTypes.string,
        dataViewMaxOrganisationUnitLevel: PropTypes.number,
        email: PropTypes.string,
        facebookMessenger: PropTypes.string,
        ldapId: PropTypes.string,
        openId: PropTypes.string,
        phoneNumber: PropTypes.string,
        skype: PropTypes.string,
        telegram: PropTypes.string,
        twitter: PropTypes.string,
        whatsApp: PropTypes.string,
    }),
    userDatabaseLanguage: PropTypes.string,
}

export default UserForm

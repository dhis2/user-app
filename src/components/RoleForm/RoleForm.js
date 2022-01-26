import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, composeValidators, hasValue, FinalForm } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { groupAuthorities } from '../AuthorityEditor/useAuthorities/groupAuthorities.js'
import Form, { FormSection, TextField, TransferField } from '../Form'
// import { getRoleData } from './getRoleData'
import styles from './RoleForm.module.css'
import { useFormData } from './useFormData'
import { useDebouncedUniqueRoleNameValidator } from './validators'

const Role = ({ submitButtonLabel, role }) => {
    const history = useHistory()
    const engine = useDataEngine()
    const debouncedUniqueRoleNameValidator =
        useDebouncedUniqueRoleNameValidator({ engine, roleName: role?.name })
    const {
        loading,
        error,
        metadataAuthorities,
        appAuthorityOptions,
        trackerAuthorityOptions,
        importExportAuthorityOptions,
        systemAuthorityOptions,
    } = useFormData()
    const groupedAuthorities =
        role && groupAuthorities(role.authorities.map(id => ({ id })))
    const handleSubmit = async values => {
        const roleData = getRoleData({ values, role })

        try {
            if (role) {
                await engine.mutate({
                    resource: `userRoles/${role.id}`,
                    type: 'update',
                    data: roleData,
                })
            } else {
                await engine.mutate({
                    resource: 'userRoles',
                    type: 'create',
                    data: roleData,
                })
            }

            history.push('/user-roles')
        } catch (error) {
            return (
                error?.details?.response?.errorReports?.reduce(
                    (errors, error) => {
                        const field =
                            error.errorProperty || FinalForm.FORM_ERROR
                        errors[field] = error.message
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
            onCancel={() => history.push('/user-roles')}
        >
            {({ submitError }) => (
                <>
                    {submitError && (
                        <NoticeBox
                            error
                            title={
                                role
                                    ? i18n.t('Error updating role')
                                    : i18n.t('Error creating role')
                            }
                            className={styles.noticeBox}
                        >
                            {submitError.message}
                        </NoticeBox>
                    )}
                    <FormSection title={i18n.t('Basic information')}>
                        <TextField
                            required
                            name="name"
                            label={i18n.t('Name')}
                            initialValue={role?.name}
                            validate={composeValidators(
                                hasValue,
                                debouncedUniqueRoleNameValidator
                            )}
                        />
                        <TextField
                            name="description"
                            label={i18n.t('Description')}
                            helpText={i18n.t(
                                'Short, clear description of what this role is for.'
                            )}
                            initialValue={role?.description}
                        />
                    </FormSection>
                    <FormSection
                        title={i18n.t('Metadata authorities')}
                        description={i18n.t(
                            'Set what metadata access this role has.'
                        )}
                    >
                        <p>TODO</p>
                    </FormSection>
                    <FormSection
                        title={i18n.t('Other authorities')}
                        description={i18n.t(
                            'Manage access to apps, tracker, data import/export and system settings.'
                        )}
                    >
                        <TransferField
                            name="appAuthorities"
                            leftHeader={i18n.t('Available app authorities')}
                            rightHeader={i18n.t('Selected app authorities')}
                            options={appAuthorityOptions}
                            initialValue={
                                groupedAuthorities?.apps.items.map(
                                    ({ id }) => id
                                ) || []
                            }
                        />
                        <TransferField
                            name="trackerAuthorities"
                            leftHeader={i18n.t('Available tracker authorities')}
                            rightHeader={i18n.t('Selected tracker authorities')}
                            options={trackerAuthorityOptions}
                            initialValue={
                                groupedAuthorities?.tracker.items.map(
                                    ({ id }) => id
                                ) || []
                            }
                        />
                        <TransferField
                            name="importExportAuthorities"
                            leftHeader={i18n.t(
                                'Available import/export authorities'
                            )}
                            rightHeader={i18n.t(
                                'Selected import/export authorities'
                            )}
                            options={importExportAuthorityOptions}
                            initialValue={
                                groupedAuthorities?.importExport.items.map(
                                    ({ id }) => id
                                ) || []
                            }
                        />
                        <TransferField
                            name="systemAuthorities"
                            leftHeader={i18n.t('Available system authorities')}
                            rightHeader={i18n.t('Selected system authorities')}
                            options={systemAuthorityOptions}
                            initialValue={
                                groupedAuthorities?.system.items.map(
                                    ({ id }) => id
                                ) || []
                            }
                        />
                    </FormSection>
                </>
            )}
        </Form>
    )
}

Role.propTypes = {
    submitButtonLabel: PropTypes.string.isRequired,
    role: PropTypes.shape({
        authorities: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
    }),
}

export default Role

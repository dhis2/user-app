import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, composeValidators, hasValue, FinalForm } from '@dhis2/ui'
import { flatMap } from 'lodash-es'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Form, { FormSection, TextField, TransferField } from '../Form'
import { getRoleData } from './getRoleData'
import MetadataAuthoritiesTableField from './MetadataAuthoritiesTableField'
import styles from './RoleForm.module.css'
import { useFormData } from './useFormData'
import { useDebouncedUniqueRoleNameValidator } from './validators'

const getRoleAuthorityIDs = ({
    role,
    metadataAuthorities,
    appAuthorityOptions,
    trackerAuthorityOptions,
    importExportAuthorityOptions,
    systemAuthorityOptions,
}) => {
    const metadataIDs = new Set(
        flatMap(metadataAuthorities, authority => [
            authority.addUpdatePublic.id,
            authority.addUpdatePrivate.id,
            authority.delete.id,
            authority.externalAccess.id,
        ]).filter(authID => authID !== undefined)
    )
    const appIDs = new Set(appAuthorityOptions.map(({ value }) => value))
    const trackerIDs = new Set(
        trackerAuthorityOptions.map(({ value }) => value)
    )
    const importExportIDs = new Set(
        importExportAuthorityOptions.map(({ value }) => value)
    )
    const systemIDs = new Set(systemAuthorityOptions.map(({ value }) => value))

    return {
        metadata: role.authorities.filter(id => metadataIDs.has(id)),
        apps: role.authorities.filter(id => appIDs.has(id)),
        tracker: role.authorities.filter(id => trackerIDs.has(id)),
        importExport: role.authorities.filter(id => importExportIDs.has(id)),
        system: role.authorities.filter(id => systemIDs.has(id)),
    }
}

const RoleForm = ({ submitButtonLabel, role }) => {
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
    const roleAuthorityIDs =
        role &&
        !loading &&
        !error &&
        getRoleAuthorityIDs({
            role,
            metadataAuthorities,
            appAuthorityOptions,
            trackerAuthorityOptions,
            importExportAuthorityOptions,
            systemAuthorityOptions,
        })
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
                        <MetadataAuthoritiesTableField
                            name="metadataAuthorities"
                            metadataAuthorities={metadataAuthorities}
                            initialValue={roleAuthorityIDs?.metadata}
                        />
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
                            initialValue={roleAuthorityIDs?.apps || []}
                        />
                        <TransferField
                            name="trackerAuthorities"
                            leftHeader={i18n.t('Available tracker authorities')}
                            rightHeader={i18n.t('Selected tracker authorities')}
                            options={trackerAuthorityOptions}
                            initialValue={roleAuthorityIDs?.tracker || []}
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
                            initialValue={roleAuthorityIDs?.importExport || []}
                        />
                        <TransferField
                            name="systemAuthorities"
                            leftHeader={i18n.t('Available system authorities')}
                            rightHeader={i18n.t('Selected system authorities')}
                            options={systemAuthorityOptions}
                            initialValue={roleAuthorityIDs.system || []}
                        />
                    </FormSection>
                </>
            )}
        </Form>
    )
}

RoleForm.propTypes = {
    submitButtonLabel: PropTypes.string.isRequired,
    role: PropTypes.shape({
        authorities: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
    }),
}

export default RoleForm

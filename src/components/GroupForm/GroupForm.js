import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, composeValidators, hasValue, FinalForm } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Form, { FormSection, TextField, TransferField } from '../Form'
import { getGroupData } from './getGroupData'
import styles from './GroupForm.module.css'
import { useFormData } from './useFormData'
import { useDebouncedUniqueGroupNameValidator } from './validators'

const GroupForm = ({ submitButtonLabel, group }) => {
    const history = useHistory()
    const engine = useDataEngine()
    const debouncedUniqueGroupNameValidator =
        useDebouncedUniqueGroupNameValidator({ engine, groupName: group?.name })
    const { loading, error, userGroupOptions } = useFormData()
    const handleSubmit = async values => {
        const groupData = getGroupData({ values, group })

        try {
            if (group) {
                await engine.mutate({
                    resource: `userGroups/${group.id}?mergeMode=MERGE`,
                    type: 'update',
                    data: groupData,
                })
            } else {
                await engine.mutate({
                    resource: 'userGroups',
                    type: 'create',
                    data: groupData,
                })
            }

            history.push('/user-groups')
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
            onCancel={() => history.push('/user-groups')}
        >
            {({ submitError }) => (
                <>
                    {submitError && (
                        <NoticeBox
                            error
                            title={
                                group
                                    ? i18n.t('Error updating group')
                                    : i18n.t('Error creating group')
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
                            initialValue={group?.name}
                            validate={composeValidators(
                                hasValue,
                                debouncedUniqueGroupNameValidator
                            )}
                        />
                        <TextField
                            name="code"
                            label={i18n.t('Code')}
                            helpText={i18n.t('Used in analytics reports.')}
                            initialValue={group?.code}
                        />
                    </FormSection>
                    <FormSection
                        title={i18n.t('User management')}
                        description={i18n.t(
                            'Add or remove users from this group.'
                        )}
                    >
                        {/* TODO: https://github.com/dhis2/user-app/pull/854 */}
                        <p>
                            {i18n.t(
                                'To add a user to this group, go to the User section and edit the user group settings for a specific user.'
                            )}
                        </p>
                    </FormSection>
                    <FormSection
                        title={i18n.t('User group management')}
                        description={i18n.t(
                            'This group can manage other user groups. Add managed user groups below.'
                        )}
                    >
                        <TransferField
                            name="managedGroups"
                            leftHeader={i18n.t('Available user groups')}
                            rightHeader={i18n.t('Managed user groups')}
                            options={userGroupOptions}
                            initialValue={
                                group?.managedGroups.map(({ id }) => id) || []
                            }
                        />
                    </FormSection>
                </>
            )}
        </Form>
    )
}

GroupForm.propTypes = {
    submitButtonLabel: PropTypes.string.isRequired,
    group: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        code: PropTypes.string,
        managedGroups: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
            })
        ),
    }),
}

export default GroupForm
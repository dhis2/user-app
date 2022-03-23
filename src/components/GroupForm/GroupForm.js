import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, FinalForm } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import Attributes from '../Attributes'
import Form, { FormSection } from '../Form'
import BasicInformationSection from './BasicInformationSection.js'
import { getGroupData } from './getGroupData'
import styles from './GroupForm.module.css'
import { useFormData } from './useFormData'
import UserGroupManagementSection from './UserGroupManagementSection.js'
import UserManagementSection from './UserManagementSection.js'

const GroupForm = ({ submitButtonLabel, group }) => {
    const history = useHistory()
    const engine = useDataEngine()
    const { loading, error, userGroupOptions, attributes } = useFormData()
    const { currentUser, refreshCurrentUser } = useCurrentUser()
    const handleSubmit = async values => {
        const groupData = getGroupData({ values, group, attributes })

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

            if (values.members.length > 0) {
                const additions = []
                const deletions = []

                for (const { action, userId } of values.members) {
                    if (action === 'ADD') {
                        additions.push({ id: userId })
                    } else if (action === 'REMOVE') {
                        deletions.push({ id: userId })
                    }
                }

                await engine.mutate({
                    resource: `userGroups/${group.id}/users`,
                    type: 'create',
                    data: {
                        additions,
                        deletions,
                    },
                })
            }

            history.goBack()
            if (group && currentUser.userGroupIds.includes(group.id)) {
                refreshCurrentUser()
            }
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
                    <BasicInformationSection group={group} />
                    <UserManagementSection group={group} />
                    <UserGroupManagementSection
                        group={group}
                        userGroupOptions={userGroupOptions}
                    />
                    {attributes.length > 0 && (
                        <FormSection title={i18n.t('Attributes')}>
                            <Attributes
                                attributes={attributes}
                                attributeValues={group?.attributeValues}
                                entity={group}
                                entityType="userGroups"
                            />
                        </FormSection>
                    )}
                </>
            )}
        </Form>
    )
}

GroupForm.propTypes = {
    submitButtonLabel: PropTypes.string.isRequired,
    group: PropTypes.shape({
        attributeValues: PropTypes.arrayOf(PropTypes.object.isRequired)
            .isRequired,
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

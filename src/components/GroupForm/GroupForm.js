import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, FinalForm } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useCurrentUser.js'
import { useReferrerInfo } from '../../providers/index.js'
import navigateTo from '../../utils/navigateTo.js'
import Attributes from '../Attributes/index.js'
import Form, { FormSection } from '../Form.js'
import BasicInformationSection from './BasicInformationSection.js'
import {
    createPostRequestBody,
    createJsonPatchRequestBody,
} from './createRequestBody.js'
import styles from './GroupForm.module.css'
import { useFormData } from './useFormData.js'
import UserGroupManagementSection from './UserGroupManagementSection.js'
import UserManagementSection from './UserManagementSection.js'

const GroupForm = ({ submitButtonLabel, group }) => {
    const engine = useDataEngine()
    const { loading, error, userGroupOptions, attributes } = useFormData()
    const currentUser = useCurrentUser()
    const { referrer } = useReferrerInfo()
    const history = useHistory()
    const handleSubmit = async (values, form) => {
        try {
            if (group) {
                await engine.mutate({
                    resource: 'userGroups',
                    id: group.id,
                    type: 'json-patch',
                    data: createJsonPatchRequestBody({
                        values,
                        attributes,
                        dirtyFields: form.getState().dirtyFields,
                    }),
                })
            } else {
                await engine.mutate({
                    resource: 'userGroups',
                    type: 'create',
                    data: createPostRequestBody({ values, attributes }),
                })
            }

            navigateTo('/user-groups')
            if (group && currentUser.userGroupIds.includes(group.id)) {
                currentUser.refresh()
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
            onCancel={() => {
                if (referrer === 'user-groups') {
                    history.goBack()
                } else {
                    navigateTo('/user-groups')
                }
            }}
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

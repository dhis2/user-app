import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Details, { Section, Field } from '../../components/Details/index.js'
import useGroup from './use-group.js'

const GroupDetails = ({ groupId }) => {
    const { loading, error, group } = useGroup(groupId)
    const history = useHistory()

    const handleEditGroup = () => {
        history.push(`/user-groups/edit/${groupId}`)
    }

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox error title={i18n.t('Error fetching group')}>
                    {i18n.t('There was an error fetching this group.')}
                </NoticeBox>
            </CenteredContent>
        )
    }

    return (
        <Details title={group.displayName}>
            {!group?.access?.write && (
                <NoticeBox warn>
                    {i18n.t('You do not have access to edit this user group')}
                </NoticeBox>
            )}
            <br />
            <Section
                title={i18n.t('Overview')}
                action={
                    group.access.update ? (
                        <Button small onClick={handleEditGroup}>
                            {i18n.t('Edit user group')}
                        </Button>
                    ) : null
                }
            >
                <Field label={i18n.t('ID')} value={group.id} />
            </Section>
        </Details>
    )
}

GroupDetails.propTypes = {
    groupId: PropTypes.string.isRequired,
}

export default GroupDetails

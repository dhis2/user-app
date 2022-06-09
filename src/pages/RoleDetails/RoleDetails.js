import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Details, { Section, Field } from '../../components/Details/index.js'
import useRole from './use-role.js'

const RoleDetails = ({ roleId }) => {
    const { loading, error, role } = useRole(roleId)
    const history = useHistory()

    const handleEditRole = () => {
        history.push(`/user-roles/edit/${roleId}`)
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
                <NoticeBox error title={i18n.t('Error fetching role')}>
                    {i18n.t('There was an error fetching this role.')}
                </NoticeBox>
            </CenteredContent>
        )
    }

    return (
        <Details title={role.displayName}>
            <Section
                title={i18n.t('Overview')}
                action={
                    role.access.update ? (
                        <Button small onClick={handleEditRole}>
                            {i18n.t('Edit user role')}
                        </Button>
                    ) : null
                }
            >
                <Field label={i18n.t('ID')} value={role.id} />
            </Section>
        </Details>
    )
}

RoleDetails.propTypes = {
    roleId: PropTypes.string.isRequired,
}

export default RoleDetails

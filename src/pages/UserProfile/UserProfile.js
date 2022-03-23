import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    Tooltip,
    Tag,
    Button,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import api from '../../api'
import Details, { Section, Field } from '../../components/Details'
import parseDateFromUTCString from '../../utils/parseDateFromUTCString'
import useUser from './use-user'
import styles from './UserProfile.module.css'

const genders = {
    gender_male: i18n.t('Male'),
    gender_female: i18n.t('Female'),
    gender_other: i18n.t('Other'),
}

const DateTimeValue = ({ dateTime }) => (
    <Tooltip content={dateTime}>
        {parseDateFromUTCString(dateTime, { includeTime: true })}
    </Tooltip>
)

DateTimeValue.propTypes = {
    dateTime: PropTypes.string.isRequired,
}

const Permissions = ({ displayNames }) => (
    <div className={styles.permissions}>
        {displayNames.map(displayName => (
            <Tag key={displayName}>{displayName}</Tag>
        ))}
    </div>
)

Permissions.propTypes = {
    displayNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

const UserProfile = ({ userId }) => {
    const { loading, error, user } = useUser(userId)
    const history = useHistory()

    const handleEditUser = () => {
        history.push(`/users/edit/${userId}`)
    }
    const handleMessageUser = () => {
        location.href = `${api.getContextPath()}/dhis-web-messaging/#/PRIVATE/create/${userId}`
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
                <NoticeBox error title={i18n.t('Error fetching user')}>
                    {i18n.t('There was an error fetching this user.')}
                </NoticeBox>
            </CenteredContent>
        )
    }

    return (
        <Details title={user.displayName}>
            <Section
                title={i18n.t('Overview')}
                action={
                    user.access.update ? (
                        <Button small onClick={handleEditUser}>
                            {i18n.t('Edit user')}
                        </Button>
                    ) : null
                }
            >
                <Field label={i18n.t('ID')} value={user.id} />
                <Field label={i18n.t('Username')} value={user.username} />
                <Field
                    label={i18n.t('Last login')}
                    value={<DateTimeValue dateTime={user.lastLogin} />}
                />
                <Field
                    label={i18n.t('Created')}
                    value={<DateTimeValue dateTime={user.created} />}
                />
                <Field label={i18n.t('First name')} value={user.firstName} />
                <Field label={i18n.t('Last name')} value={user.surname} />
            </Section>
            <Section
                title={i18n.t('Contact')}
                action={
                    <Button small onClick={handleMessageUser}>
                        {i18n.t('Send message')}
                    </Button>
                }
            >
                <Field label={i18n.t('E-mail')} value={user.email} />
                <Field
                    label={i18n.t('Mobile phone number')}
                    value={user.phoneNumber}
                />
            </Section>
            <Section title={i18n.t('Permissions')}>
                <Field
                    label={i18n.t('Organisations units')}
                    value={
                        <Permissions
                            displayNames={user.organisationUnits.map(
                                ou => ou.displayName
                            )}
                        />
                    }
                />
                <Field
                    label={i18n.t('User units')}
                    value={
                        <Permissions
                            displayNames={user.userRoles.map(
                                role => role.displayName
                            )}
                        />
                    }
                />
            </Section>
            <Section title={i18n.t('Profile')}>
                <Field
                    label={i18n.t('Introduction')}
                    value={user.introduction}
                />
                <Field label={i18n.t('Job title')} value={user.jobTitle} />
                <Field label={i18n.t('Works at')} value={user.employer} />
                <Field
                    label={i18n.t('Gender')}
                    value={genders[user.gender] || user.gender}
                />
                <Field label={i18n.t('Speaks')} value={user.languages} />
                <Field label={i18n.t('Nationality')} value={user.nationality} />
                <Field label={i18n.t('Education')} value={user.education} />
                <Field label={i18n.t('Interests')} value={user.interests} />
                <Field
                    label={i18n.t('Birthday')}
                    value={parseDateFromUTCString(user.birthday)}
                />
            </Section>
        </Details>
    )
}

UserProfile.propTypes = {
    userId: PropTypes.string.isRequired,
}

export default UserProfile

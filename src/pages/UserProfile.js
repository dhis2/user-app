import { useDataQuery } from '@dhis2/app-runtime'
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
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../api'
import parseDateFromUTCString from '../utils/parseDateFromUTCString'
import styles from './UserProfile.module.css'

// TODO:
// - 'Send message' button
// - 'Edit <whatever>' button (check if user has permissions first)
// - Show display name at top but don't need to repeat it
// - Show username, ID, last login, created at, first name and last name at top,
//   then 'contact' section with email, phone number and 'send message' button,
//   then 'permissions' section with org units and user roles, finally 'profile' section with other info
// - For gender, need to remove 'gender_' prefix

const query = {
    user: {
        resource: 'users',
        id: ({ id }) => id,
        params: {
            fields: [
                'access',

                'id',
                'username',
                'displayName',
                'lastLogin',
                'created',
                'firstName',
                'surname',

                'email',
                'phoneNumber',

                'organisationUnits[displayName]',
                'userRoles[displayName]',

                'introduction',
                'jobTitle',
                'employer',
                'gender',
                'languages',
                'education',
                'interests',
                'nationality',
                'birthday',
            ],
        },
    },
}

const useUser = userId => {
    const { called, loading, error, data, refetch } = useDataQuery(query, {
        lazy: true,
    })

    useEffect(() => {
        refetch({ id: userId })
    }, [userId])

    return {
        loading: !called || loading,
        error,
        user: data?.user,
    }
}

const Section = ({ title, children, action }) => (
    <section className={styles.section}>
        <header className={styles.sectionHeader}>
            <h3 className={styles.sectionHeaderTitle}>{title}</h3>
            <div>{action}</div>
        </header>
        {children}
    </section>
)

Section.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.node.isRequired,
    action: PropTypes.node,
}

const Field = ({ label, value }) => (
    <div className={styles.field}>
        <div className={styles.fieldLabel}>{label}</div>
        <div>{value}</div>
    </div>
)

Field.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.node,
}

const DateTimeValue = ({ dateTime }) => (
    <Tooltip content={dateTime}>
        {parseDateFromUTCString(dateTime, { includeTime: true })}
    </Tooltip>
)

DateTimeValue.propTypes = {
    dateTime: PropTypes.string.isRequired,
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
        <>
            <h2>{user.displayName}</h2>
            <div className={styles.container}>
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
                    <Field
                        label={i18n.t('First name')}
                        value={user.firstName}
                    />
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
                        value={user.organisationUnits.map(ou => (
                            <Tag
                                key={ou.displayName}
                                className={styles.permissionTag}
                            >
                                {ou.displayName}
                            </Tag>
                        ))}
                    />
                    <Field
                        label={i18n.t('User units')}
                        value={user.userRoles.map(role => (
                            <Tag
                                key={role.displayName}
                                className={styles.permissionTag}
                            >
                                {role.displayName}
                            </Tag>
                        ))}
                    />
                </Section>
                <Section title={i18n.t('Profile')}>
                    <Field
                        label={i18n.t('Introduction')}
                        value={user.introduction}
                    />
                    <Field label={i18n.t('Job title')} value={user.jobTitle} />
                    <Field label={i18n.t('Works at')} value={user.employer} />
                    <Field label={i18n.t('Gender')} value={user.gender} />
                    <Field label={i18n.t('Speaks')} value={user.languages} />
                    <Field
                        label={i18n.t('Nationality')}
                        value={user.nationality}
                    />
                    <Field label={i18n.t('Education')} value={user.education} />
                    <Field label={i18n.t('Interests')} value={user.interests} />
                    <Field
                        label={i18n.t('Birthday')}
                        value={parseDateFromUTCString(user.birthday)}
                    />
                </Section>
            </div>
        </>
    )
}

UserProfile.propTypes = {
    userId: PropTypes.string.isRequired,
}

export default UserProfile

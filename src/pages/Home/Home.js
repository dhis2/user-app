import i18n from '@dhis2/d2-i18n'
import { IconAdd16, IconList16 } from '@dhis2/ui'
import React from 'react'
import { useCurrentUser } from '../../providers/index.js'
import styles from './Home.module.css'
import SectionCard from './SectionCard.js'

const getActions = (path, canCreate) => {
    const listAction = {
        label: i18n.t('List'),
        icon: IconList16,
        to: path,
    }
    const addAction = {
        label: i18n.t('Add'),
        icon: IconAdd16,
        to: `${path}/new`,
    }
    return canCreate ? [addAction, listAction] : [listAction]
}

const Home = () => {
    const {
        hasUserSectionAccess,
        hasRoleSectionAccess,
        hasGroupSectionAccess,
        canCreateUsers,
        canCreateGroups,
        canCreateRoles,
    } = useCurrentUser()

    return (
        <div className={styles.grid}>
            {hasUserSectionAccess && (
                <SectionCard
                    titleText={i18n.t('User')}
                    bodyText={i18n.t('Create, modify, view and delete Users')}
                    actions={getActions('/users', canCreateUsers)}
                />
            )}
            {hasRoleSectionAccess && (
                <SectionCard
                    titleText={i18n.t('User role')}
                    bodyText={i18n.t(
                        'Create, modify, view and delete User Roles'
                    )}
                    actions={getActions('/user-roles', canCreateGroups)}
                />
            )}
            {hasGroupSectionAccess && (
                <SectionCard
                    titleText={i18n.t('User group')}
                    bodyText={i18n.t(
                        'Create, modify, view and delete User Groups'
                    )}
                    actions={getActions('/user-groups', canCreateRoles)}
                />
            )}
        </div>
    )
}

export default Home

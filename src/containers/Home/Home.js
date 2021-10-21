import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, IconAdd16, IconList16 } from '@dhis2/ui'
import React from 'react'
import { getSections } from '../../constants/routeConfig'
import styles from './Home.module.css'
import SectionCard from './SectionCard'

const Home = () => {
    const { d2 } = useD2()
    const { currentUser, models } = d2
    // Only show menu items for which the user has either the "add" or "delete" authority
    const accessibleSections = getSections()
        .map(section => {
            const sectionModel = models[section.entityType]
            return {
                ...section,
                canCreate: currentUser.canCreate(sectionModel),
                canDelete: currentUser.canDelete(sectionModel),
            }
        })
        .filter(section => section.canCreate || section.canDelete)

    if (accessibleSections.length === 0) {
        return (
            <div>
                <NoticeBox error title={i18n.t('Insufficient permissions')}>
                    {i18n.t(
                        'You do not have access to any section of the DHIS 2 User Management App'
                    )}
                </NoticeBox>
            </div>
        )
    }

    return (
        <div className={styles.grid}>
            {accessibleSections.map(section => {
                const listAction = {
                    label: i18n.t('List'),
                    icon: IconList16,
                    to: section.path,
                }
                const addAction = {
                    label: i18n.t('Add'),
                    icon: IconAdd16,
                    to: `${section.path}/new`,
                }
                const actions = section.canCreate
                    ? [addAction, listAction]
                    : [listAction]

                return (
                    <SectionCard
                        key={section.label}
                        titleText={section.label}
                        bodyText={section.description}
                        actions={actions}
                    />
                )
            })}
        </div>
    )
}

export default Home

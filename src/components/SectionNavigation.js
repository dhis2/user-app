import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser.js'
import CreateGroup from '../pages/CreateGroup.js'
import CreateRole from '../pages/CreateRole.js'
import CreateUser from '../pages/CreateUser.js'
import EditGroup from '../pages/EditGroup.js'
import EditRole from '../pages/EditRole.js'
import EditUser from '../pages/EditUser.js'
import GroupDetails from '../pages/GroupDetails/index.js'
import GroupList from '../pages/GroupList/index.js'
import Home from '../pages/Home/index.js'
import RoleDetails from '../pages/RoleDetails/index.js'
import RoleList from '../pages/RoleList/index.js'
import UserList from '../pages/UserList/index.js'
import UserProfile from '../pages/UserProfile/index.js'
import navigateTo from '../utils/navigateTo.js'
import styles from './SectionNavigation.module.css'
import { SideNav, NavItem } from './SideNav.js'

const USER = 'user'
const USER_ROLE = 'userRole'
const USER_GROUP = 'userGroup'

const SectionNavigation = () => {
    const { pathname } = useLocation()
    const {
        hasAppAccess,
        hasUserSectionAccess,
        hasGroupSectionAccess,
        hasRoleSectionAccess,
    } = useCurrentUser()
    const isUserSection = useRouteMatch('/users')
    const isRoleSection = useRouteMatch('/user-roles')
    const isGroupSection = useRouteMatch('/user-groups')
    const hasAccessToCurrentSection =
        hasAppAccess &&
        (pathname === '/' ||
            (isUserSection && hasUserSectionAccess) ||
            (isRoleSection && hasRoleSectionAccess) ||
            (isGroupSection && hasGroupSectionAccess))

    useEffect(() => {
        // Navigate home if the current user has edited a setting that restricts
        // them from an active section (i.e. adjusting their own user role so
        // they cannot edit user roles anymore)
        // Invalid paths will also be redirected to home
        if (pathname !== '/' && !hasAccessToCurrentSection) {
            navigateTo('/')
        }
    }, [hasAccessToCurrentSection, pathname])

    if (
        !hasUserSectionAccess &&
        !hasGroupSectionAccess &&
        !hasRoleSectionAccess
    ) {
        return (
            <NoticeBox
                error
                title={i18n.t('Insufficient permissions')}
                className={styles.noticeBox}
            >
                {i18n.t(
                    'You do not have access to any section of the DHIS 2 User Management App'
                )}
            </NoticeBox>
        )
    }

    return (
        <main className={styles.container}>
            <SideNav>
                {hasUserSectionAccess && (
                    <NavItem label={i18n.t('User')} path="/users" />
                )}
                {hasRoleSectionAccess && (
                    <NavItem label={i18n.t('User role')} path="/user-roles" />
                )}
                {hasGroupSectionAccess && (
                    <NavItem label={i18n.t('User group')} path="/user-groups" />
                )}
            </SideNav>

            <div className={styles.content}>
                <Route path="/" exact strict component={Home} />
                {hasUserSectionAccess && (
                    <>
                        <Route
                            exact
                            strict
                            path="/users/new"
                            component={CreateUser}
                            entityType={USER}
                        />
                        <Route
                            exact
                            strict
                            path="/users/edit/:id"
                            render={({ match }) => (
                                <EditUser userId={match.params.id} />
                            )}
                            entityType={USER}
                        />
                        <Route
                            exact
                            strict
                            path="/users/view/:id"
                            render={({ match }) => (
                                <UserProfile userId={match.params.id} />
                            )}
                            entityType={USER}
                        />
                        <Route
                            exact
                            strict
                            path="/users"
                            component={UserList}
                            entityType={USER}
                        />
                    </>
                )}
                {hasRoleSectionAccess && (
                    <>
                        <Route
                            exact
                            strict
                            path="/user-roles/new"
                            component={CreateRole}
                            entityType={USER_ROLE}
                        />
                        <Route
                            exact
                            strict
                            path="/user-roles/edit/:id"
                            render={({ match }) => (
                                <EditRole roleId={match.params.id} />
                            )}
                            entityType={USER_ROLE}
                        />
                        <Route
                            exact
                            strict
                            path="/user-roles/view/:id"
                            render={({ match }) => (
                                <RoleDetails roleId={match.params.id} />
                            )}
                            entityType={USER_ROLE}
                        />
                        <Route
                            exact
                            strict
                            path="/user-roles"
                            component={RoleList}
                            entityType={USER_ROLE}
                        />
                    </>
                )}
                {hasGroupSectionAccess && (
                    <>
                        <Route
                            exact
                            strict
                            path="/user-groups/new"
                            component={CreateGroup}
                            entityType={USER_GROUP}
                        />
                        <Route
                            exact
                            strict
                            path="/user-groups/edit/:id"
                            render={({ match }) => (
                                <EditGroup groupId={match.params.id} />
                            )}
                            entityType={USER_GROUP}
                        />
                        <Route
                            exact
                            strict
                            path="/user-groups/view/:id"
                            render={({ match }) => (
                                <GroupDetails groupId={match.params.id} />
                            )}
                            entityType={USER_GROUP}
                        />
                        <Route
                            exact
                            strict
                            path="/user-groups"
                            component={GroupList}
                            entityType={USER_GROUP}
                        />
                    </>
                )}
            </div>
        </main>
    )
}

export default SectionNavigation

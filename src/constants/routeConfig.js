import i18n from '@dhis2/d2-i18n'
import React from 'react'
import CreateGroup from '../pages/CreateGroup'
import CreateRole from '../pages/CreateRole'
import CreateUser from '../pages/CreateUser'
import EditGroup from '../pages/EditGroup'
import EditRole from '../pages/EditRole'
import EditUser from '../pages/EditUser'
import GroupDetails from '../pages/GroupDetails'
import GroupList from '../pages/GroupList'
import Home from '../pages/Home'
import PageNotFound from '../pages/PageNotFound'
import RoleDetails from '../pages/RoleDetails'
import RoleList from '../pages/RoleList'
import UserList from '../pages/UserList'
import UserProfile from '../pages/UserProfile'
import { USER, USER_ROLE, USER_GROUP } from './entityTypes'

const getUserSection = () => ({
    key: 'user_section',
    label: i18n.t('User'),
    path: '/users',
    description: i18n.t('Create, modify, view and delete Users'),
    component: UserList,
    entityType: USER,
})
const getUserRoleSection = () => ({
    key: 'user_role_section',
    label: i18n.t('User role'),
    path: '/user-roles',
    description: i18n.t('Create, modify, view and delete User Roles'),
    component: RoleList,
    entityType: USER_ROLE,
})
const getUserGroupSection = () => ({
    key: 'user_group_section',
    label: i18n.t('User group'),
    path: '/user-groups',
    description: i18n.t('Create, modify, view and delete User Groups'),
    component: GroupList,
    entityType: USER_GROUP,
})

// Label property is used in sidebar, so routes without a label will be omitted
const createRouteConfig = () => [
    // USER
    {
        key: 'user_new_view',
        path: '/users/new',
        render: () => <CreateUser />,
        entityType: USER,
    },
    {
        key: 'user_edit_view',
        path: '/users/edit/:id',
        render: ({ match }) => <EditUser userId={match.params.id} />,
        entityType: USER,
    },
    {
        key: 'user_profile_view',
        path: '/users/view/:id',
        component: ({ match }) => <UserProfile userId={match.params.id} />,
        entityType: USER,
    },
    getUserSection(),
    // ROLE
    {
        key: 'user_role_new_view',
        path: '/user-roles/new',
        render: () => <CreateRole />,
        entityType: USER_ROLE,
    },
    {
        key: 'user_role_edit_view',
        path: '/user-roles/edit/:id',
        render: ({ match }) => <EditRole roleId={match.params.id} />,
        entityType: USER_ROLE,
    },
    {
        key: 'user_role_details_view',
        path: '/user-roles/view/:id',
        component: ({ match }) => <RoleDetails roleId={match.params.id} />,
        entityType: USER_ROLE,
    },
    getUserRoleSection(),
    // GROUP
    {
        key: 'user_group_new_view',
        path: '/user-groups/new',
        render: () => <CreateGroup />,
        entityType: USER_GROUP,
    },
    {
        key: 'user_group_edit_view',
        path: '/user-groups/edit/:id',
        render: ({ match }) => <EditGroup groupId={match.params.id} />,
        entityType: USER_GROUP,
    },
    {
        key: 'user_group_details_view',
        path: '/user-groups/view/:id',
        component: ({ match }) => <GroupDetails groupId={match.params.id} />,
        entityType: USER_GROUP,
    },
    getUserGroupSection(),
    // Other
    {
        key: 'landing_page',
        path: '/',
        component: Home,
    },
    {
        key: 'not_found',
        component: PageNotFound,
    },
]

export const getSections = (() => {
    let sections = null
    return () => {
        if (!sections) {
            sections = [
                getUserSection(),
                getUserRoleSection(),
                getUserGroupSection(),
            ]
        }
        return sections
    }
})()

export default (() => {
    let routeConfig = null
    return () => {
        if (!routeConfig) {
            routeConfig = createRouteConfig()
        }
        return routeConfig
    }
})()

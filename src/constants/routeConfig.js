import i18n from '@dhis2/d2-i18n'
import React from 'react'
import FormLoader from '../components/FormLoader'
import PageNotFound from '../components/PageNotFound'
import GroupDetails from '../containers/GroupDetails'
import GroupList from '../containers/GroupList'
import Home from '../containers/Home'
import RoleDetails from '../containers/RoleDetails'
import RoleList from '../containers/RoleList'
import UserList from '../containers/UserList'
import UserProfile from '../containers/UserProfile'
import { USER, USER_ROLE, USER_GROUP } from './entityTypes'

const getUserSection = () => ({
    key: 'user_section',
    label: i18n.t('User'),
    icon: 'person',
    path: '/users',
    description: i18n.t('Create, modify, view and delete Users'),
    component: UserList,
    entityType: USER,
})
const getUserRoleSection = () => ({
    key: 'user_role_section',
    label: i18n.t('User role'),
    icon: 'folder_shared',
    path: '/user-roles',
    description: i18n.t('Create, modify, view and delete User Roles'),
    component: RoleList,
    entityType: USER_ROLE,
})
const getUserGroupSection = () => ({
    key: 'user_group_section',
    label: i18n.t('User group'),
    icon: 'group',
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
        render: props => <FormLoader entityType={USER} {...props} />,
        entityType: USER,
    },
    {
        key: 'user_edit_view',
        path: '/users/edit/:id',
        render: props => <FormLoader entityType={USER} {...props} />,
        entityType: USER,
    },
    {
        key: 'user_profile_view',
        path: '/users/view/:id',
        component: UserProfile,
        entityType: USER,
    },
    getUserSection(),
    // ROLE
    {
        key: 'user_role_new_view',
        path: '/user-roles/new',
        render: props => <FormLoader entityType={USER_ROLE} {...props} />,
        entityType: USER_ROLE,
    },
    {
        key: 'user_role_edit_view',
        path: '/user-roles/edit/:id',
        render: props => <FormLoader entityType={USER_ROLE} {...props} />,
        entityType: USER_ROLE,
    },
    {
        key: 'user_role_details_view',
        path: '/user-roles/view/:id',
        component: RoleDetails,
        entityType: USER_ROLE,
    },
    getUserRoleSection(),
    // GROUP
    {
        key: 'user_group_new_view',
        path: '/user-groups/new',
        render: props => <FormLoader entityType={USER_GROUP} {...props} />,
        entityType: USER_GROUP,
    },
    {
        key: 'user_group_edit_view',
        path: '/user-groups/edit/:id',
        render: props => <FormLoader entityType={USER_GROUP} {...props} />,
        entityType: USER_GROUP,
    },
    {
        key: 'user_group_details_view',
        path: '/user-groups/view/:id',
        component: GroupDetails,
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

import React from 'react';
import i18n from '@dhis2/d2-i18n';
import UserList from '../containers/UserList';
import FormLoader from '../components/FormLoader';
import UserProfile from '../containers/UserProfile';
import PageNotFound from '../components/PageNotFound';
import CardLinks from '../components/CardLinks';
import RoleList from '../containers/RoleList';
import RoleDetails from '../containers/RoleDetails';
import GroupList from '../containers/GroupList';
import GroupDetails from '../containers/GroupDetails';
import { USER, USER_ROLE, USER_GROUP } from './entityTypes';

const USER_SECTION = {
    key: 'user_section',
    label: i18n.t('User'),
    icon: 'person',
    path: '/users',
    description: i18n.t('Create, modify, view and delete Users'),
    component: UserList,
    entityType: USER,
};
const USER_ROLE_SECTION = {
    key: 'user_role_section',
    label: i18n.t('User role'),
    icon: 'folder_shared',
    path: '/user-roles',
    description: i18n.t('Create, modify, view and delete User Roles'),
    component: RoleList,
    entityType: USER_ROLE,
};
const USER_GROUP_SECTION = {
    key: 'user_group_section',
    label: i18n.t('User group'),
    icon: 'group',
    path: '/user-groups',
    description: i18n.t('Create, modify, view and delete User Groups'),
    component: GroupList,
    entityType: USER_GROUP,
};

export const SECTIONS = [USER_SECTION, USER_ROLE_SECTION, USER_GROUP_SECTION];

// Label property is used in sidebar, so routes without a label will be omitted
const ROUTE_CONFIG = [
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
    USER_SECTION,
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
    USER_ROLE_SECTION,
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
    USER_GROUP_SECTION,
    // Other
    {
        key: 'landing_page',
        path: '/',
        component: CardLinks,
    },
    {
        key: 'not_found',
        component: PageNotFound,
    },
];
export default ROUTE_CONFIG;

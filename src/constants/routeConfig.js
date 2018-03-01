import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import GroupForm from '../components/groups/GroupForm';
import RoleForm from '../components/roles/RoleForm';
import UserProfile from '../components/users/UserProfile';
import PageNotFound from '../components/PageNotFound';
import RoleList from '../components/roles/RoleList';
import RoleDetails from '../components/roles/RoleDetails';
import GroupList from '../components/groups/GroupList';
import GroupDetails from '../components/groups/GroupDetails';
import { USER, USER_ROLE, USER_GROUP } from './entityTypes';

// Label property is used in sidebar, so routes without a label will be omitted
const ROUTE_CONFIG = [
    // USER
    {
        key: 'user_new_view',
        path: '/users/new',
        component: UserForm,
        entityType: USER,
    },
    {
        key: 'user_edit_view',
        path: '/users/edit/:id',
        component: UserForm,
        entityType: USER,
    },
    {
        key: 'user_profile_view',
        path: '/users/view/:id',
        component: UserProfile,
        entityType: USER,
    },
    {
        key: 'user_section',
        label: 'Users',
        icon: 'person',
        path: '/users',
        component: UserList,
        entityType: USER,
    },
    // ROLE
    {
        key: 'user_role_new_view',
        path: '/user-roles/new',
        component: RoleForm,
        entityType: USER_ROLE,
    },
    {
        key: 'user_role_edit_view',
        path: '/user-roles/edit/:id',
        component: RoleForm,
        entityType: USER_ROLE,
    },
    {
        key: 'user_role_details_view',
        path: '/user-roles/view/:id',
        component: RoleDetails,
        entityType: USER_ROLE,
    },
    {
        key: 'user_role_section',
        label: 'User role',
        icon: 'folder_shared',
        path: '/user-roles',
        component: RoleList,
        entityType: USER_ROLE,
    },
    // GROUP
    {
        key: 'user_group_new_view',
        path: '/user-groups/new',
        component: GroupForm,
        entityType: USER_GROUP,
    },
    {
        key: 'user_group_edit_view',
        path: '/user-groups/edit/:id',
        component: GroupForm,
        entityType: USER_GROUP,
    },
    {
        key: 'user_group_details_view',
        path: '/user-groups/view/:id',
        component: GroupDetails,
        entityType: USER_GROUP,
    },
    {
        key: 'user_group_section',
        label: 'User group',
        icon: 'group',
        path: '/user-groups',
        component: GroupList,
        entityType: USER_GROUP,
    },
    {
        key: 'not_found',
        component: PageNotFound,
    },
];
export default ROUTE_CONFIG;

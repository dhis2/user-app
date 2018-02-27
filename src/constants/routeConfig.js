import UserList from '../components/users/UserList';
import UserEdit from '../components/users/UserEdit';
import UserProfile from '../components/users/UserProfile';
import PageNotFound from '../components/PageNotFound';
import RoleList from '../components/roles/RoleList';
import RoleDetails from '../components/roles/RoleDetails';
import GroupList from '../components/groups/GroupList';
import GroupDetails from '../components/groups/GroupDetails';
import DeleteCurrentUserView from '../components/DeleteCurrentUserView';
import { USER, USER_ROLE, USER_GROUP } from './entityTypes';

// Label property is used in sidebar, so routes without a label will be omitted
const ROUTE_CONFIG = [
    {
        key: 'user_edit_view',
        path: '/users/edit/:id',
        component: UserEdit,
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
        key: 'delete_current_user_section',
        label: 'Delete current user',
        icon: 'delete',
        path: '/delete-current-user',
        component: DeleteCurrentUserView,
    },
    {
        key: 'not_found',
        component: PageNotFound,
    },
];
export default ROUTE_CONFIG;

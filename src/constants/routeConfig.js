import UserList from '../components/users/UserList';
import UserEdit from '../components/users/UserEdit';
import UserProfile from '../components/users/UserProfile';
import PageNotFound from '../components/PageNotFound';
import RoleGrid from '../components/RoleGrid';
import GroupGrid from '../components/GroupGrid';
import DeleteCurrentUserView from '../components/DeleteCurrentUserView';

// Label property is used in sidebar, so routes without a label will be omitted
const ROUTE_CONFIG = [
    {
        key: 'user_edit_view',
        path: '/users/edit/:id',
        component: UserEdit,
    },
    {
        key: 'user_profile_view',
        path: '/users/view/:id',
        component: UserProfile,
    },
    {
        key: 'user_section',
        label: 'Users',
        icon: 'person',
        path: '/users',
        component: UserList,
    },
    {
        key: 'user_role_section',
        label: 'User role',
        icon: 'folder_shared',
        path: '/user-role',
        component: RoleGrid,
    },
    {
        key: 'user_group_section',
        label: 'User group',
        icon: 'group',
        path: '/user-group',
        component: GroupGrid,
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

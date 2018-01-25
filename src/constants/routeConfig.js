import UserList from '../components/users/UserList';
import EditUser from '../components/users/EditUser';
import PageNotFound from '../components/PageNotFound';
import RoleGrid from '../components/RoleGrid';
import GroupGrid from '../components/GroupGrid';
import DeleteCurrentUserView from '../components/DeleteCurrentUserView';

// Label property is used in sidebar, so routes without a label will be omitted
const ROUTE_CONFIG = [
    {
        key: 'edit_user_view',
        path: '/users/edit/:id',
        component: EditUser,
    },
    {
        key: 'user_section',
        label: 'Users',
        path: '/users',
        component: UserList,
    },
    {
        key: 'user_role_section',
        label: 'User role',
        path: '/user-role',
        component: RoleGrid,
    },
    {
        key: 'user_group_section',
        label: 'User group',
        path: '/user-group',
        component: GroupGrid,
    },
    {
        key: 'delete_current_user_section',
        label: 'Delete current user',
        path: '/delete-current-user',
        component: DeleteCurrentUserView,
    },
    {
        key: 'not_found',
        component: PageNotFound,
    },
];
export default ROUTE_CONFIG;

import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import SideNav from './SideNav';
import UserGrid from './UserGrid';
import RoleGrid from './RoleGrid';
import GroupGrid from './GroupGrid';
import DeleteCurrentUserView from './DeleteCurrentUserView';

const style = {
    marginTop: '4rem',
    display: 'flex',
    flex: '1 1 0%',
};

class SectionLoader extends Component {
    getSections() {
        // TODO: Only return sections available to the currentUser
        return [
            {
                key: 'user_section',
                label: 'User',
                path: '/user',
                component: UserGrid,
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
        ];
    }

    renderRoutes(sections) {
        return sections.map(section => {
            const { key, path, component } = section;
            return <Route key={key} path={path} component={component} />;
        });
    }

    render() {
        const sections = this.getSections();
        return (
            <main style={style}>
                <SideNav sections={sections} />
                {this.renderRoutes(sections)}
            </main>
        );
    }
}

export default SectionLoader;

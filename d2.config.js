/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    id: '1887e1f8-3b62-42a3-8383-975996e0870f',
    type: 'app',
    coreApp: true,
    title: 'Users',
    name: 'user',
    description:
        'An application for managing users, user-groups and user-roles',
    entryPoints: {
        app: './src/AppWrapper.jsx',
    },
    minDHIS2Version: '2.41',
    shortcuts: [
        {
            name: 'Users',
            url: '#/users',
        },
        {
            name: 'New user',
            url: '#/users/new',
        },
        {
            name: 'User roles',
            url: '#/user-roles',
        },
        {
            name: 'New user role',
            url: '#/user-roles/new',
        },
        {
            name: 'User groups',
            url: '#/user-groups',
        },
        {
            name: 'New user group',
            url: '#/user-groups/new',
        },
    ],
}

module.exports = config

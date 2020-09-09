const config = {
    type: 'app',
    coreApp: true,
    title: 'User management',
    name: 'user',
    description:
        'An application for managing users, user-groups and user-roles',
    entryPoints: {
        app: './src/AppWrapper',
    },
}

module.exports = config

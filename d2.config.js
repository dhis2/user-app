const config = {
    id: '1887e1f8-3b62-42a3-8383-975996e0870f',
    type: 'app',
    coreApp: true,
    title: 'User management',
    name: 'user',
    description:
        'An application for managing users, user-groups and user-roles',
    entryPoints: {
        app: './src/AppWrapper.js',
    },
    minDHIS2Version: '2.41',
}

module.exports = config

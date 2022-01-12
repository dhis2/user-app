export const getUserData = ({ values, dimensionConstraintsById, user }) => {
    const inviteUser = values.inviteUser === 'INVITE_USER'
    const {
        email,
        firstName,
        surname,
        phoneNumber,
        whatsApp,
        facebookMessenger,
        skype,
        telegram,
        twitter,
        organisationUnits,
        dataViewOrganisationUnits,
        teiSearchOrganisationUnits,
        userGroups,
        username,
        changePassword,
        password,
        disabled,
        accountExpiry,
        openId,
        ldapId,
        externalAuth,
        userRoles,
        dimensionConstraints,
    } = values
    const wrapIds = entities => entities.map(entity => {
        const id = typeof entity === 'string' ? entity : entity.id
        return { id }
    })
    const constraintsForType = dimensionType =>
        wrapIds(
            dimensionConstraints.filter(
                id =>
                    dimensionConstraintsById[id].dimensionType === dimensionType
            )
        )

    const userData = {
        id: user?.id,

        email,
        firstName,
        surname,
        phoneNumber,
        whatsApp,
        facebookMessenger,
        skype,
        telegram,
        twitter,
        organisationUnits: wrapIds(organisationUnits),
        dataViewOrganisationUnits: wrapIds(dataViewOrganisationUnits),
        teiSearchOrganisationUnits: wrapIds(teiSearchOrganisationUnits),
        userGroups: wrapIds(userGroups),

        userCredentials: {
            id: user?.userCredentials?.id,
            userInfo: user ? { id: user.id } : undefined,

            username,
            disabled,
            password:
                !inviteUser && !externalAuth && (!user || changePassword)
                    ? password
                    : undefined,
            // See https://jira.dhis2.org/browse/DHIS2-10569
            accountExpiry:
                typeof accountExpiry === 'string' && accountExpiry !== ''
                    ? accountExpiry
                    : undefined,
            openId,
            ldapId,
            externalAuth,
            userRoles: wrapIds(userRoles),
            // Dimension constraints are combined into a single input
            // component, but need to be stored separately
            catDimensionConstraints: constraintsForType('CATEGORY'),
            cogsDimensionConstraints: constraintsForType(
                'CATEGORY_OPTION_GROUP_SET'
            ),
        },
    }

    // Because the data object is used as the payload of a PUT request, properties that are omitted will be removed
    // To prevent this, all remaining owned properties are copied from the user to the data object
    // This is only required when editing users, because new users can't have such properties
    if (user) {
        for (const [key, value] of Object.entries(user)) {
            if (!(key in userData)) {
                userData[key] = value
            }
        }
    }

    return userData
}

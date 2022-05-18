import { getAttributeValues } from '../../attributes.js'

const wrapIds = (ids) => ids.map((id) => ({ id }))

export const getUserData = ({
    values,
    dimensionConstraintsById,
    user,
    attributes,
}) => {
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
        dataViewMaxOrganisationUnitLevel,
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
    const constraintsForType = (dimensionType) =>
        wrapIds(
            dimensionConstraints.filter(
                (id) =>
                    dimensionConstraintsById[id].dimensionType === dimensionType
            )
        )

    return {
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
                : null,
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
        dataViewMaxOrganisationUnitLevel:
            dataViewMaxOrganisationUnitLevel ??
            Number(dataViewMaxOrganisationUnitLevel),
        userGroups: wrapIds(userGroups),

        attributeValues: getAttributeValues({ attributes, values }),
    }
}

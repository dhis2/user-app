import { getUserData } from './getUserData.js'

describe('getUserData', () => {
    const values = {
        inviteUser: 'SET_PASSWORD',
        email: 'email',
        firstName: 'firstName',
        surname: 'surname',
        phoneNumber: 'phoneNumber',
        whatsApp: 'whatsApp',
        facebookMessenger: 'facebookMessenger',
        skype: 'skype',
        telegram: 'telegram',
        twitter: 'twitter',
        organisationUnits: ['org-1', 'org-2', 'org-3'],
        dataViewOrganisationUnits: ['org-4', 'org-5', 'org-6'],
        teiSearchOrganisationUnits: ['org-7', 'org-8', 'org-9'],
        userGroups: ['group-1', 'group-2', 'group-3'],
        username: 'username',
        changePassword: true,
        password: 'password',
        disabled: false,
        accountExpiry: '',
        openId: 'openId',
        ldapId: 'ldapId',
        externalAuth: false,
        userRoles: ['role-1', 'role-2', 'role-3'],
        dimensionConstraints: ['type-1', 'type-2'],
    }
    const dimensionConstraintsById = {
        'type-1': {
            id: 'type-1',
            dimensionType: 'CATEGORY',
        },
        'type-2': {
            id: 'type-2',
            dimensionType: 'CATEGORY_OPTION_GROUP_SET',
        },
    }

    it('splits dimension constraints', () => {
        const userData = getUserData({
            values,
            dimensionConstraintsById,
            attributes: [],
        })

        expect(userData.catDimensionConstraints).toEqual([{ id: 'type-1' }])
        expect(userData.cogsDimensionConstraints).toEqual([{ id: 'type-2' }])
    })

    it('wraps organisation unit IDs', () => {
        const userData = getUserData({
            values,
            dimensionConstraintsById,
            attributes: [],
        })

        expect(userData.organisationUnits).toEqual([
            { id: 'org-1' },
            { id: 'org-2' },
            { id: 'org-3' },
        ])
        expect(userData.dataViewOrganisationUnits).toEqual([
            { id: 'org-4' },
            { id: 'org-5' },
            { id: 'org-6' },
        ])
        expect(userData.teiSearchOrganisationUnits).toEqual([
            { id: 'org-7' },
            { id: 'org-8' },
            { id: 'org-9' },
        ])
    })

    it('wraps user group IDs', () => {
        const userData = getUserData({
            values,
            dimensionConstraintsById,
            attributes: [],
        })

        expect(userData.userGroups).toEqual([
            { id: 'group-1' },
            { id: 'group-2' },
            { id: 'group-3' },
        ])
    })

    it('wraps user role IDs', () => {
        const userData = getUserData({
            values,
            dimensionConstraintsById,
            attributes: [],
        })

        expect(userData.userRoles).toEqual([
            { id: 'role-1' },
            { id: 'role-2' },
            { id: 'role-3' },
        ])
    })

    // See https://jira.dhis2.org/browse/DHIS2-10569
    it('replaces empty account expiry with null', () => {
        const valuesWithEmptyAccountExpiry = {
            ...values,
            accountExpiry: '',
        }
        const userData = getUserData({
            values: valuesWithEmptyAccountExpiry,
            dimensionConstraintsById,
            attributes: [],
        })

        expect(userData.accountExpiry).toBe(null)
    })

    describe('only sets a password in certain conditions', () => {
        it('does not set a password if the user is invited', () => {
            const valuesWithInvitedUser = {
                ...values,
                inviteUser: 'INVITE_USER',
                externalAuth: false,
                changePassword: true,
                password: 'password',
            }
            const userData = getUserData({
                values: valuesWithInvitedUser,
                dimensionConstraintsById,
                attributes: [],
            })

            expect(userData.password).toBe(undefined)
        })

        it('does not set a password if externalAuth is true', () => {
            const valuesWithExternalAuth = {
                ...values,
                inviteUser: 'SET_PASSWORD',
                externalAuth: true,
                changePassword: true,
                password: 'password',
            }
            const userData = getUserData({
                values: valuesWithExternalAuth,
                dimensionConstraintsById,
                attributes: [],
            })

            expect(userData.password).toBe(undefined)
        })

        it('does not set a password if user exists and changePassword is false', () => {
            const valuesWithChangePasswordFalse = {
                ...values,
                inviteUser: 'SET_PASSWORD',
                externalAuth: false,
                changePassword: false,
                password: 'password',
            }
            const userData = getUserData({
                values: valuesWithChangePasswordFalse,
                dimensionConstraintsById,
                attributes: [],
                user: { id: 'user-1' },
            })

            expect(userData.password).toBe(undefined)
        })

        it('sets a password if user is new and will not be invited nor use external auth', () => {
            const valuesForNewUserWithPassword = {
                ...values,
                inviteUser: 'SET_PASSWORD',
                externalAuth: false,
                changePassword: false,
                password: 'password',
            }
            const userData = getUserData({
                values: valuesForNewUserWithPassword,
                dimensionConstraintsById,
                attributes: [],
            })

            expect(userData.password).toBe('password')
        })

        it('sets a password if user exists and changePassword is true and external auth will not be used', () => {
            const valuesForExistingUserWithPassword = {
                ...values,
                inviteUser: 'SET_PASSWORD',
                externalAuth: false,
                changePassword: true,
                password: 'password',
            }
            const userData = getUserData({
                values: valuesForExistingUserWithPassword,
                dimensionConstraintsById,
                attributes: [],
                user: { id: 'user-1' },
            })

            expect(userData.password).toBe('password')
        })
    })
})

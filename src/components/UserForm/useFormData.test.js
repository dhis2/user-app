import { renderHook } from '@testing-library/react-hooks'
import { useFormData } from './useFormData.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useDataQuery: () => ({
        data: {
            interfaceLanguages: [],
            databaseLanguages: [],
            userRoles: {
                userRoles: [
                    { id: 'a', displayName: 'aerobics' },
                    { id: 'b', displayName: 'baseball' },
                ],
            },
            userRolesAll: {
                userRoles: [
                    { id: 'a', displayName: 'aerobics' },
                    { id: 'b', displayName: 'baseball' },
                    { id: 'c', displayName: 'cycling' },
                    { id: 'd', displayName: 'diving' },
                ],
            },
            userGroups: { userGroups: [] },
            dimensionConstraints: { dimensions: [] },
            attributes: { attributes: [] },
            filledOrganisationUnitLevels: {},
        },
    }),
}))

describe('useFormData', () => {
    it('correctly sorts userRoles into visible and hidden roles', () => {
        const { result } = renderHook(() => useFormData())
        expect(result.current).toHaveProperty('userRoleOptions', [
            { label: 'aerobics', value: 'a' },
            { label: 'baseball', value: 'b' },
        ])
        expect(result.current).toHaveProperty('userRolesHidden', [
            { displayName: 'cycling', id: 'c' },
            { displayName: 'diving', id: 'd' },
        ])
    })
})

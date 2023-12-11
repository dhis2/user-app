import { getRestrictedOrgUnits } from './getRestrictedOrgUnits.js'

describe('getRestrictedOrgUnits', () => {
    const orgUnits = [
        { id: 'grapefruit', ancestors: [{ id: 'pomelo' }] },
        { id: 'tangerine', ancestors: [{ id: 'orange' }, { id: 'pomelo' }] },
        { id: 'lemon', ancestors: [] },
    ]
    const orgUnitType = 'fruit'

    it('returns all organisation units for super users', () => {
        const currentUser = { authorities: ['ALL'] }
        const validOrgUnits = getRestrictedOrgUnits(
            orgUnits,
            orgUnitType,
            currentUser
        )
        expect(validOrgUnits).toEqual(orgUnits)
    })
    it('filters based on specified type when available', () => {
        const currentUser = {
            authorities: [],
            fruit: [{ id: 'grapefruit' }, { id: 'kiwi' }, { id: 'mango' }],
        }
        const validOrgUnits = getRestrictedOrgUnits(
            orgUnits,
            orgUnitType,
            currentUser
        )
        expect(validOrgUnits.map(({ id }) => id)).toEqual(['grapefruit'])
    })
    it('filters based on default organisationUnits specified type is not available', () => {
        const currentUser = {
            authorities: [],
            organisationUnits: [
                { id: 'tangerine' },
                { id: 'soursop' },
                { id: 'apricot' },
            ],
        }
        const validOrgUnits = getRestrictedOrgUnits(
            orgUnits,
            orgUnitType,
            currentUser
        )
        expect(validOrgUnits.map(({ id }) => id)).toEqual(['tangerine'])
    })
    it('checks ancestors when filtering', () => {
        const currentUser = {
            authorities: [],
            organisationUnits: [{ id: 'pomelo' }],
        }
        const validOrgUnits = getRestrictedOrgUnits(
            orgUnits,
            orgUnitType,
            currentUser
        )
        expect(validOrgUnits.map(({ id }) => id)).toEqual([
            'grapefruit',
            'tangerine',
        ])
    })
    it('returns nothing, if user is not super user and has no org units', () => {
        const currentUser = { authorities: [], organisationUnits: [] }
        const validOrgUnits = getRestrictedOrgUnits(
            orgUnits,
            orgUnitType,
            currentUser
        )
        expect(validOrgUnits.length).toEqual(0)
    })
})

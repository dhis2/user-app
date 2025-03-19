import { useDataQuery } from '@dhis2/app-runtime'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { SystemProvider } from './SystemProvider.jsx'
import { useSystemInformation } from './useSystemInformation.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useDataQuery: jest.fn(),
    useConfig: jest.fn(),
}))

const wrapper = ({ children }) => <SystemProvider>{children}</SystemProvider>

describe('useSystemInformation', () => {
    it('should filter out F_PREVIOUS_IMPERSONATOR_AUTHORITY from authorities', () => {
        useDataQuery.mockReturnValue({
            data: {
                systemAuthorities: {
                    systemAuthorities: [
                        { id: 'cat', name: 'Cat' },
                        {
                            id: 'F_PREVIOUS_IMPERSONATOR_AUTHORITY',
                            name: 'Impersonate name',
                        },
                        { id: 'dog', name: 'Dog' },
                    ],
                },
                systemSettings: { keyCanGrantOwnUserAuthorityGroups: true },
            },
        })
        const { result } = renderHook(() => useSystemInformation(), { wrapper })

        expect(result.current.authorities).toStrictEqual([
            { id: 'cat', name: 'Cat' },
            { id: 'dog', name: 'Dog' },
        ])
    })

    it('returns empty array if authorities are missing from response', () => {
        useDataQuery.mockReturnValue({
            data: {
                systemSettings: { keyCanGrantOwnUserAuthorityGroups: true },
            },
        })
        const { result } = renderHook(() => useSystemInformation(), { wrapper })

        expect(result.current.authorities).toStrictEqual([])
    })
})

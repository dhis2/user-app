import { useConfig } from '@dhis2/app-runtime'
import { renderHook } from '@testing-library/react'
import { useFeatureToggle } from './useFeatureToggle.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: jest.fn(),
}))

describe('useFeatureToggle', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    it('has displayEmailVerifiedStatus:false if email is not configured', () => {
        useConfig.mockReturnValue({
            serverVersion: { minor: '42' },
            systemInfo: { emailConfigured: false },
        })
        const { result } = renderHook(() => useFeatureToggle())
        expect(result.current.displayEmailVerifiedStatus).toBe(false)
    })

    it('has displayEmailVerifiedStatus:false if api version is 41 or earlier ', () => {
        useConfig.mockReturnValue({
            serverVersion: { minor: '41' },
            systemInfo: { emailConfigured: true },
        })
        const { result } = renderHook(() => useFeatureToggle())
        expect(result.current.displayEmailVerifiedStatus).toBe(false)
    })

    it('has displayEmailVerifiedStatus:false if api version is 42 or greater and email is configured ', () => {
        useConfig.mockReturnValue({
            serverVersion: { minor: '42' },
            systemInfo: { emailConfigured: true },
        })
        const { result } = renderHook(() => useFeatureToggle())
        expect(result.current.displayEmailVerifiedStatus).toBe(true)
    })

    it('has displayEmailVerifiedStatus:false if config is missing information', () => {
        useConfig.mockReturnValue({})
        const { result } = renderHook(() => useFeatureToggle())
        expect(result.current.displayEmailVerifiedStatus).toBe(false)
    })
    it.each([
        [null, false],
        ['41', false],
        ['42', false],
        ['43', true],
        ['44', true],
    ])(
        'with api minor version of %s it sets showUserGroupDescription to %b',
        (apiMinorVersion, expected) => {
            useConfig.mockReturnValue({
                serverVersion: { minor: apiMinorVersion },
            })
            const { result } = renderHook(() => useFeatureToggle())
            expect(result.current.showUserGroupDescription).toBe(expected)
        }
    )
})

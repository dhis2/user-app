import { Provider, CustomDataProvider } from '@dhis2/app-runtime'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PropTypes from 'prop-types'
import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { useFeatureToggle } from '../../hooks/useFeatureToggle.js'
import UserList from './UserList.jsx'

jest.mock('../../hooks/useFeatureToggle.js', () => ({
    useFeatureToggle: jest.fn(),
}))

const CONFIG_DEFAULTS = {
    baseUrl: 'https://debug.dhis2.org/dev',
    apiVersion: '42',
    systemInfo: {
        serverTimeZoneId: 'Etc/UTC',
    },
}

const mockUsersGet = jest.fn()

const DEFAULT_USERS_RESPONSE = {
    users: [
        {
            id: 'user-1',
            displayName: 'User One',
            access: {
                read: true,
                update: true,
            },
            username: 'user1',
            lastLogin: '2021-10-15T12:34:56Z',
            disabled: false,
            emailVerified: true,
        },
        {
            id: 'user-2',
            displayName: 'Another User',
            access: {
                read: true,
                update: true,
            },
            username: 'user2',
            lastLogin: '2021-09-14T12:34:56Z',
            disabled: true,
            emailVerified: false,
        },
    ],
}

const CUSTOM_PROVIDER_DATA = {
    users: (type, query) => {
        mockUsersGet(query)
        return DEFAULT_USERS_RESPONSE
    },
}

const EXPECTED_QUERY = {
    resource: 'users',
    id: undefined,
    data: undefined,
    params: {
        fields: [
            'id',
            'displayName',
            'access',
            'email',
            'emailVerified',
            'twoFactorEnabled',
            'username',
            'disabled',
            'lastLogin',
            'teiSearchOrganisationUnits[id,path]',
        ],
        order: ['firstName:asc', 'surname:asc'],
        userOrgUnits: true,
        includeChildren: true,
        page: 1,
        pageSize: 50,
        query: '',
        inactiveMonths: undefined,
        invitationStatus: undefined,
        selfRegistered: false,
        filter: '',
    },
}

const RenderWrapper = ({ children }) => (
    <MemoryRouter>
        <QueryParamProvider ReactRouterRoute={Route}>
            <Provider config={CONFIG_DEFAULTS}>
                <CustomDataProvider
                    data={CUSTOM_PROVIDER_DATA}
                    queryClientOptions={{}}
                >
                    {children}
                </CustomDataProvider>
            </Provider>
        </QueryParamProvider>
    </MemoryRouter>
)

RenderWrapper.propTypes = {
    children: PropTypes.node,
}

describe('UserList', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    it('does not show email verification filter if not feature toggled', () => {
        useFeatureToggle.mockReturnValue({ displayEmailVerifiedStatus: false })
        render(
            <RenderWrapper>
                <UserList />
            </RenderWrapper>
        )
        expect(screen.queryByText('Email verification')).toBe(null)
    })

    it('shows email verification filter with options if feature toggled', async () => {
        useFeatureToggle.mockReturnValue({ displayEmailVerifiedStatus: true })
        render(
            <RenderWrapper>
                <UserList />
            </RenderWrapper>
        )
        const EMAIL_VERIFICATION_TEXT = 'Email verification'
        const emailVerificationDropdown = await screen.findByText(
            EMAIL_VERIFICATION_TEXT
        )
        await userEvent.click(emailVerificationDropdown)
        const email_verify_options = within(
            await screen.findByTestId('dhis2-uicore-select-menu-menuwrapper')
        ).getAllByTestId('dhis2-uicore-singleselectoption')
        expect(email_verify_options).toHaveLength(3)

        expect(screen.getByText('All')).toBeInTheDocument()
        expect(screen.getByText('Email verified')).toBeInTheDocument()
        expect(screen.getByText('Email not verified')).toBeInTheDocument()
    })

    it.each([
        ['Email verified', 'emailVerified:eq:true'],
        ['Email not verified', 'emailVerified:eq:false'],
        ['All', undefined],
    ])(
        'fires request when %s is selected with filter value of %s',
        async (filterOption, resultingFilter) => {
            useFeatureToggle.mockReturnValue({
                displayEmailVerifiedStatus: true,
            })
            render(
                <RenderWrapper>
                    <UserList />
                </RenderWrapper>
            )
            const EMAIL_VERIFICATION_TEXT = 'Email verification'
            const emailVerificationDropdown = await screen.findByText(
                EMAIL_VERIFICATION_TEXT
            )
            await userEvent.click(emailVerificationDropdown)

            await userEvent.click(screen.getByText(filterOption))

            expect(screen.getByText(filterOption)).toBeInTheDocument()
            expect(mockUsersGet).toHaveBeenCalledTimes(2)
            const filteredQuery = { ...EXPECTED_QUERY }
            filteredQuery.params.filter = resultingFilter
            expect(mockUsersGet).toHaveBeenNthCalledWith(2, filteredQuery)
        }
    )
})

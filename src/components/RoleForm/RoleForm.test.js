import { CustomDataProvider, Provider } from '@dhis2/app-runtime'
import { ReactFinalForm } from '@dhis2/ui'
import { act, render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PropTypes from 'prop-types'
import React from 'react'
import { useCurrentUser } from '../../providers/current-user/useCurrentUser.js'
import { useSystemInformation } from '../../providers/system/useSystemInformation.js'
import RoleForm from './RoleForm.js'

const noop = () => {}

jest.mock('@dhis2/ui', () => ({
    ...jest.requireActual('@dhis2/ui'),
    Transfer: jest.fn(() => <p>Transfer</p>),
}))

jest.mock('../../utils/navigateTo.js', () => {
    return {
        default: noop,
    }
})

const CONFIG_DEFAULTS = {
    baseUrl: 'https://debug.dhis2.org/dev',
    apiVersion: '41',
    systemInfo: {
        serverTimeZoneId: 'Etc/UTC',
    },
}

const MOCK_ROLE = {
    name: 'Mock User Role',
    description: 'This is a mock user role',
    authorities: ['lutefisk'],
    restrictions: [],
    displayName: 'Mock User Role',
    id: 'user-role-1-id',
}

const MOCK_AUTHORITIES = [
    { id: 'a', name: 'apple' },
    { id: 'b', name: 'banana' },
    { id: 'd', name: 'Dance' },
    { id: 'bb', name: 'beat box' },
]

const MOCK_CURRENT_USER = {
    name: 'Ola Nordmann',
    id: 'ola-nordmann-id-1',
    authorities: ['lutefisk'],
    userRoleIds: ['user-role-JUL-id'],
    userGroupIds: [],
    hasAllAuthority: false,
}

jest.mock('../../providers/current-user/useCurrentUser.js', () => ({
    useCurrentUser: jest.fn(() => MOCK_CURRENT_USER),
}))

const MOCK_SYSTEM_INFORMATION = {
    authorities: MOCK_AUTHORITIES,
    authorityIdToNameMap: new Map(
        MOCK_AUTHORITIES.map(({ id, name }) => [id, name])
    ),
    usersCanAssignOwnUserRoles: false,
}

jest.mock('../../providers/system/useSystemInformation.js', () => ({
    useSystemInformation: jest.fn(() => MOCK_SYSTEM_INFORMATION),
}))

const mockPatchUserRole = jest.fn()

const customProviderData = {
    'userRoles/user-role-1-id': (type, query) => {
        if (type === 'json-patch') {
            mockPatchUserRole(query?.data)
        }
        return {}
    },
}

const { Form } = ReactFinalForm

const RenderWrapper = ({ children }) => (
    <Provider config={CONFIG_DEFAULTS}>
        <CustomDataProvider data={customProviderData} queryClientOptions={{}}>
            <Form onSubmit={noop}>{() => children}</Form>
        </CustomDataProvider>
    </Provider>
)

RenderWrapper.propTypes = {
    children: PropTypes.node,
}

describe('Legacy Authorities', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('does not show any legacy authorities when in edit mode (no role prop) ', async () => {
        act(() => {
            render(
                <RenderWrapper>
                    <RoleForm submitButtonLabel={'Create role'} />
                </RenderWrapper>
            )
        })

        const legacyAuthoritiesTable = await screen.queryByTestId(
            'legacy-authorities-table'
        )
        expect(legacyAuthoritiesTable).toBe(null)
    })

    it('displays a message saying there are no legacy authorities when role authorities all exist in system response', async () => {
        const MOCK_AUTHORITIES = [
            { id: 'ka', name: 'kasper' },
            { id: 'je', name: 'jesper' },
            { id: 'jo', name: 'jonatan' },
        ]
        useSystemInformation.mockReturnValueOnce({
            authorities: MOCK_AUTHORITIES,
        })
        const role_with_no_legacy_authorities = {
            ...MOCK_ROLE,
            authorities: MOCK_AUTHORITIES.map(({ id }) => id),
        }
        act(() => {
            render(
                <RenderWrapper>
                    <RoleForm
                        role={role_with_no_legacy_authorities}
                        submitButtonLabel={'Save role'}
                    />
                </RenderWrapper>
            )
        })

        const noLegacyAuthoritiesMessage = await screen.findByText(
            'There are no legacy or nonstandard authorities assigned to this user role.'
        )
        expect(noLegacyAuthoritiesMessage).toBeInTheDocument()
    })

    it('shows any authorities not in the system response in a case-insensitive alphabetical order ', async () => {
        const role_with_multiple_legacy_authorities = {
            ...MOCK_ROLE,
            authorities: ['zebras', 'antelopes', 'Moose'],
        }
        act(() => {
            render(
                <RenderWrapper>
                    <RoleForm
                        role={role_with_multiple_legacy_authorities}
                        submitButtonLabel={'Save role'}
                    />
                </RenderWrapper>
            )
        })

        const legacyAuthoritiesTable = await screen.findByTestId(
            'legacy-authorities-table'
        )
        const rows = within(legacyAuthoritiesTable).getAllByRole('row')
        expect(rows[1]).toHaveTextContent('antelopes')
        expect(rows[2]).toHaveTextContent('Moose')
        expect(rows[3]).toHaveTextContent('zebras')
        expect(rows.length).toBe(4) // legacy count + 1 header row
    })

    it('removes authorities when you click remove and then save the role', async () => {
        const role_with_multiple_legacy_authorities = {
            ...MOCK_ROLE,
            authorities: ['zebras', 'antelopes', 'Moose'],
        }
        const SAVE_BUTTON_TEXT = 'save this role'

        const expected_post_after_removal = [
            { op: 'add', path: '/name', value: 'Mock User Role' },
            {
                op: 'add',
                path: '/description',
                value: 'This is a mock user role',
            },
            { op: 'add', path: '/authorities', value: ['Moose', 'zebras'] },
        ]

        act(() => {
            render(
                <RenderWrapper>
                    <RoleForm
                        role={role_with_multiple_legacy_authorities}
                        submitButtonLabel={SAVE_BUTTON_TEXT}
                    />
                </RenderWrapper>
            )
        })
        const legacyAuthoritiesTable = await screen.findByTestId(
            'legacy-authorities-table'
        )
        const rows = within(legacyAuthoritiesTable).getAllByRole('row')
        within(rows[1]).queryByRole('button', { name: 'Remove' }).click()

        const saveButton = await screen.findByText(SAVE_BUTTON_TEXT)
        await waitFor(() => {
            userEvent.click(saveButton)
        })
        expect(mockPatchUserRole).toHaveBeenCalled()
        expect(mockPatchUserRole).toHaveBeenCalledWith(
            expected_post_after_removal
        )
    })
})

describe('User roles assignment warnings', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('does not show warning if user has ALL authority', async () => {
        const user_with_all_authority = {
            ...MOCK_CURRENT_USER,
            authorities: ['ALL'],
            hasAllAuthority: true,
            userRoleIds: ['user-role-for-all'],
        }
        useCurrentUser.mockReturnValueOnce(user_with_all_authority)

        const role_with_authorities = {
            ...MOCK_ROLE,
            id: 'user-role-for-all',
            authorities: ['d', 'bb'], // corresponds to 'Dance' and 'beat box' in id:name map
        }

        // NB: default mock has keyCanGrantOwnUserAuthorityGroups:false

        act(() => {
            render(
                <RenderWrapper>
                    <RoleForm
                        role={role_with_authorities}
                        submitButtonLabel={'Save role'}
                    />
                </RenderWrapper>
            )
        })

        await waitFor(async () => {
            const cannotAssignWarningAuthorities = await screen.queryByText(
                'You cannot assign this role because it has authorities that you do not have.'
            )
            expect(cannotAssignWarningAuthorities).toBe(null)
            const cannotAssignWarningMemberOfRole = await screen.queryByText(
                'You cannot assign this role because you are assigned to this role, and your system does not allow you to assign roles of which you are a member.'
            )
            expect(cannotAssignWarningMemberOfRole).toBe(null)
        })
    })

    it('shows a warning if user cannot assign role because role contains authorities that user does not have', async () => {
        const user_with_limited_authorities = {
            ...MOCK_CURRENT_USER,
            authorities: ['code', 'debug'],
        }
        useCurrentUser.mockReturnValueOnce(user_with_limited_authorities)

        const role_with_authority_user_does_not_have = {
            ...MOCK_ROLE,
            authorities: ['d', 'bb'], // corresponds to 'Dance' and 'beat box' in id:name map
        }

        act(() => {
            render(
                <RenderWrapper>
                    <RoleForm
                        role={role_with_authority_user_does_not_have}
                        submitButtonLabel={'Save role'}
                    />
                </RenderWrapper>
            )
        })

        const cannotAssignWarning = await screen.findByText(
            'You cannot assign this role because it has authorities that you do not have.'
        )
        expect(cannotAssignWarning).toBeInTheDocument()
    })

    it('does not show warning about missing roles if user has all the authorities that exist on role', async () => {
        const user_with_limited_authorities = {
            ...MOCK_CURRENT_USER,
            authorities: ['code', 'debug'],
        }
        useCurrentUser.mockReturnValueOnce(user_with_limited_authorities)

        const role_with_authorities_user_has = {
            ...MOCK_ROLE,
            authorities: ['code', 'debug'],
        }

        act(() => {
            render(
                <RenderWrapper>
                    <RoleForm
                        role={role_with_authorities_user_has}
                        submitButtonLabel={'Save role'}
                    />
                </RenderWrapper>
            )
        })
        await waitFor(() => {
            const cannotAssignWarning = screen.queryByText(
                'You cannot assign this role because it has authorities that you do not have.'
            )
            expect(cannotAssignWarning).toBeNull()
        })
    })

    it('user roles details are toggleable and displayed alphabetically', async () => {
        const user_with_limited_authorities = {
            ...MOCK_CURRENT_USER,
            authorities: ['code', 'debug'],
        }
        useCurrentUser.mockReturnValueOnce(user_with_limited_authorities)

        const role_with_authority_user_does_not_have = {
            ...MOCK_ROLE,
            authorities: ['d', 'bb'], // corresponds to 'Dance' and 'beat box' in id:name map
        }

        useSystemInformation.mockReturnValueOnce(MOCK_SYSTEM_INFORMATION)

        act(() => {
            render(
                <RenderWrapper>
                    <RoleForm
                        role={role_with_authority_user_does_not_have}
                        submitButtonLabel={'Save role'}
                    />
                </RenderWrapper>
            )
        })

        await waitFor(async () => {
            const expandIcon = await screen.findByTestId('roles-details-expand')
            userEvent.click(expandIcon)
            const missingAuthoritiesList = await screen.findByTestId(
                'authorities-user-does-not-have-list'
            )
            const missingAuthorities = within(
                missingAuthoritiesList
            ).getAllByRole('listitem')
            expect(missingAuthorities[0]).toHaveTextContent('beat box')
            expect(missingAuthorities[1]).toHaveTextContent('Dance')
            expect(missingAuthorities.length).toBe(2)
            userEvent.click(expandIcon)
            expect(missingAuthoritiesList).not.toBeVisible()
        })
    })

    it('shows a warning if user cannot assign role because role is assigned to user and keyCanGrantOwnUserAuthorityGroups:false ', async () => {
        // NB: default mock has keyCanGrantOwnUserAuthorityGroups:false
        const user_assigned_to_role = {
            ...MOCK_CURRENT_USER,
            userRoleIds: ['user-role-id-pi'],
        }
        useCurrentUser.mockReturnValueOnce(user_assigned_to_role)

        const role_assigned_to_user = {
            ...MOCK_ROLE,
            id: 'user-role-id-pi',
        }

        act(() => {
            render(
                <RenderWrapper>
                    <RoleForm
                        role={role_assigned_to_user}
                        submitButtonLabel={'Save role'}
                    />
                </RenderWrapper>
            )
        })

        const cannotAssignWarning = await screen.findByText(
            'You cannot assign this role because you are assigned to this role, and your system does not allow you to assign roles of which you are a member.'
        )
        expect(cannotAssignWarning).toBeInTheDocument()
    })

    it('does not show a warning if role is not assigned to user and keyCanGrantOwnUserAuthorityGroups:false ', async () => {
        // NB: default mock has keyCanGrantOwnUserAuthorityGroups:false
        const user_not_assigned_to_role = {
            ...MOCK_CURRENT_USER,
            userRoleIds: ['some-other-user-role'],
        }
        useCurrentUser.mockReturnValueOnce(user_not_assigned_to_role)

        const role_not_assigned_to_user = {
            ...MOCK_ROLE,
            id: 'user-role-id-e',
        }

        act(() => {
            render(
                <RenderWrapper>
                    <RoleForm
                        role={role_not_assigned_to_user}
                        submitButtonLabel={'Save role'}
                    />
                </RenderWrapper>
            )
        })

        await waitFor(async () => {
            const cannotAssignWarning = await screen.queryByText(
                'You cannot assign this role because you are assigned to this role, and your system does not allow you to assign roles of which you are a member.'
            )
            expect(cannotAssignWarning).toBe(null)
        })
    })

    it.skip('does not show a warning if user cannot assign role because role is assigned to user and keyCanGrantOwnUserAuthorityGroups:true ', async () => {
        const user_assigned_to_role = {
            ...MOCK_CURRENT_USER,
            userRoleIds: ['user-role-id-pi'],
        }
        useCurrentUser.mockReturnValueOnce(user_assigned_to_role)

        const role_assigned_to_user = {
            ...MOCK_ROLE,
            id: 'user-role-id-pi',
        }

        useSystemInformation.mockReturnValueOnce({
            ...MOCK_SYSTEM_INFORMATION,
            usersCanAssignOwnUserRoles: true,
        })

        act(() => {
            render(
                <RenderWrapper>
                    <RoleForm
                        role={role_assigned_to_user}
                        submitButtonLabel={'Save role'}
                    />
                </RenderWrapper>
            )
        })

        await waitFor(async () => {
            const cannotAssignWarning = await screen.queryByText(
                'You cannot assign this role because you are assigned to this role, and your system does not allow you to assign roles of which you are a member.'
            )
            expect(cannotAssignWarning).toBe(null)
        })
    })
})

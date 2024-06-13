import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import moment from 'moment'
import React from 'react'
import UserTable from './UserTable.js'

/*
 * Since we don't need to verify if this debounce module
 * works as expected it is OK to mock it. The fact that
 * I mocked it is because without the mock, the test suite will
 * fail due to a Jest file parse error. This error started
 * to appear after adding an import of `useUserNameValidator`
 * to `src/pages/UserList/ContextMenu/Modals/ReplicateModal.js`
 * in the commit below:
 * https://github.com/dhis2/user-app/pull/1092/commits/c4edd10011e73e327cf6f1cc26b5c51e342c4081
 * I couldn't identify the root cause of this and settled on this
 * workaround in the end...
 */
jest.mock('p-debounce', () => ({
    __esModule: true,
    default: (fn) => fn,
}))

describe('<UserTable>', () => {
    it('renders a loading spinner while users are being fetched', () => {
        render(
            <UserTable
                loading={true}
                users={undefined}
                refetch={() => {}}
                nameSortDirection="asc"
                onNameSortDirectionToggle={() => {}}
            />
        )

        expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('renders a NoticeBox of type error if an occurred whilst fetching users', () => {
        const errorMessage = 'some error message'

        render(
            <UserTable
                loading={false}
                error={new Error(errorMessage)}
                users={undefined}
                refetch={() => {}}
                nameSortDirection="asc"
                onNameSortDirectionToggle={() => {}}
            />
        )

        expect(screen.getByRole('heading')).toHaveTextContent(
            'Error loading users'
        )
        expect(
            screen.getByTestId('dhis2-uicore-noticebox-content-message')
        ).toHaveTextContent(errorMessage)
    })

    it('shows a message if there were no results', () => {
        render(
            <UserTable
                loading={false}
                error={undefined}
                users={[]}
                refetch={() => {}}
                nameSortDirection="asc"
                onNameSortDirectionToggle={() => {}}
            />
        )

        expect(
            screen.getByTestId('data-test-empty-table-info')
        ).toBeInTheDocument()
    })

    it('renders a DataTable with header and body once users have loaded', () => {
        const users = [
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
            },
        ]

        render(
            <UserTable
                loading={false}
                users={users}
                refetch={() => {}}
                nameSortDirection="asc"
                onNameSortDirectionToggle={() => {}}
            />
        )

        expect(screen.getAllByRole('columnheader')).toHaveLength(5)
        expect(
            screen.getByRole('columnheader', { name: 'Display name' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('columnheader', { name: 'Username' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('columnheader', { name: 'Last login' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('columnheader', { name: 'Status' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('columnheader', { name: 'Actions' })
        ).toBeInTheDocument()

        const rows = within(
            screen.getByTestId('dhis2-uicore-tablebody')
        ).getAllByRole('row')
        expect(rows).toHaveLength(users.length)
        users.forEach((user, index) => {
            const { displayName, username, lastLogin, disabled } = user

            const row = rows[index]
            expect(within(row).getAllByRole('cell')).toHaveLength(5)
            expect(
                within(row).getByRole('cell', { name: displayName })
            ).toBeInTheDocument()
            expect(
                within(row).getByRole('cell', { name: username })
            ).toBeInTheDocument()
            if (lastLogin) {
                const cell = within(row).getByRole('cell', {
                    name: lastLogin,
                })
                expect(cell).toBeInTheDocument()
                expect(cell).toHaveTextContent(moment(lastLogin).fromNow())
            }
            if (disabled) {
                expect(
                    within(row).getByRole('cell', {
                        name: 'Disabled',
                    })
                ).toBeInTheDocument()
            } else {
                expect(
                    within(row).queryByRole('cell', {
                        name: 'Disabled',
                    })
                ).not.toBeInTheDocument()
            }
        })
    })

    it('allows sorting of users by name/username', () => {
        const users = [
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
            },
        ]

        const toggleNameSortDirection = jest.fn()
        render(
            <UserTable
                loading={false}
                users={users}
                refetch={() => {}}
                nameSortDirection="asc"
                onNameSortDirectionToggle={toggleNameSortDirection}
            />
        )

        userEvent.click(
            within(
                screen.getByRole('columnheader', { name: 'Display name' })
            ).getByRole('button')
        )
        expect(toggleNameSortDirection).toHaveBeenCalled()
    })
})

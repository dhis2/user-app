import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import RoleTable from './RoleTable.js'

describe('<RoleTable>', () => {
    it('renders a loading spinner while roles are being fetched', () => {
        render(
            <RoleTable
                loading={true}
                roles={undefined}
                refetch={() => {}}
                nameSortDirection="asc"
                onNameSortDirectionToggle={() => {}}
            />
        )

        expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('renders a NoticeBox of type error if an occurred whilst fetching roles', () => {
        const errorMessage = 'some error message'

        render(
            <RoleTable
                loading={false}
                error={new Error(errorMessage)}
                roles={undefined}
                refetch={() => {}}
                nameSortDirection="asc"
                onNameSortDirectionToggle={() => {}}
            />
        )

        expect(screen.getByRole('heading')).toHaveTextContent(
            'Error loading user roles'
        )
        expect(
            screen.getByTestId('dhis2-uicore-noticebox-content-message')
        ).toHaveTextContent(errorMessage)
    })

    it('shows a message if there were no results', () => {
        render(
            <RoleTable
                loading={false}
                error={undefined}
                roles={[]}
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
        const roles = [
            {
                id: 'role-1',
                displayName: 'A role',
                access: {
                    read: true,
                    update: true,
                },
                description: 'Description of first user role',
            },
            {
                id: 'role-2',
                displayName: 'Another role',
                access: {
                    read: true,
                    update: true,
                },
                description: 'Description of second user role',
            },
        ]

        render(
            <RoleTable
                loading={false}
                roles={roles}
                refetch={() => {}}
                nameSortDirection="asc"
                onNameSortDirectionToggle={() => {}}
            />
        )

        expect(screen.getAllByRole('columnheader')).toHaveLength(3)
        expect(
            screen.getByRole('columnheader', { name: 'Display name' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('columnheader', { name: 'Description' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('columnheader', { name: 'Actions' })
        ).toBeInTheDocument()

        const rows = within(
            screen.getByTestId('dhis2-uicore-tablebody')
        ).getAllByRole('row')
        expect(rows).toHaveLength(roles.length)
        roles.forEach((role, index) => {
            const { displayName, description } = role

            const row = rows[index]
            expect(within(row).getAllByRole('cell')).toHaveLength(3)
            expect(
                within(row).getByRole('cell', { name: displayName })
            ).toBeInTheDocument()
            expect(
                within(row).getByRole('cell', { name: description })
            ).toBeInTheDocument()
        })
    })

    it('allows sorting of roles by name', () => {
        const roles = [
            {
                id: 'role-1',
                displayName: 'A role',
                access: {
                    read: true,
                    update: true,
                },
                description: 'Description of first user role',
            },
            {
                id: 'role-2',
                displayName: 'Another role',
                access: {
                    read: true,
                    update: true,
                },
                description: 'Description of second user role',
            },
        ]

        const toggleNameSortDirection = jest.fn()
        render(
            <RoleTable
                loading={false}
                roles={roles}
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

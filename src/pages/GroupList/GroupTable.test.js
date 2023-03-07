import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useCurrentUser } from '../../hooks/useCurrentUser.js'
import GroupTable from './GroupTable.js'

jest.mock('../../hooks/useCurrentUser.js', () => ({
    useCurrentUser: jest.fn(),
}))

describe('<GroupTable>', () => {
    it('renders a loading spinner while groups are being fetched', () => {
        render(
            <GroupTable
                loading={true}
                groups={undefined}
                refetch={() => {}}
                nameSortDirection="asc"
                onNameSortDirectionToggle={() => {}}
            />
        )

        expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('renders a NoticeBox of type error if an occurred whilst fetching groups', () => {
        const errorMessage = 'some error message'

        render(
            <GroupTable
                loading={false}
                error={new Error(errorMessage)}
                groups={undefined}
                refetch={() => {}}
                nameSortDirection="asc"
                onNameSortDirectionToggle={() => {}}
            />
        )

        expect(screen.getByRole('heading')).toHaveTextContent(
            'Error loading user groups'
        )
        expect(
            screen.getByTestId('dhis2-uicore-noticebox-content-message')
        ).toHaveTextContent(errorMessage)
    })

    it('shows a message if there were no results', () => {
        render(
            <GroupTable
                loading={false}
                error={undefined}
                groups={[]}
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
        const groups = [
            {
                id: 'group-1',
                displayName: 'A group',
                access: {
                    read: true,
                    update: true,
                },
            },
            {
                id: 'group-2',
                displayName: 'Another group',
                access: {
                    read: true,
                    update: true,
                },
            },
        ]
        const mockUserGroupIds = ['group-2']

        useCurrentUser.mockReturnValue({ userGroupIds: mockUserGroupIds })

        render(
            <GroupTable
                loading={false}
                groups={groups}
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
            screen.getByRole('columnheader', { name: 'Member?' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('columnheader', { name: 'Actions' })
        ).toBeInTheDocument()

        const rows = within(
            screen.getByTestId('dhis2-uicore-tablebody')
        ).getAllByRole('row')
        expect(rows).toHaveLength(groups.length)
        groups.forEach((group, index) => {
            const { id, displayName } = group

            const row = rows[index]
            expect(within(row).getAllByRole('cell')).toHaveLength(3)
            expect(
                within(row).getByRole('cell', { name: displayName })
            ).toBeInTheDocument()
            if (mockUserGroupIds.includes(id)) {
                expect(
                    within(row).getByRole('cell', { name: 'Member' })
                ).toBeInTheDocument()
            }
        })
    })

    it('allows sorting of groups by name', () => {
        const groups = [
            {
                id: 'group-1',
                displayName: 'A group',
                access: {
                    read: true,
                    update: true,
                },
            },
            {
                id: 'group-2',
                displayName: 'Another group',
                access: {
                    read: true,
                    update: true,
                },
            },
        ]

        const toggleNameSortDirection = jest.fn()
        render(
            <GroupTable
                loading={false}
                groups={groups}
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

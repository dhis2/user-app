import { render as _render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import GroupTable from './GroupTable'

const render = (component, options = {}) => {
    const currentUser = options.currentUser || { userGroupIds: [] }
    return _render(component, {
        wrapper: ({ children }) => {
            const store = createStore(() => ({
                currentUser,
            }))
            return <Provider store={store}>{children}</Provider>
        },
    })
}

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
            screen.getByTestId('dhis2-uicore-noticebox-message')
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
            screen.getByRole('row', { name: 'No results found' })
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

        const currentUser = {
            userGroupIds: ['group-2'],
        }
        render(
            <GroupTable
                loading={false}
                groups={groups}
                refetch={() => {}}
                nameSortDirection="asc"
                onNameSortDirectionToggle={() => {}}
            />,
            {
                currentUser,
            }
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
            if (currentUser.userGroupIds.includes(id)) {
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

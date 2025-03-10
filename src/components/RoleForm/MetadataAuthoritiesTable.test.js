import { ReactFinalForm } from '@dhis2/ui'
import { act, render, screen } from '@testing-library/react'
import PropTypes from 'prop-types'
import React from 'react'
import MetadataAuthoritiesTable from './MetadataAuthoritiesTable.js'

const { Form } = ReactFinalForm

const noop = () => {}

const RenderWrapper = ({ children }) => (
    <Form onSubmit={noop}>{() => children}</Form>
)

RenderWrapper.propTypes = {
    children: PropTypes.node,
}

const DEFAULT_METADATA_AUTHORITIES = [
    {
        name: 'Chocolate cake',
        addUpdatePublic: {
            id: 'F_CHOCOLATE_CAKE_PUBLIC_ADD',
            name: 'Add/Update Chocolate Cake',
        },
        addUpdatePrivate: {
            id: 'F_CHOCOLATE_CAKE_PRIVATE_ADD',
            name: 'Add/Update Chocolate Cake',
        },
        delete: {
            id: 'F_CHOCOLATE_CAKE_DELETE',
            name: 'Delete Chocolate Cake',
        },
        externalAccess: {
            empty: true,
        },
    },
]

const DEFAULT_PROPS = {
    filter: '',
    filterSelectedOnly: false,
    metadataAuthorities: DEFAULT_METADATA_AUTHORITIES,
    selectedAuthorities: new Set(),
    selectedColumns: new Set(),
    onFilterChange: () => {},
    onFilterSelectedOnlyChange: () => {},
    onSelectedAuthorityToggle: () => {},
    onSelectedColumnToggle: () => {},
}

describe('MetadataAuthoritiesTable', () => {
    it('should have enabled select all checboxes when filter is empty string', () => {
        act(() => {
            render(
                <RenderWrapper>
                    <MetadataAuthoritiesTable {...DEFAULT_PROPS} />
                </RenderWrapper>
            )
        })
        const addPublicCheckbox = screen.getByRole('checkbox', {
            name: 'Add/Update Public',
        })
        expect(addPublicCheckbox).not.toBeDisabled()
        const addPrivateCheckbox = screen.getByRole('checkbox', {
            name: 'Add/Update Private',
        })
        expect(addPrivateCheckbox).not.toBeDisabled()
        const deleteCheckbox = screen.getByRole('checkbox', { name: 'Delete' })
        expect(deleteCheckbox).not.toBeDisabled()
        const eternalheckbox = screen.getByRole('checkbox', {
            name: 'External access',
        })
        expect(eternalheckbox).not.toBeDisabled()
    })

    it('should have disabled select all checkboxes when filter is not empty string', async () => {
        act(() => {
            render(
                <RenderWrapper>
                    <MetadataAuthoritiesTable
                        {...DEFAULT_PROPS}
                        filter="cake"
                    />
                </RenderWrapper>
            )
        })
        const addPublicCheckbox = screen.getByRole('checkbox', {
            name: 'Add/Update Public',
        })
        expect(addPublicCheckbox).toBeDisabled()
        const addPrivateCheckbox = screen.getByRole('checkbox', {
            name: 'Add/Update Private',
        })
        expect(addPrivateCheckbox).toBeDisabled()
        const deleteCheckbox = screen.getByRole('checkbox', { name: 'Delete' })
        expect(deleteCheckbox).toBeDisabled()
        const eternalheckbox = screen.getByRole('checkbox', {
            name: 'External access',
        })
        expect(eternalheckbox).toBeDisabled()
    })
})

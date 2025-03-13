import { ReactFinalForm } from '@dhis2/ui'
import { render, screen } from '@testing-library/react'
import PropTypes from 'prop-types'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import RolesSection from './RolesSection.jsx'

jest.mock('@dhis2/ui', () => ({
    ...jest.requireActual('@dhis2/ui'),
    Transfer: jest.fn(() => <p>Transfer</p>),
}))

const { Form } = ReactFinalForm

const MOCK_CURRENT_USER = {
    name: 'Ola Nordmann',
    id: 'ola-nordmann-id-1',
    authorities: ['lutefisk'],
    userRoleIds: ['user-role-JUL-id'],
    userGroupIds: [],
    hasAllAuthority: false,
}

const DEFAULT_HIDDEN_ROLES = [
    { id: 'a', displayName: 'Antagonize aardvarks' },
    { id: 'b', displayName: 'Befriend badgers' },
]

const RenderWrapper = ({ children }) => (
    <MemoryRouter>
        <Form onSubmit={() => {}}>{() => children}</Form>
    </MemoryRouter>
)

RenderWrapper.propTypes = {
    children: PropTypes.node,
}

describe('RolesSection', () => {
    it('shows a warning message if there are hidden roles', () => {
        render(
            <RenderWrapper>
                <RolesSection
                    user={MOCK_CURRENT_USER}
                    userRoleOptions={[]}
                    userGroupOptions={[]}
                    userRolesHidden={DEFAULT_HIDDEN_ROLES}
                />
            </RenderWrapper>
        )
        const warningMessage = screen.getByText(
            'You do not have permission to assign certain user roles'
        )
        expect(warningMessage).toBeInTheDocument()
    })

    it('does not show a warning message if there are no hidden roles', () => {
        render(
            <RenderWrapper>
                <RolesSection
                    user={MOCK_CURRENT_USER}
                    userRoleOptions={[]}
                    userGroupOptions={[]}
                    userRolesHidden={[]}
                />
            </RenderWrapper>
        )
        const warningMessage = screen.queryByText(
            'You do not have permission to assign certain user roles'
        )
        expect(warningMessage).toBe(null)
    })

    it('shows list of hidden roles with a link', () => {
        render(
            <RenderWrapper>
                <RolesSection
                    user={MOCK_CURRENT_USER}
                    userRoleOptions={[]}
                    userGroupOptions={[]}
                    userRolesHidden={DEFAULT_HIDDEN_ROLES}
                />
            </RenderWrapper>
        )
        const linkOne = screen.getByRole('link', {
            name: 'Antagonize aardvarks',
        })
        expect(linkOne).toHaveProperty(
            'href',
            'http://localhost/user-roles/view/a'
        )
        const linkTwo = screen.getByRole('link', { name: 'Befriend badgers' })
        expect(linkTwo).toHaveProperty(
            'href',
            'http://localhost/user-roles/view/b'
        )
    })
})

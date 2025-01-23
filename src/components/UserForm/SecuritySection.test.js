import { useDataQuery } from '@dhis2/app-runtime'
import { ReactFinalForm } from '@dhis2/ui'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PropTypes from 'prop-types'
import React from 'react'
import { SystemProvider } from '../../providers/index.js'
import SecuritySection from './SecuritySection.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useDataQuery: jest.fn(),
}))

const { Form } = ReactFinalForm

const RenderWrapper = ({ children }) => (
    <SystemProvider>
        <Form onSubmit={() => {}}>{() => children}</Form>
    </SystemProvider>
)

RenderWrapper.propTypes = {
    children: PropTypes.node,
}

describe('SecuritySection', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('shows password help text based on system minPasswordLength and maxPasswordLength', () => {
        useDataQuery.mockReturnValue({
            data: {
                systemSettings: {
                    minPasswordLength: 20,
                    maxPasswordLength: 30,
                },
            },
        })
        render(
            <RenderWrapper>
                <SecuritySection
                    changePassword={true}
                    externalAuth={false}
                    inviteUser={'SET_PASSWORD'}
                    password={undefined}
                    user={{}}
                />
            </RenderWrapper>
        )
        const passwordHelpText = screen.getByText(
            'Password should be between 20 and 30 characters long, with at least one lowercase character, one uppercase character, one number, and one special character.'
        )
        expect(passwordHelpText).toBeInTheDocument()
    })

    it('warns if inputted password fails validation against system passwordValidationPattern', async () => {
        useDataQuery.mockReturnValue({
            data: {
                systemSettings: {
                    minPasswordLength: 20,
                    maxPasswordLength: 30,
                    passwordValidationPattern: '^cat$',
                },
            },
        })
        render(
            <RenderWrapper>
                <SecuritySection
                    changePassword={true}
                    externalAuth={false}
                    inviteUser={'SET_PASSWORD'}
                    password={undefined}
                    user={{}}
                />
            </RenderWrapper>
        )
        const passwordInputNode = screen.getByLabelText('New password', {
            selector: 'input',
        })
        const repeatPasswordInputNode = screen.getByLabelText(
            'Repeat new password',
            { selector: 'input' }
        )

        // enter invalid password
        userEvent.type(passwordInputNode, 'dog')

        // click away
        userEvent.click(repeatPasswordInputNode)

        // expect invalid password warning to appear
        const invalidPasswordValidationError =
            screen.getByText('Invalid password')
        expect(invalidPasswordValidationError).toBeInTheDocument()
    })

    it('passes if input password satisfies system passwordValidationPattern', async () => {
        useDataQuery.mockReturnValue({
            data: {
                systemSettings: {
                    minPasswordLength: 20,
                    maxPasswordLength: 30,
                    passwordValidationPattern: '^cat$',
                },
            },
        })
        render(
            <RenderWrapper>
                <SecuritySection
                    changePassword={true}
                    externalAuth={false}
                    inviteUser={'SET_PASSWORD'}
                    password={undefined}
                    user={{}}
                />
            </RenderWrapper>
        )
        const passwordInputNode = screen.getByLabelText('New password', {
            selector: 'input',
        })
        const repeatPasswordInputNode = screen.getByLabelText(
            'Repeat new password',
            { selector: 'input' }
        )

        // enter invalid password
        userEvent.type(passwordInputNode, 'cat')

        // click away
        userEvent.click(repeatPasswordInputNode)

        // expect invalid password warning to appear
        const invalidPasswordValidationError =
            screen.queryByText('Invalid password')
        expect(invalidPasswordValidationError).not.toBeInTheDocument()
    })

    it('uses default values if system settings is missing', async () => {
        useDataQuery.mockReturnValue({ data: {} })
        render(
            <RenderWrapper>
                <SecuritySection
                    changePassword={true}
                    externalAuth={false}
                    inviteUser={'SET_PASSWORD'}
                    password={undefined}
                    user={{}}
                />
            </RenderWrapper>
        )

        const passwordHelpText = screen.getByText(
            'Password should be between 8 and 34 characters long, with at least one lowercase character, one uppercase character, one number, and one special character.'
        )
        expect(passwordHelpText).toBeInTheDocument()

        const passwordInputNode = screen.getByLabelText('New password', {
            selector: 'input',
        })
        const repeatPasswordInputNode = screen.getByLabelText(
            'Repeat new password',
            { selector: 'input' }
        )

        // enter invalid password
        userEvent.type(passwordInputNode, 'abcA!1')

        // click away
        userEvent.click(repeatPasswordInputNode)

        // expect invalid password warning to appear
        const invalidPasswordValidationError =
            screen.queryByText('Invalid password')
        expect(invalidPasswordValidationError).toBeInTheDocument()

        // enter valid password
        userEvent.type(passwordInputNode, 'abcA!1abc')

        // click away
        userEvent.click(repeatPasswordInputNode)

        // expect invalid password warning to appear
        expect(invalidPasswordValidationError).not.toBeInTheDocument()
    })

    it('uses fall back min/max lengths in validation if invalid values are provided without passwordValidationPattern', async () => {
        useDataQuery.mockReturnValue({
            data: {
                systemSettings: {
                    minPasswordLength: 2.3,
                    maxPasswordLength: undefined,
                },
            },
        })
        render(
            <RenderWrapper>
                <SecuritySection
                    changePassword={true}
                    externalAuth={false}
                    inviteUser={'SET_PASSWORD'}
                    password={undefined}
                    user={{}}
                />
            </RenderWrapper>
        )

        // we display an invalid value if one was provided in the warning
        const passwordHelpText = screen.getByText(
            'Password should be between 2.3 and 34 characters long, with at least one lowercase character, one uppercase character, one number, and one special character.'
        )
        expect(passwordHelpText).toBeInTheDocument()

        const passwordInputNode = screen.getByLabelText('New password', {
            selector: 'input',
        })
        const repeatPasswordInputNode = screen.getByLabelText(
            'Repeat new password',
            { selector: 'input' }
        )

        // enter invalid password (but the length check will actually be based on default min length of 8)
        userEvent.type(passwordInputNode, 'abcA!1')

        // click away
        userEvent.click(repeatPasswordInputNode)

        // expect invalid password warning to appear
        const invalidPasswordValidationError =
            screen.queryByText('Invalid password')
        expect(invalidPasswordValidationError).toBeInTheDocument()

        // enter valid password
        userEvent.type(passwordInputNode, 'abcA!1abc')

        // click away
        userEvent.click(repeatPasswordInputNode)

        // expect invalid password warning to appear
        expect(invalidPasswordValidationError).not.toBeInTheDocument()
    })
})

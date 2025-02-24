import { useDataQuery, useConfig } from '@dhis2/app-runtime'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Form } from 'react-final-form'
import BasicInformationSection from './BasicInformationSection.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useDataQuery: jest.fn(),
    useConfig: jest.fn(),
}))

jest.mock('@dhis2/d2-i18n', () => ({
    ...jest.requireActual('@dhis2/d2-i18n'),
    t: (key) => key,
    addResources: jest.fn(),
}))

const renderWithForm = (component) => {
    return render(<Form onSubmit={() => {}}>{() => component}</Form>)
}

describe('BasicInformationSection', () => {
    beforeEach(() => {
        useDataQuery.mockReset()
        useConfig.mockReset()
    })

    it('disables the "Disable this user account" checkbox for the current user', () => {
        useDataQuery.mockReturnValue({
            data: { enforceVerifiedEmail: true },
        })
        const user = {
            id: '1',
            disabled: false,
        }

        renderWithForm(
            <BasicInformationSection
                user={user}
                inviteUser={''}
                userInterfaceLanguage="en"
                interfaceLanguageOptions={[]}
                userDatabaseLanguage="en"
                databaseLanguageOptions={[]}
                currentUserId="1"
            />
        )

        const checkbox = screen.getByLabelText(/disable this user account/i)
        expect(checkbox).toBeDisabled()
    })

    it('populates the form with user data when user prop changes', () => {
        useDataQuery.mockReturnValue({
            data: { enforceVerifiedEmail: true },
        })
        const user = {
            username: 'testuser',
            email: 'test@example.com',
            firstName: 'Test',
            surname: 'User',
        }

        renderWithForm(
            <BasicInformationSection
                user={user}
                inviteUser={''}
                userInterfaceLanguage="en"
                interfaceLanguageOptions={[]}
                userDatabaseLanguage="en"
                databaseLanguageOptions={[]}
                currentUserId="1"
            />
        )
        expect(screen.getByLabelText(/Username/i)).toHaveValue('testuser')
        expect(screen.getByLabelText(/Email Address/i)).toHaveValue(
            'test@example.com'
        )
        expect(screen.getByLabelText(/First Name/i)).toHaveValue('Test')
        expect(screen.getByLabelText(/Last Name/i)).toHaveValue('User')
    })

    it('does not show email verification message when creating a new user (no user data available)', () => {
        useConfig.mockReturnValue({
            serverVersion: { minor: '42' },
            systemInfo: { emailConfigured: true },
        })
        useDataQuery.mockReturnValue({ data: { enforceVerifiedEmail: true } })

        renderWithForm(
            <BasicInformationSection
                user={null}
                inviteUser={'INVITE_USER'}
                userInterfaceLanguage="en"
                interfaceLanguageOptions={[]}
                userDatabaseLanguage="en"
                databaseLanguageOptions={[]}
                currentUserId="1"
            />
        )
        expect(
            screen.queryByText(/this user email has been verified/i)
        ).toBeNull()
        expect(
            screen.queryByText(/this user does not have a verified email/i)
        ).toBeNull()
    })

    it('does not show email verification message when system is v41 or earlier', () => {
        useConfig.mockReturnValue({
            serverVersion: { minor: '41' },
            systemInfo: { emailConfigured: true },
        })

        useDataQuery.mockReturnValue({ data: { enforceVerifiedEmail: true } })

        const user = {
            emailVerified: false,
        }

        renderWithForm(
            <BasicInformationSection
                user={user}
                inviteUser={''}
                userInterfaceLanguage="en"
                interfaceLanguageOptions={[]}
                userDatabaseLanguage="en"
                databaseLanguageOptions={[]}
                currentUserId="1"
            />
        )
        expect(
            screen.queryByText(/this user email has been verified/i)
        ).toBeNull()
        expect(
            screen.queryByText(/this user does not have a verified email/i)
        ).toBeNull()
    })

    it('does not show email verification message when email configured is false', () => {
        useConfig.mockReturnValue({
            serverVersion: { minor: '42' },
            systemInfo: { emailConfigured: false },
        })
        useDataQuery.mockReturnValue({ data: { enforceVerifiedEmail: true } })

        const user = {
            emailVerified: false,
        }
        renderWithForm(
            <BasicInformationSection
                user={user}
                inviteUser={''}
                userInterfaceLanguage="en"
                interfaceLanguageOptions={[]}
                userDatabaseLanguage="en"
                databaseLanguageOptions={[]}
                currentUserId="1"
            />
        )
        expect(
            screen.queryByText(/this user email has been verified/i)
        ).toBeNull()
        expect(
            screen.queryByText(/this user does not have a verified email/i)
        ).toBeNull()
    })

    it('shows positive email verification message when all conditions are met and emailVerified is true', () => {
        useConfig.mockReturnValue({
            serverVersion: { minor: '42' },
            systemInfo: { emailConfigured: true },
        })
        useDataQuery.mockReturnValue({ data: { enforceVerifiedEmail: true } })

        const user = {
            emailVerified: true,
        }
        renderWithForm(
            <BasicInformationSection
                user={user}
                inviteUser={''}
                userInterfaceLanguage="en"
                interfaceLanguageOptions={[]}
                userDatabaseLanguage="en"
                databaseLanguageOptions={[]}
                currentUserId="1"
            />
        )
        expect(
            screen.queryByText(/this user email has been verified/i)
        ).toBeInTheDocument()
    })

    it('shows negative email verification message when all conditions are met and emailVerified is false', () => {
        useConfig.mockReturnValue({
            serverVersion: { minor: '42' },
            systemInfo: { emailConfigured: true },
        })
        useDataQuery.mockReturnValue({ data: { enforceVerifiedEmail: true } })

        const user = {
            emailVerified: false,
        }
        renderWithForm(
            <BasicInformationSection
                user={user}
                inviteUser={''}
                userInterfaceLanguage="en"
                interfaceLanguageOptions={[]}
                userDatabaseLanguage="en"
                databaseLanguageOptions={[]}
                currentUserId="1"
            />
        )
        expect(
            screen.queryByText(/this user does not have a verified email/i)
        ).toBeInTheDocument()
    })
})

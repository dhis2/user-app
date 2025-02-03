import { useDataQuery } from '@dhis2/app-runtime'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { Form } from 'react-final-form'
import { useFeatureToggle } from '../../hooks/useFeatureToggle.js'
import BasicInformationSection from './BasicInformationSection.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useDataQuery: jest.fn(),
}))

jest.mock('../../hooks/useFeatureToggle', () => ({
    useFeatureToggle: jest.fn(),
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
        useFeatureToggle.mockReset()
    })

    it('does not show email verification message when system is v41 or earlier', () => {
        useFeatureToggle.mockReturnValue({ displayEmailVerifiedStatus: false })
        useDataQuery.mockReturnValue({ data: { enforceVerifiedEmail: false } })

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

    it('does not show email verification message when system is v42 or later and a system does not have email configured', () => {
        useFeatureToggle.mockReturnValue({ displayEmailVerifiedStatus: true })
        useDataQuery.mockReturnValue({ data: { enforceVerifiedEmail: false } })

        renderWithForm(
            <BasicInformationSection
                user={null}
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

    it('does not show email verification message when creating a new user (no user data available)', () => {
        useDataQuery.mockReturnValue({ data: { enforceVerifiedEmail: false } })
        useFeatureToggle.mockReturnValue({ displayEmailVerifiedStatus: true })

        renderWithForm(
            <BasicInformationSection
                user={null} // No user data, so it’s creating a new user
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

    it('shows email error message when system is v42 or later and a system does not have email configured', async () => {
        useDataQuery.mockReturnValue({
            data: { enforceVerifiedEmail: true },
        })
        useFeatureToggle.mockReturnValue({ displayEmailVerifiedStatus: true })

        const user = {
            emailVerified: false,
        }

        renderWithForm(
            <BasicInformationSection
                user={user}
                inviteUser={'INVITE_USER'}
                userInterfaceLanguage="en"
                interfaceLanguageOptions={[]}
                userDatabaseLanguage="en"
                databaseLanguageOptions={[]}
                currentUserId="1"
            />
        )
        const errorMessage = await screen.findByText(
            /this user does not have a verified email/i
        )
        expect(errorMessage).not.toBeNull()
    })

    it('shows email positive message when system is v42 or later, email is verified and enforce email is configured', async () => {
        useDataQuery.mockReturnValue({
            data: { enforceVerifiedEmail: true },
        })
        useFeatureToggle.mockReturnValue({ displayEmailVerifiedStatus: true })

        const user = {
            emailVerified: true,
        }

        renderWithForm(
            <BasicInformationSection
                user={user}
                inviteUser={'INVITE_USER'}
                userInterfaceLanguage="en"
                interfaceLanguageOptions={[]}
                userDatabaseLanguage="en"
                databaseLanguageOptions={[]}
                currentUserId="1"
            />
        )

        await waitFor(() => {
            const positiveMessage = screen.getByText(
                /this user email has been verified/i
            )
            expect(positiveMessage).toBeInTheDocument()
        })
    })

    it('disables the "Disable this user account" checkbox for the current user', () => {
        useFeatureToggle.mockReturnValue({ displayEmailVerifiedStatus: true })
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
        useFeatureToggle.mockReturnValue({ displayEmailVerifiedStatus: true })
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
})

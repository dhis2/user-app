import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import EmailStatusMessage from './EmailStatusMessage.jsx'

jest.mock('@dhis2/ui', () => ({
    ...jest.requireActual('@dhis2/ui'),
    colors: {
        green600: 'green',
        red600: 'red',
        default: 'black',
    },
    IconCheckmarkCircle16: () => <div data-test="icon-checkmark-circle" />,
    IconWarning16: () => <div data-test="icon-warning" />,
    IconInfo16: () => <div data-test="icon-info" />,
}))

describe('EmailStatusMessage', () => {
    it('shows the verified email message with the correct icon and color when email is verified', async () => {
        render(
            <EmailStatusMessage
                emailVerified={true}
                enforceVerifiedEmail={true}
                isEmailEdited={false}
            />
        )

        await waitFor(() =>
            screen.getByText(/This user email has been verified/i)
        )
        expect(
            screen.getByText(/This user email has been verified/i)
        ).toBeInTheDocument()

        const icon = await screen.findByTestId('icon-checkmark-circle')
        expect(icon).not.toBe(null)

        const message = screen.getByText('This user email has been verified.')
        expect(message).toHaveStyle('color: green')
    })

    it('displays the unverified email message with the correct icon and color when enforcement is on', async () => {
        render(
            <EmailStatusMessage
                emailVerified={false}
                enforceVerifiedEmail={true}
                isEmailEdited={false}
            />
        )

        await waitFor(() =>
            screen.getByText(/This user does not have a verified email/i)
        )
        expect(
            screen.getByText(/This user does not have a verified email/i)
        ).toBeInTheDocument()

        const icon = await screen.findByTestId('icon-warning')
        expect(icon).not.toBe(null)

        const message = screen.getByText(
            'This user does not have a verified email.'
        )
        expect(message).toHaveStyle('color: red')
    })

    it('displays the unverified email message with the correct icon and color when enforcement is off', async () => {
        render(
            <EmailStatusMessage
                emailVerified={false}
                enforceVerifiedEmail={false}
                isEmailEdited={false}
            />
        )

        await waitFor(() =>
            screen.getByText(/This user does not have a verified email/i)
        )
        expect(
            screen.getByText(/This user does not have a verified email/i)
        ).toBeInTheDocument()

        const icon = await screen.findByTestId('icon-info')
        expect(icon).not.toBe(null)

        const message = screen.getByText(
            'This user does not have a verified email'
        )
        expect(message).toHaveStyle('color: black')
    })

    it('shows the not verified message when email is being edited', async () => {
        render(
            <EmailStatusMessage
                emailVerified={false}
                enforceVerifiedEmail={false}
                isEmailEdited={true}
            />
        )

        await waitFor(() =>
            screen.getByText(/This user does not have a verified email/i)
        )
        expect(
            screen.getByText(/This user does not have a verified email/i)
        ).toBeInTheDocument()

        const icon = await screen.findByTestId('icon-info')
        expect(icon).not.toBe(null)

        const message = screen.getByText(
            'This user does not have a verified email'
        )
        expect(message).toHaveStyle('color: black')
    })
})

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ContextMenu from './ContextMenu.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: jest.fn(() => ({ systemInfo: { emailConfigured: true } })),
}))

jest.mock('../../../hooks/useCurrentUser.js', () => ({
    useCurrentUser: jest.fn(() => ({ id: 'anotherID01', authorities: [] })),
}))

jest.mock('./Modals/ReplicateModal.js', () =>
    jest.fn(() => <p>Replicate modal</p>)
)

const DEFAULT_USER = {
    access: {
        delete: false,
        read: true,
        update: true,
    },
    disabled: false,
    id: 'userABC1234',
    email: 'dhis2user@dhis2.org',
    displayName: 'Nils Holgersson',
    userCredentials: {
        disabled: false,
    },
}

const DEFAULT_PROPS = {
    anchorRef: {},
    refetchUsers: jest.fn(),
    onClose: jest.fn(),
    user: DEFAULT_USER,
}

describe('Context Menu', () => {
    it('should show two factor reset if admin has update access to user object', () => {
        render(<ContextMenu {...DEFAULT_PROPS} />)
        expect(
            screen.getByText('Reset two factor authentication')
        ).toBeInTheDocument()
    })

    it('should not show two factor reset if admin does not have update access to user object', () => {
        const modifiedUser = {
            ...DEFAULT_USER,
            access: { ...DEFAULT_USER.access, update: false },
        }
        render(<ContextMenu {...DEFAULT_PROPS} user={modifiedUser} />)
        expect(
            screen.queryByText('Reset two factor authentication')
        ).not.toBeInTheDocument()
    })

    it('should not show two factor reset if admin is modifying themself', () => {
        const modifiedUser = { ...DEFAULT_USER, id: 'anotherID01' }
        render(<ContextMenu {...DEFAULT_PROPS} user={modifiedUser} />)
        expect(
            screen.queryByText('Reset two factor authentication')
        ).not.toBeInTheDocument()
    })

    it('shows explanation about resetting 2FA when Reset 2FA option is clicked', async () => {
        render(<ContextMenu {...DEFAULT_PROPS} />)

        const resetTwoFAOption = screen.getByText(
            'Reset two factor authentication'
        )
        await waitFor(() => {
            userEvent.click(resetTwoFAOption)
        })
        const explanationText = screen.getByText(
            'If Nils Holgersson has two factor authentication enabled, resetting the two factor authentication will make it possible for them to log in without providing a two factor authentication code.'
        )
        expect(explanationText).toBeInTheDocument()
    })

    // mocking with the Provider is not working well with v40 code, so skipping this test
    it.skip('calls disable mutation when admin clicks through modal to reset 2FA', async () => {
        // render(<ContextMenu {...DEFAULT_PROPS} />)
        // const resetTwoFAOption = screen.getByText(
        //     'Reset two factor authentication'
        // )
        // await waitFor(() => {
        //     userEvent.click(resetTwoFAOption)
        // })
        // const resetTwoFAConfirm = screen.getByText('Yes, reset')
        // await waitFor(() => {
        //     userEvent.click(resetTwoFAConfirm)
        // })
        // expect(mockReset2FA).toHaveBeenCalledTimes(1)
        // expect(mockReset2FA).toHaveBeenCalledWith('create')
    })
})

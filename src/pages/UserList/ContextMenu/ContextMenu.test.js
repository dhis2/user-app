import { Provider, CustomDataProvider } from '@dhis2/app-runtime'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PropTypes from 'prop-types'
import React from 'react'
import ContextMenu from './ContextMenu.jsx'

jest.mock('../../../providers/current-user/useCurrentUser.js', () => ({
    useCurrentUser: jest.fn(() => ({ id: 'anotherID01', authorities: [] })),
}))

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
}

const DEFAULT_PROPS = {
    anchorRef: {},
    refetchUsers: jest.fn(),
    onClose: jest.fn(),
    user: DEFAULT_USER,
}

const CONFIG_DEFAULTS = {
    baseUrl: 'https://debug.dhis2.org/dev',
    apiVersion: '42',
    systemInfo: {
        serverTimeZoneId: 'Etc/UTC',
    },
}

const mockReset2FA = jest.fn()

const getCustomData = ({ userId }) => ({
    [`users/${userId}/twoFA/disabled`]: (type) => {
        mockReset2FA(type)
    },
})

const RenderWrapper = ({ userId, children }) => (
    <Provider config={CONFIG_DEFAULTS}>
        <CustomDataProvider
            data={getCustomData({ userId })}
            queryClientOptions={{}}
        >
            {children}
        </CustomDataProvider>
    </Provider>
)

RenderWrapper.propTypes = {
    children: PropTypes.node,
    userId: PropTypes.string,
}

describe('Context Menu', () => {
    it('should show two factor reset if admin has update access to user object', () => {
        render(
            <RenderWrapper>
                <ContextMenu {...DEFAULT_PROPS} />
            </RenderWrapper>
        )
        expect(
            screen.getByText('Reset two factor authentication')
        ).toBeInTheDocument()
    })

    it('should not show two factor reset if admin does not have update access to user object', () => {
        const modifiedUser = {
            ...DEFAULT_USER,
            access: { ...DEFAULT_USER.access, update: false },
        }
        render(
            <RenderWrapper>
                <ContextMenu {...DEFAULT_PROPS} user={modifiedUser} />
            </RenderWrapper>
        )
        expect(
            screen.queryByText('Reset two factor authentication')
        ).not.toBeInTheDocument()
    })

    it('should not show two factor reset if admin is modifying themself', () => {
        const modifiedUser = { ...DEFAULT_USER, id: 'anotherID01' }
        render(
            <RenderWrapper>
                <ContextMenu {...DEFAULT_PROPS} user={modifiedUser} />
            </RenderWrapper>
        )
        expect(
            screen.queryByText('Reset two factor authentication')
        ).not.toBeInTheDocument()
    })

    it('shows explanation about resetting 2FA when Reset 2FA option is clicked', async () => {
        render(
            <RenderWrapper>
                <ContextMenu {...DEFAULT_PROPS} />
            </RenderWrapper>
        )

        const resetTwoFAOption = screen.getByText(
            'Reset two factor authentication'
        )
        await userEvent.click(resetTwoFAOption)
        const explanationText = screen.getByText(
            'If Nils Holgersson has two factor authentication enabled, resetting the two factor authentication will make it possible for them to log in without providing a two factor authentication code.'
        )
        expect(explanationText).toBeInTheDocument()
    })

    it('calls disable mutation when admin clicks through modal to reset 2FA', async () => {
        render(
            <RenderWrapper userId="userABC1234">
                <ContextMenu {...DEFAULT_PROPS} />
            </RenderWrapper>
        )

        const resetTwoFAOption = screen.getByText(
            'Reset two factor authentication'
        )
        await userEvent.click(resetTwoFAOption)
        const resetTwoFAConfirm = screen.getByText('Yes, reset')

        await userEvent.click(resetTwoFAConfirm)
        expect(mockReset2FA).toHaveBeenCalledTimes(1)
        expect(mockReset2FA).toHaveBeenCalledWith('create')
    })
})

import {
    enableAutoLogin,
    enableNetworkShim,
    isStubMode,
} from '@dhis2/cypress-commands'

if (!isStubMode()) {
    enableAutoLogin()
}
enableNetworkShim()

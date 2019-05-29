export const PAGE_SIZE = 50
export const PAGE = 1

export const LIST_FILTER = {
    query: '', // string
    inactiveMonths: null, // Number
    selfRegistered: false, // Bool
    invitationStatus: null, // 'all' || 'expired',
    organisationUnits: [],
}

export const INITIAL_SNACKBAR_STATE = {
    show: false,
    props: {
        message: '',
    },
}

export const INITIAL_DIALOG_STATE = {
    show: false,
    props: {},
    content: null,
}

export const INITIAL_SHARING_STATE = {
    show: false,
    id: null,
    type: null,
}

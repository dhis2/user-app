import * as ACTIONS from '../constants/actionTypes';
import { PAGE as DEFAULT_PAGE } from '../constants/defaults';
import api from '../api';

// Helpers
const createAction = (type, payload) => ({ type, payload });

// List fetching
const createListRequestActionSequence = (dispatch, promise, type, silent) => {
    if (!silent) {
        dispatch(createAction(ACTIONS.LIST_REQUESTED, type));
    }
    promise
        .then(response =>
            dispatch(createAction(ACTIONS.LIST_RECEIVED, { type, response }))
        )
        .catch(error => dispatch(createAction(ACTIONS.LIST_ERRORED, { type, error })));
};

export const getList = (entityName, silent) => (dispatch, getState) => {
    const { filter, pager } = getState();
    const page = pager ? pager.page : DEFAULT_PAGE;
    const promise = api.getList(entityName, page, filter);
    createListRequestActionSequence(dispatch, promise, entityName, silent);
};

export const incrementPage = pager => dispatch => {
    createListRequestActionSequence(dispatch, pager.getNextPage());
};

export const decrementPage = pager => dispatch => {
    createListRequestActionSequence(dispatch, pager.getPreviousPage());
};

// Item fetching
const createItemRequestActionSequence = (dispatch, promise, receivedActionName) => {
    dispatch(createAction(ACTIONS.ITEM_REQUESTED));
    promise
        .then(response => dispatch(createAction(receivedActionName, response)))
        .catch(error => dispatch(createAction(ACTIONS.ITEM_ERRORED, error.message)));
};

export const getUser = id => (dispatch, getState) => {
    createItemRequestActionSequence(
        dispatch,
        api.getUser(id),
        ACTIONS.USER_ITEM_RECEIVED
    );
};

// Regular actions
export const updateFilter = (currentFilter, updateKey, updateValue) => {
    return createAction(ACTIONS.FILTER_UPDATED, {
        currentFilter,
        updateKey,
        updateValue,
    });
};

export const resetFilter = forUsers => {
    const actionType = forUsers ? ACTIONS.FILTER_RESET_FOR_USER : ACTIONS.FILTER_RESET;
    return createAction(actionType);
};

export const resetPager = () => {
    return createAction(ACTIONS.PAGER_RESET);
};

export const showSnackbar = props => {
    return createAction(ACTIONS.SHOW_SNACKBAR, props);
};

export const hideSnackbar = () => {
    return createAction(ACTIONS.HIDE_SNACKBAR);
};

export const showDialog = (content, props) => {
    return createAction(ACTIONS.SHOW_DIALOG, { content, props });
};

export const hideDialog = () => {
    return createAction(ACTIONS.HIDE_DIALOG);
};

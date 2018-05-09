import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { RaisedButton } from 'material-ui';
import { TextField } from 'redux-form-material-ui';
import { orange500 } from 'material-ui/styles/colors';
import i18n from '@dhis2/d2-i18n';
import api from '../api';
import { connect } from 'react-redux';
import { USER } from '../constants/entityTypes';
import asyncValidateUsername from '../containers/UserForm/asyncValidateUsername';
import checkPasswordForErrors from '../utils/checkPasswordForErrors';
import createHumanErrorMessage from '../utils/createHumanErrorMessage';
import { getList, hideDialog, showSnackbar, hideSnackbar } from '../actions';

const FORM_NAME = 'replicateUserForm';
const USERNAME = 'username';
const PASSWORD = 'password';

const validate = (values, props) => {
    const { pristine } = props;
    let errors = {};
    let requiredFieldErrorMsg = i18n.t('This field is required');
    if (pristine) {
        return errors;
    }

    [USERNAME, PASSWORD].forEach(fieldName => {
        if (!values[fieldName]) {
            errors[fieldName] = requiredFieldErrorMsg;
        }
    });

    const passwordError = values[PASSWORD] && checkPasswordForErrors(values[PASSWORD]);
    if (passwordError) {
        errors[PASSWORD] = passwordError;
    }
    return errors;
};

/**
 * Form component for replicating a using redux-form and displayed in a Dialog
 */
class ReplicateUserForm extends Component {
    shouldComponentUpdate(nextProps) {
        return typeof nextProps.asyncValidating !== 'string';
    }

    replicateUser = async data => {
        const { userIdToReplicate, hideDialog } = this.props;
        const { username, password } = data;
        try {
            await api.replicateUser(userIdToReplicate, username, password);
            this.replicateSuccesHandler();
        } catch (error) {
            this.replicateErrorHandler(error);
        }
        hideDialog();
    };

    replicateSuccesHandler = () => {
        const { getList, showSnackbar } = this.props;
        showSnackbar({ message: i18n.t('User replicated successfuly') });
        getList(USER, true);
    };

    replicateErrorHandler = error => {
        const { showSnackbar } = this.props;
        showSnackbar({
            message: createHumanErrorMessage(
                error,
                i18n.t('There was a problem replicating the user')
            ),
        });
    };

    shouldDisableSubmit() {
        const { formState, asyncValidating, pristine, valid } = this.props;
        const hasBothFields =
            formState &&
            formState.values &&
            formState.values[USERNAME] &&
            formState.values[PASSWORD];
        return !!(asyncValidating || pristine || !valid || !hasBothFields);
    }

    getLoadingProps() {
        return {
            errorText: i18n.t('Validating...'),
            errorStyle: { color: orange500 },
        };
    }

    render() {
        const { handleSubmit, hideDialog, asyncValidating } = this.props;
        const submitDisabled = this.shouldDisableSubmit();
        const isCheckingUsername = asyncValidating === USERNAME;
        const validatingProps = isCheckingUsername ? this.getLoadingProps() : null;

        return (
            <form onSubmit={handleSubmit(this.replicateUser)}>
                <Field
                    name={USERNAME}
                    component={TextField}
                    floatingLabelText={i18n.t('Username')}
                    hintText={i18n.t('Username for new user')}
                    fullWidth={true}
                    {...validatingProps}
                />
                <Field
                    name={PASSWORD}
                    component={TextField}
                    floatingLabelText={i18n.t('Password')}
                    hintText={i18n.t('Password for new user')}
                    fullWidth={true}
                    type="password"
                />
                <div style={{ marginTop: 16 }}>
                    <RaisedButton
                        label={i18n.t('Replicate')}
                        type="submit"
                        disabled={submitDisabled}
                        primary={true}
                    />
                    <RaisedButton
                        label={i18n.t('Cancel')}
                        onClick={hideDialog}
                        style={{ marginLeft: 8 }}
                    />
                </div>
            </form>
        );
    }
}

ReplicateUserForm.propTypes = {
    userIdToReplicate: PropTypes.string.isRequired,
    hideDialog: PropTypes.func.isRequired,
    getList: PropTypes.func.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    formState: PropTypes.object,
    asyncValidating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    pristine: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ formState: state.form[FORM_NAME] });

const ReduxFormWrapped = reduxForm({
    form: FORM_NAME,
    validate,
    asyncValidate: asyncValidateUsername,
    asyncBlurFields: [USERNAME],
})(ReplicateUserForm);

export default connect(mapStateToProps, {
    getList,
    hideDialog,
    showSnackbar,
    hideSnackbar,
})(ReduxFormWrapped);

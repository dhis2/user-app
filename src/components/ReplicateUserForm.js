import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { RaisedButton } from 'material-ui';
import { TextField } from 'redux-form-material-ui';
import { orange500 } from 'material-ui/styles/colors';
import i18next from 'i18next';
import api from '../api';
import { connect } from 'react-redux';
import { USER } from '../constants/entityTypes';
import asyncValidateUsername from '../containers/UserForm/asyncValidateUsername';
import { checkPasswordForErrors } from '../utils/';
import { getList, hideDialog, showSnackbar, hideSnackbar } from '../actions';

const FORM_NAME = 'replicateUserForm';
const USERNAME = 'username';
const PASSWORD = 'password';

const validate = (values, props) => {
    const { pristine } = props;
    let errors = {};
    let requiredFieldErrorMsg = i18next.t('This field is required');
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

class ReplicateUserForm extends Component {
    onHandleSubmit = data => {
        const { userIdToReplicate, hideDialog } = this.props;
        const { username, password } = data;
        api
            .replicateUser(userIdToReplicate, username, password)
            .then(this.onReplicationSucces)
            .catch(this.onReplicationError);
        hideDialog();
    };

    onReplicationSucces = () => {
        const { getList, showSnackbar } = this.props;
        showSnackbar({ message: i18next.t('User replicated successfuly') });
        getList(USER, true);
    };

    onReplicationError = () => {
        const { showSnackbar } = this.props;
        showSnackbar({ message: i18next.t('There was a problem replicating the user') });
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
            errorText: i18next.t('Validating...'),
            errorStyle: { color: orange500 },
        };
    }

    render() {
        const { hideDialog, handleSubmit, asyncValidating } = this.props;
        const submitDisabled = this.shouldDisableSubmit();
        const isCheckingUsername = asyncValidating === USERNAME;
        const validatingProps = isCheckingUsername ? this.getLoadingProps() : null;

        return (
            <form onSubmit={handleSubmit(this.onHandleSubmit)}>
                <Field
                    name={USERNAME}
                    component={TextField}
                    floatingLabelText={i18next.t('Username')}
                    hintText={i18next.t('Username for new user')}
                    fullWidth={true}
                    {...validatingProps}
                />
                <Field
                    name={PASSWORD}
                    component={TextField}
                    floatingLabelText={i18next.t('Password')}
                    hintText={i18next.t('Password for new user')}
                    fullWidth={true}
                    type="password"
                />
                <div style={{ marginTop: 16 }}>
                    <RaisedButton
                        label={i18next.t('Replicate')}
                        type="submit"
                        disabled={submitDisabled}
                        primary={true}
                    />
                    <RaisedButton
                        label={i18next.t('Cancel')}
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

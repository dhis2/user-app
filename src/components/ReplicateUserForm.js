import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { RaisedButton } from 'material-ui';
import { renderTextField } from '../utils/fieldRenderers';
import i18n from '@dhis2/d2-i18n';
import api from '../api';
import { connect } from 'react-redux';
import { USER } from '../constants/entityTypes';
import { asyncValidateUsername } from '../containers/UserForm/asyncValidateUsername';
import { validateUsername } from '../containers/UserForm/validate';
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

    if (!errors[USERNAME]) {
        validateUsername(errors, values[USERNAME]);
    }

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
    replicateUser = async data => {
        const { userToReplicate, hideDialog } = this.props;
        const { username, password } = data;
        try {
            await api.replicateUser(userToReplicate.id, username, password);
            this.replicateSuccesHandler(userToReplicate.displayName);
        } catch (error) {
            this.replicateErrorHandler(error);
        }
        hideDialog();
    };

    replicateSuccesHandler = displayName => {
        const { getList, showSnackbar } = this.props;
        const message = i18n.t('User "{{displayName}}" replicated successfuly', {
            displayName,
        });
        showSnackbar({ message });
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

    render() {
        const {
            submitting,
            pristine,
            valid,
            handleSubmit,
            hideDialog,
            asyncValidating,
        } = this.props;

        const disableSubmit = Boolean(
            submitting || asyncValidating || pristine || !valid
        );

        return (
            <form onSubmit={handleSubmit(this.replicateUser)}>
                <Field
                    name={USERNAME}
                    component={renderTextField}
                    label={i18n.t('Username')}
                    hintText={i18n.t('Username for new user')}
                />
                <Field
                    name={PASSWORD}
                    component={renderTextField}
                    label={i18n.t('Password')}
                    hintText={i18n.t('Password for new user')}
                    type="password"
                />
                <div style={{ marginTop: 16 }}>
                    <RaisedButton
                        label={i18n.t('Replicate')}
                        type="submit"
                        disabled={disableSubmit}
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
    userToReplicate: PropTypes.object.isRequired,
    hideDialog: PropTypes.func.isRequired,
    getList: PropTypes.func.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    formState: PropTypes.object,
    asyncValidating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
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

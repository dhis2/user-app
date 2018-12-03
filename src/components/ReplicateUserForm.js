import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { RaisedButton } from 'material-ui';
import { renderTextField } from '../utils/fieldRenderers';
import i18n from '@dhis2/d2-i18n';
import api from '../api';
import { connect } from 'react-redux';
import { USER } from '../constants/entityTypes';
import { USERNAME, PASSWORD } from '../containers/UserForm/config';
import { username, password } from '../utils/validators';
import { asyncValidateUsername } from '../utils/validatorsAsync';
import createHumanErrorMessage from '../utils/createHumanErrorMessage';
import { getList, hideDialog, showSnackbar, hideSnackbar } from '../actions';

export const FORM_NAME = 'replicateUserForm';

/**
 * Form component for replicating a using redux-form and displayed in a Dialog
 */
class ReplicateUserForm extends Component {
    replicateUser = async data => {
        const { user, hideDialog } = this.props;
        const { username, password } = data;
        try {
            await api.replicateUser(user.id, username, password);
            this.replicateSuccesHandler(user.displayName);
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
                    validate={[username]}
                />
                <Field
                    name={PASSWORD}
                    component={renderTextField}
                    label={i18n.t('Password')}
                    hintText={i18n.t('Password for new user')}
                    validate={[password]}
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
    user: PropTypes.object.isRequired,
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
    asyncValidate: asyncValidateUsername,
    asyncBlurFields: [USERNAME],
})(ReplicateUserForm);

export default connect(mapStateToProps, {
    getList,
    hideDialog,
    showSnackbar,
    hideSnackbar,
})(ReduxFormWrapped);

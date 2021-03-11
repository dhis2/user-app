import i18n from '@dhis2/d2-i18n'
import { RaisedButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { getList, hideDialog, showSnackbar, hideSnackbar } from '../actions'
import api from '../api'
import { USER } from '../constants/entityTypes'
import { USERNAME, PASSWORD } from '../containers/UserForm/config'
import createHumanErrorMessage from '../utils/createHumanErrorMessage'
import { renderTextField } from '../utils/fieldRenderers'
import { username, password } from '../utils/validators'
import { asyncValidateUsername } from '../utils/validatorsAsync'

export const FORM_NAME = 'replicateUserForm'

/**
 * Form component for replicating a using redux-form and displayed in a Dialog
 */
class ReplicateUserForm extends Component {
    replicateUser = async data => {
        const { user, hideDialog } = this.props
        const { username, password } = data
        try {
            await api.replicateUser(user.id, username, password)
            this.replicateSuccesHandler(user.displayName)
        } catch (error) {
            this.replicateErrorHandler(error)
        }
        hideDialog()
    }

    replicateSuccesHandler = displayName => {
        const { getList, showSnackbar } = this.props
        const message = i18n.t(
            'User "{{displayName}}" replicated successfuly',
            {
                displayName,
            }
        )
        showSnackbar({ message })
        getList(USER, true)
    }

    replicateErrorHandler = error => {
        const { showSnackbar } = this.props
        showSnackbar({
            message: createHumanErrorMessage(
                error,
                i18n.t('There was a problem replicating the user')
            ),
        })
    }

    render() {
        const {
            submitting,
            pristine,
            valid,
            handleSubmit,
            hideDialog,
            asyncValidating,
        } = this.props

        const disableSubmit = Boolean(
            submitting || asyncValidating || pristine || !valid
        )

        return (
            <form
                autoComplete="off"
                onSubmit={handleSubmit(this.replicateUser)}
            >
                <Field
                    name={USERNAME}
                    component={renderTextField}
                    label={i18n.t('Username')}
                    hintText={i18n.t('Username for new user')}
                    validate={[username]}
                    autoComplete="new-password"
                />
                <Field
                    name={PASSWORD}
                    component={renderTextField}
                    label={i18n.t('Password')}
                    hintText={i18n.t('Password for new user')}
                    validate={[password]}
                    type="password"
                    autoComplete="new-password"
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
        )
    }
}

ReplicateUserForm.propTypes = {
    getList: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    hideDialog: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    valid: PropTypes.bool.isRequired,
    asyncValidating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
}

const mapStateToProps = state => ({ formState: state.form[FORM_NAME] })

const ReduxFormWrapped = reduxForm({
    form: FORM_NAME,
    asyncValidate: asyncValidateUsername,
    asyncBlurFields: [USERNAME],
})(ReplicateUserForm)

export default connect(mapStateToProps, {
    getList,
    hideDialog,
    showSnackbar,
    hideSnackbar,
})(ReduxFormWrapped)

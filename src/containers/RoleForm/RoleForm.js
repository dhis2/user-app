import i18n from '@dhis2/d2-i18n'
import RaisedButton from 'material-ui/RaisedButton'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { clearItem, showSnackbar, getList } from '../../actions'
import api from '../../api'
import { USER_ROLE } from '../../constants/entityTypes'
import createHumanErrorMessage from '../../utils/createHumanErrorMessage'
import detectCurrentUserChanges from '../../utils/detectCurrentUserChanges'
import navigateTo from '../../utils/navigateTo'
import { required } from '../../utils/validators'
import { asyncValidateUniqueness } from '../../utils/validatorsAsync'
import { NAME, DESCRIPTION, AUTHORITIES, getFields } from './config'

/**
 * Container component that is controlled by redux-form. It renders an array of fields and validates their input.
 * When valid it will save on submit and show relevant snackbar message.
 */
class RoleForm extends Component {
    fields = getFields()

    saveRole = async (values, _, props) => {
        const { role, showSnackbar, clearItem, getList } = props
        const data = {
            ...role.toJSON(),
            [NAME]: values[NAME],
            [DESCRIPTION]: values[DESCRIPTION],
            [AUTHORITIES]: values[AUTHORITIES],
        }

        try {
            await api.saveRole(data)
            const msg = i18n.t(
                'User role "{{displayName}}" saved successfully',
                {
                    displayName: data[NAME],
                }
            )
            showSnackbar({ message: msg })
            clearItem()
            getList(USER_ROLE)
            this.backToList()
            detectCurrentUserChanges(role)
        } catch (error) {
            showSnackbar({
                message: createHumanErrorMessage(
                    error,
                    i18n.t('There was a problem saving the user role.')
                ),
            })
        }
    }

    backToList = () => {
        navigateTo('/user-roles')
    }

    renderFields() {
        return this.fields.map(fieldConfig => {
            const {
                name,
                fieldRenderer,
                label,
                isRequiredField,
                ...conf
            } = fieldConfig
            const suffix = isRequiredField ? ' *' : ''
            const labelText = label + suffix
            const validators = name === NAME ? [required] : []

            return (
                <Field
                    name={name}
                    key={name}
                    component={fieldRenderer}
                    label={labelText}
                    validate={validators}
                    {...conf}
                />
            )
        })
    }

    render = () => {
        const {
            handleSubmit,
            submitting,
            asyncValidating,
            pristine,
            valid,
        } = this.props
        const disableSubmit = Boolean(
            submitting || asyncValidating || pristine || !valid
        )
        return (
            <main>
                <form autoComplete="off" onSubmit={handleSubmit(this.saveRole)}>
                    {this.renderFields()}
                    <div style={{ marginTop: '2rem' }}>
                        <RaisedButton
                            label={i18n.t('Save')}
                            type="submit"
                            primary={true}
                            disabled={disableSubmit}
                            style={{ marginRight: '8px' }}
                        />
                        <RaisedButton
                            label={i18n.t('Cancel')}
                            onClick={this.backToList}
                        />
                    </div>
                </form>
            </main>
        )
    }
}

RoleForm.propTypes = {
    asyncValidating: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
        .isRequired,
    clearItem: PropTypes.func.isRequired,
    getList: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    role: PropTypes.object.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    role: state.currentItem,
    initialValues: {
        [NAME]: state.currentItem[NAME],
        [DESCRIPTION]: state.currentItem[DESCRIPTION],
        [AUTHORITIES]: state.currentItem[AUTHORITIES] || [],
    },
})

const ReduxFormWrappedRoleForm = reduxForm({
    form: 'roleForm',
    asyncValidate: asyncValidateUniqueness,
    asyncBlurFields: [NAME],
})(RoleForm)

export default connect(mapStateToProps, {
    clearItem,
    showSnackbar,
    getList,
})(ReduxFormWrappedRoleForm)

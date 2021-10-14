/* eslint-disable max-params */

import i18n from '@dhis2/d2-i18n'
import CircularProgress from 'material-ui/CircularProgress'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import HardwareKeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import HardwareKeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import makeTrashable from 'trashable'
import { clearItem, getList, showSnackbar } from '../../actions'
import api from '../../api'
import { USER } from '../../constants/entityTypes'
import {
    userFormInitialValuesSelector,
    inviteUserValueSelector,
} from '../../selectors'
import asArray from '../../utils/asArray'
import {
    generateAttributeFields,
    addUniqueAttributesToAsyncBlurFields,
} from '../../utils/attributeFieldHelpers'
import createHumanErrorMessage from '../../utils/createHumanErrorMessage'
import detectCurrentUserChanges from '../../utils/detectCurrentUserChanges'
import {
    renderTextField,
    renderText,
    renderSearchableOrgUnitTree,
    renderSearchableGroupEditor,
    renderSelectField,
} from '../../utils/fieldRenderers'
import getNestedProp from '../../utils/getNestedProp'
import navigateTo from '../../utils/navigateTo'
import { asyncValidatorSwitch } from '../../utils/validatorsAsync'
import collectValidators from './collectValidators'
import * as CONFIG from './config'

/**
 * Container component that is controlled by redux-form. When mounting, it will fetch available and selected locales.
 * Once these are loaded, it renders an array of fields and validates their input.
 * When valid it will save on submit and show relevant snackbar message.
 */
class UserForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showMore: false,
            locales: null,
            attributeFields: null,
        }
        this.trashableAttributesPromise = null
        this.trashableLocalePromise = null
        this.inviteFields = CONFIG.getInviteFields()
        this.baseFields = CONFIG.getBaseFields()
        this.additionalFields = CONFIG.getAdditionalFields()
    }

    async componentDidMount() {
        const { user, showSnackbar, initialize } = this.props
        const username = user.id ? user.userCredentials.username : null

        this.trashableLocalePromise = makeTrashable(
            api.getSelectedAndAvailableLocales(username)
        )
        this.trashableAttributesPromise = makeTrashable(api.getAttributes(USER))

        try {
            const locales = await this.trashableLocalePromise
            const attributes = await this.trashableAttributesPromise
            const attributeFields = generateAttributeFields(
                attributes,
                user.attributeValues
            )
            addUniqueAttributesToAsyncBlurFields(
                attributeFields,
                this.props.asyncBlurFields
            )
            this.setState({ locales, attributeFields })
            initialize(
                userFormInitialValuesSelector(user, locales, attributeFields)
            )
        } catch (error) {
            console.error(error)
            showSnackbar({
                message: createHumanErrorMessage(
                    error,
                    i18n.t(
                        'Could not load the user data. Please refresh the page.'
                    )
                ),
            })
        }
    }

    componentWillUnmount() {
        this.trashableLocalePromise.trash()
        this.trashableAttributesPromise.trash()
    }

    toggleShowMore = () => {
        this.setState({
            showMore: !this.state.showMore,
        })
    }

    handleSubmit = async (values, _, props) => {
        const { user, inviteUser, showSnackbar, clearItem, getList } = props
        const initialUiLocale = this.state.locales.ui.selected
        const initialDbLocale = this.state.locales.db.selected

        try {
            await api.saveOrInviteUser(
                values,
                user,
                inviteUser,
                initialUiLocale,
                initialDbLocale,
                this.state.attributeFields
            )
            const msg = i18n.t('User "{{displayName}}" saved successfully', {
                displayName: `${values.firstName} ${values.surname}`,
            })
            showSnackbar({ message: msg })
            clearItem()
            getList(USER)
            this.backToList()
            detectCurrentUserChanges(user)
        } catch (error) {
            console.error(error)
            showSnackbar({
                message: createHumanErrorMessage(
                    error,
                    i18n.t('There was a problem saving the user.')
                ),
            })
        }
    }

    backToList = () => {
        navigateTo('/users')
    }

    getLabelText(label, user, isRequiredField) {
        const { inviteUser } = this.props
        return isRequiredField === CONFIG.ALWAYS_REQUIRED ||
            (inviteUser && isRequiredField === CONFIG.INVITE_REQUIRED) ||
            (isRequiredField === CONFIG.CREATE_REQUIRED &&
                !user.id &&
                !inviteUser) ||
            (typeof isRequiredField === 'boolean' && isRequiredField)
            ? `${label} *`
            : label
    }

    prepareGroupEditor(conf, fieldConfig, user, isRequiredField) {
        conf.assignedItemsLabel = this.getLabelText(
            conf.assignedItemsLabel,
            user,
            isRequiredField
        )
        conf.initialValues = fieldConfig.initialItemsSelector(user)
    }

    exludeField(fieldName) {
        const { user, inviteUser, externalAuthOnly } = this.props
        const systemCanEmail = this.context.d2.system.systemInfo.emailConfigured

        if ((!systemCanEmail || user.id) && fieldName === CONFIG.INVITE) {
            return true
        }

        if (
            (inviteUser || externalAuthOnly) &&
            (fieldName === CONFIG.PASSWORD ||
                fieldName === CONFIG.REPEAT_PASSWORD)
        ) {
            return true
        }

        if (
            inviteUser &&
            [CONFIG.EXTERNAL_AUTH, CONFIG.OPEN_ID, CONFIG.LDAP_ID].includes(
                fieldName
            )
        ) {
            return true
        }

        return false
    }

    renderFields(fields) {
        const { user } = this.props

        return fields.reduce((filteredFields, fieldConfig) => {
            const {
                name,
                fieldRenderer,
                label,
                isRequiredField,
                isAttributeField,
                fieldValidators,
                ...conf
            } = fieldConfig
            const labelText = this.getLabelText(label, user, isRequiredField)

            if (this.exludeField(name)) {
                return filteredFields
            }

            if (fieldRenderer === renderText) {
                filteredFields.push(renderText(fieldConfig))
                return filteredFields
            }

            switch (fieldRenderer) {
                case renderTextField:
                    if (!conf.hintText) {
                        conf.hintText = label
                    }
                    conf.disabled = Boolean(name === CONFIG.USERNAME && user.id)
                    break
                case renderSearchableOrgUnitTree:
                    conf.initialValues = asArray(user[fieldConfig.name])
                    break
                case renderSearchableGroupEditor:
                    this.prepareGroupEditor(
                        conf,
                        fieldConfig,
                        user,
                        isRequiredField
                    )
                    break
                case renderSelectField:
                    conf.options = fieldConfig.optionsSelector
                        ? getNestedProp(fieldConfig.optionsSelector, this.state)
                        : fieldConfig.options
                    break
                default:
                    break
            }

            conf.validate = collectValidators(
                this.props,
                name,
                isRequiredField,
                isAttributeField,
                fieldValidators
            )

            filteredFields.push(
                <Field
                    name={name}
                    key={name}
                    component={fieldRenderer}
                    label={labelText}
                    {...conf}
                />
            )
            return filteredFields
        }, [])
    }

    renderCreateOrInviteField() {
        return this.renderFields(this.inviteFields)
    }

    renderAttributeFields() {
        return this.renderFields(this.state.attributeFields)
    }

    renderBaseFields() {
        return this.renderFields(this.baseFields)
    }

    renderAdditionalFields(showMore) {
        if (!showMore) {
            return null
        }
        return (
            <div style={CONFIG.STYLES.additionalFieldsWrap}>
                {this.renderFields(this.additionalFields)}
            </div>
        )
    }

    renderToggler(showMore) {
        const togglerText = showMore
            ? i18n.t('Show fewer options')
            : i18n.t('Show more options')
        const icon = showMore ? (
            <HardwareKeyboardArrowUp />
        ) : (
            <HardwareKeyboardArrowDown />
        )

        return (
            <div style={CONFIG.STYLES.togglerWrap}>
                <FlatButton
                    onClick={this.toggleShowMore}
                    label={togglerText}
                    style={CONFIG.STYLES.toggler}
                    icon={icon}
                />
            </div>
        )
    }

    render() {
        const {
            handleSubmit,
            submitting,
            asyncValidating,
            pristine,
            valid,
            inviteUser,
        } = this.props
        const { showMore, locales } = this.state
        const disableSubmit = Boolean(
            submitting || asyncValidating || pristine || !valid
        )
        const submitText =
            inviteUser === true ? i18n.t('Send invite') : i18n.t('Save')

        if (!locales) {
            return (
                <div style={CONFIG.STYLES.loaderWrap}>
                    <CircularProgress />
                </div>
            )
        }

        return (
            <main>
                <form
                    autoComplete="off"
                    onSubmit={handleSubmit(this.handleSubmit)}
                >
                    {this.renderCreateOrInviteField()}
                    {this.renderBaseFields()}
                    {this.renderAttributeFields()}
                    {this.renderAdditionalFields(showMore)}
                    {this.renderToggler(showMore)}
                    <div>
                        <RaisedButton
                            label={submitText}
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

UserForm.propTypes = {
    asyncValidating: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
        .isRequired,
    change: PropTypes.func.isRequired,
    clearItem: PropTypes.func.isRequired,
    externalAuthOnly: PropTypes.bool.isRequired,
    getList: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    inviteUser: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    valid: PropTypes.bool.isRequired,
    asyncBlurFields: PropTypes.arrayOf(PropTypes.string),
    fallbackOrgUnits: PropTypes.object,
}

UserForm.contextTypes = {
    d2: PropTypes.object.isRequired,
}

const selector = formValueSelector(CONFIG.FORM_NAME)
const mapStateToProps = state => {
    return {
        user: state.currentItem,
        fallbackOrgUnits:
            state.currentUser[CONFIG.DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS],
        inviteUser: inviteUserValueSelector(state.form[CONFIG.FORM_NAME]),
        externalAuthOnly: Boolean(selector(state, CONFIG.EXTERNAL_AUTH)),
    }
}

const ReduxFormWrappedUserForm = reduxForm({
    form: CONFIG.FORM_NAME,
    asyncValidate: asyncValidatorSwitch,
    asyncBlurFields: [CONFIG.USERNAME],
})(UserForm)

export default connect(mapStateToProps, {
    clearItem,
    showSnackbar,
    getList,
})(ReduxFormWrappedUserForm)

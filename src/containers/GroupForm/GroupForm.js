import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import { Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import makeTrashable from 'trashable'
import navigateTo from '../../utils/navigateTo'
import { asyncValidatorSwitch } from '../../utils/validatorsAsync'
import { renderSearchableGroupEditor } from '../../utils/fieldRenderers'
import createHumanErrorMessage from '../../utils/createHumanErrorMessage'
import { clearItem, showSnackbar, getList } from '../../actions'
import {
    FORM_NAME,
    NAME,
    CODE,
    USERS,
    MANAGED_GROUPS,
    getFields,
} from './config'
import { userGroupFormInitialValuesSelector } from '../../selectors'
import { USER_GROUP } from '../../constants/entityTypes'
import detectCurrentUserChanges from '../../utils/detectCurrentUserChanges'
import {
    generateAttributeFields,
    parseAttributeValues,
    addUniqueAttributesToAsyncBlurFields,
} from '../../utils/attributeFieldHelpers'
import * as CONFIG from './config'
import collectValidators from './collectValidators'
import api from '../../api'

/**
 * Container component that is controlled by redux-form. It renders an array of fields and validates their input.
 * When valid it will save on submit and show relevant snackbar message.
 */
class GroupForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            attributeFields: null,
        }
        this.trashableAttributesPromise = null
        this.fields = getFields()
    }

    async componentDidMount() {
        const { group, showSnackbar, initialize } = this.props

        this.trashableAttributesPromise = makeTrashable(
            api.getAttributes(USER_GROUP)
        )

        try {
            const attributes = await this.trashableAttributesPromise
            const attributeFields = generateAttributeFields(
                attributes,
                group.attributeValues
            )
            addUniqueAttributesToAsyncBlurFields(
                attributeFields,
                this.props.asyncBlurFields
            )
            this.setState({ attributeFields })
            initialize(
                userGroupFormInitialValuesSelector(group, attributeFields)
            )
        } catch (error) {
            console.error(error)
            showSnackbar({
                message: createHumanErrorMessage(
                    error,
                    i18n.t(
                        'Could not load the user group data. Please refresh the page.'
                    )
                ),
            })
        }
    }

    createIdValueObject(value) {
        return {
            id: typeof value === 'string' ? value : value.id,
        }
    }

    saveGroup = async (values, _, props) => {
        const { group, showSnackbar, clearItem, getList } = props

        group[NAME] = values[NAME]
        group[CODE] = values[CODE]
        group[USERS] = values[USERS].map(this.createIdValueObject)
        group[MANAGED_GROUPS] = values[MANAGED_GROUPS].map(
            this.createIdValueObject
        )
        group.attributeValues = parseAttributeValues(
            values,
            this.state.attributeFields
        )

        try {
            await group.save()
            const msg = i18n.t(
                'User group "{{displayName}}" saved successfully',
                {
                    displayName: group.name,
                }
            )
            showSnackbar({ message: msg })
            clearItem()
            getList(USER_GROUP)
            this.backToList()
            detectCurrentUserChanges(group)
        } catch (error) {
            showSnackbar({
                message: createHumanErrorMessage(
                    error,
                    i18n.t('There was a problem saving the user group.')
                ),
            })
        }
    }

    backToList = () => {
        navigateTo('/user-groups')
    }

    renderFields(fields) {
        const { group } = this.props
        return fields.map(fieldConfig => {
            const {
                name,
                fieldRenderer,
                label,
                isRequiredField,
                isAttributeField,
                shouldBeUnique,
                attributeId,
                fieldValidators,
                valueType,
                ...conf
            } = fieldConfig
            const suffix = isRequiredField ? ' *' : ''
            const labelText = label + suffix
            const validators = []

            if (fieldRenderer === renderSearchableGroupEditor) {
                conf.availableItemsQuery = api[conf.availableItemsQuery]
                if (isRequiredField) {
                    conf.assignedItemsLabel += ' *'
                }
                conf.initialValues = fieldConfig.initialItemsSelector(group)
            }

            conf.validate = collectValidators(
                this.props,
                name,
                isRequiredField,
                isAttributeField,
                fieldValidators
            )

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

    render() {
        const {
            handleSubmit,
            submitting,
            asyncValidating,
            pristine,
            valid,
        } = this.props
        const { attributeFields } = this.state
        const disableSubmit = Boolean(
            submitting || asyncValidating || pristine || !valid
        )

        if (!attributeFields) {
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
                    onSubmit={handleSubmit(this.saveGroup)}
                >
                    {this.renderFields(this.fields)}
                    {this.renderFields(attributeFields)}
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

GroupForm.propTypes = {
    asyncBlurFields: PropTypes.arrayOf(PropTypes.string),
    showSnackbar: PropTypes.func.isRequired,
    clearItem: PropTypes.func.isRequired,
    getList: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    group: PropTypes.object.isRequired,
    asyncValidating: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
        .isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    group: state.currentItem,
})

const ReduxFormWrappedGroupForm = reduxForm({
    form: FORM_NAME,
    asyncValidate: asyncValidatorSwitch,
    asyncBlurFields: [NAME, CODE],
})(GroupForm)

export default connect(
    mapStateToProps,
    {
        clearItem,
        showSnackbar,
        getList,
    }
)(ReduxFormWrappedGroupForm)

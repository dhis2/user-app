import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import TextField from 'material-ui/TextField/TextField'
import Checkbox from 'material-ui/Checkbox/Checkbox'
import SelectField from 'material-ui/SelectField/SelectField'
import MenuItem from 'material-ui/MenuItem'
import SearchableGroupEditor from '../components/SearchableGroupEditor'
import SearchableOrgUnitTree from '../components/SearchableOrgUnitTree'
import { orange500 } from 'material-ui/styles/colors'
import AuthorityEditor from '../components/AuthorityEditor'

const styles = {
    checkbox: {
        marginTop: '32px',
        fontSize: '16px',
    },
    warning: {
        color: orange500,
    },
}

export const renderDateField = ({ input, meta, label, ...other }) => {
    const { asyncValidating, touched, error } = meta

    const errorText = asyncValidating
        ? i18n.t('Validating...')
        : touched && error

    if (asyncValidating) {
        other.errorStyle = styles.warning
    }

    return (
        <div style={{ marginTop: 20 }}>
            <label
                htmlFor={input.name}
                style={{
                    display: 'block',
                    color: 'rgba(0, 0, 0, 0.3)',
                    fontSize: 16 * 0.75,
                    lineHeight: `${22 * 0.75}px`,
                }}
            >
                {label}
            </label>

            <div style={{ marginTop: -10 }}>
                <TextField
                    {...input}
                    {...other}
                    type="date"
                    inputWidth="200px"
                    errorText={errorText}
                />
            </div>
        </div>
    )
}

renderDateField.propTypes = {
    input: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
    label: PropTypes.string.isRequired,
    meta: PropTypes.shape({
        asyncValidating: PropTypes.bool,
        error: PropTypes.string,
        touched: PropTypes.bool,
    }).isRequired,
}

/**
 * Helper functions used as "component" props for redux-form Field components.
 * @name fieldRenderers
 * @memberof module:utils
 */
export const renderTextField = ({
    input,
    label,
    meta: { touched, error, asyncValidating },
    ...other
}) => {
    const errorText = asyncValidating
        ? i18n.t('Validating...')
        : touched && error

    if (asyncValidating) {
        other.errorStyle = styles.warning
    }

    return (
        <TextField
            floatingLabelText={label}
            hintText={label}
            fullWidth={true}
            errorText={errorText}
            {...other}
            {...input}
        />
    )
}

export const renderAuthorityEditor = ({ input }) => {
    const initiallySelected = input.value === '' ? [] : input.value
    return (
        <AuthorityEditor
            initiallySelected={initiallySelected}
            reduxFormOnChange={input.onChange}
            reduxFormOnBlur={input.onBlur}
        />
    )
}

export const renderCheckbox = ({ input, label }) => {
    return (
        <Checkbox
            checked={Boolean(input.value)}
            onCheck={input.onChange}
            label={label}
            {...input}
            style={styles.checkbox}
        />
    )
}

export const renderSelectField = ({
    input,
    label,
    meta: { touched, error, asyncValidating },
    options,
    style,
}) => {
    const errorText = asyncValidating
        ? i18n.t('Validating...')
        : touched && error
    const errorStyle = asyncValidating ? styles.warning : undefined

    return (
        <SelectField
            floatingLabelText={label}
            fullWidth={true}
            value={input.value}
            name={input.name}
            onChange={(event, index, value) => {
                input.onChange(value)
                // Trigger onBlur after a value is selected, in order to trigger
                // a validator to run if the SelectField is in the asyncBlurFields list
                setTimeout(() => input.onBlur(value), 1)
            }}
            style={style}
            errorText={errorText}
            errorStyle={errorStyle}
        >
            {options.map(({ id, label }, i) => (
                <MenuItem key={`option_${i}`} value={id} primaryText={label} />
            ))}
        </SelectField>
    )
}

export const renderSearchableGroupEditor = ({
    input,
    meta: { touched, error },
    availableItemsQuery,
    availableItemsLabel,
    assignedItemsLabel,
    initialValues,
    ...other
}) => {
    return (
        <SearchableGroupEditor
            initiallyAssignedItems={initialValues}
            onChange={input.onChange}
            onBlur={input.onBlur}
            availableItemsQuery={availableItemsQuery}
            availableItemsHeader={availableItemsLabel}
            assignedItemsHeader={assignedItemsLabel}
            errorText={touched && error}
            {...other}
        />
    )
}

export const renderSearchableOrgUnitTree = ({
    input,
    meta: { touched, error },
    label,
    wrapperStyle,
    initialValues,
    orgUnitType,
}) => {
    return (
        <SearchableOrgUnitTree
            selectedOrgUnits={initialValues}
            onChange={input.onChange}
            wrapperStyle={wrapperStyle}
            headerText={label}
            orgUnitType={orgUnitType}
            errorText={touched && error}
            onBlur={input.onBlur}
        />
    )
}

export const renderText = ({ name, label, style }) => {
    return (
        <p key={name} style={style}>
            {label}
        </p>
    )
}

const sharedPropTypes = {
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    meta: PropTypes.shape({
        touched: PropTypes.bool.isRequired,
        asyncValidating: PropTypes.bool,
        error: PropTypes.string,
    }),
}

renderTextField.propTypes = sharedPropTypes

renderCheckbox.propTypes = sharedPropTypes

renderSelectField.propTypes = {
    ...sharedPropTypes,
    options: PropTypes.array.isRequired,
}

renderSearchableGroupEditor.propTypes = {
    ...sharedPropTypes,
    availableItemsQuery: PropTypes.func.isRequired,
    initialValues: PropTypes.array.isRequired,
    assignedItemsLabel: PropTypes.string,
    availableItemsLabel: PropTypes.string,
}

renderSearchableOrgUnitTree.propTypes = {
    ...sharedPropTypes,
    initialValues: PropTypes.array.isRequired,
    wrapperStyle: PropTypes.object,
}

renderAuthorityEditor.propTypes = {
    ...sharedPropTypes,
}

renderText.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired,
}

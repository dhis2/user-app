import React from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import TextField from 'material-ui/TextField/TextField';
import Checkbox from 'material-ui/Checkbox/Checkbox';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem';
import SearchableGroupEditor from '../components/SearchableGroupEditor';
import SearchableOrgUnitTree from '../components/SearchableOrgUnitTree';
import { orange500 } from 'material-ui/styles/colors';
import AuthorityEditor from '../components/AuthorityEditor';

const styles = {
    checkbox: {
        marginTop: '32px',
        fontSize: '16px',
    },
    warning: {
        color: orange500,
    },
};

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
    const errorText = asyncValidating ? i18n.t('Validating...') : touched && error;

    if (asyncValidating) {
        other.errorStyle = styles.warning;
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
    );
};

export const renderAuthorityEditor = ({ input }) => {
    const initiallySelected = input.value === '' ? [] : input.value;
    return (
        <AuthorityEditor
            initiallySelected={initiallySelected}
            reduxFormOnChange={input.onChange}
            reduxFormOnBlur={input.onBlur}
        />
    );
};

export const renderCheckbox = ({ input, label }) => {
    return (
        <Checkbox
            checked={Boolean(input.value)}
            onCheck={input.onChange}
            label={label}
            {...input}
            style={styles.checkbox}
        />
    );
};

export const renderSelectField = ({
    input,
    label,
    meta: { touched, error, asyncValidating },
    options,
    style,
}) => {
    const errorText = asyncValidating ? i18n.t('Validating...') : touched && error;
    const errorStyle = asyncValidating ? styles.warning : undefined;

    return (
        <SelectField
            floatingLabelText={label}
            fullWidth={true}
            value={input.value}
            name={input.name}
            onChange={(event, index, value) => {
                input.onChange(value);
                // Trigger onBlur after a value is selected, in order to trigger
                // a validator to run if the SelectField is in the asyncBlurFields list
                setTimeout(() => input.onBlur(value), 1);
            }}
            style={style}
            errorText={errorText}
            errorStyle={errorStyle}
        >
            {options.map(({ id, label }, i) => (
                <MenuItem key={`option_${i}`} value={id} primaryText={label} />
            ))}
        </SelectField>
    );
};

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
    );
};

export const renderSearchableOrgUnitTree = ({
    input,
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
        />
    );
};

export const renderText = ({ name, label, style }) => {
    return (
        <p key={name} style={style}>
            {label}
        </p>
    );
};

const sharedPropTypes = {
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    meta: PropTypes.shape({
        touched: PropTypes.bool.isRequired,
        error: PropTypes.string,
    }),
};

renderTextField.propTypes = sharedPropTypes;

renderCheckbox.propTypes = sharedPropTypes;

renderSelectField.propTypes = {
    ...sharedPropTypes,
    options: PropTypes.array.isRequired,
};

renderSearchableGroupEditor.propTypes = {
    ...sharedPropTypes,
    availableItemsQuery: PropTypes.func.isRequired,
    availableItemsLabel: PropTypes.string,
    assignedItemsLabel: PropTypes.string,
    initialValues: PropTypes.array.isRequired,
};

renderSearchableOrgUnitTree.propTypes = {
    ...sharedPropTypes,
    wrapperStyle: PropTypes.object,
    initialValues: PropTypes.array.isRequired,
};

renderAuthorityEditor.propTypes = {
    ...sharedPropTypes,
    initialValues: PropTypes.array,
};

renderText.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired,
};

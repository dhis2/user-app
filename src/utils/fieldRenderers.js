import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField/TextField';
import Checkbox from 'material-ui/Checkbox/Checkbox';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem';
import SearchableGroupEditor from '../components/SearchableGroupEditor';
import SearchableOrgUnitTree from '../components/SearchableOrgUnitTree';
import AuthorityEditor from '../components/AuthorityEditor';

const styles = {
    checkbox: {
        marginTop: '32px',
        fontSize: '16px',
    },
};

export const renderTextField = ({ input, label, meta: { touched, error }, ...other }) => {
    return (
        <TextField
            floatingLabelText={label}
            hintText={label}
            fullWidth={true}
            errorText={touched && error}
            {...other}
            {...input}
        />
    );
};

export const renderAuthorityEditor = ({
    input,
    label,
    meta: { touched, error },
    ...other
}) => {
    const initiallySelected = input.value === '' ? [] : input.value;
    return (
        <AuthorityEditor
            initiallySelected={initiallySelected}
            reduxFormOnChange={input.onChange}
            reduxFormOnBlur={input.onBlur}
        />
    );
};

export const renderCheckbox = ({ input, label, meta: { touched, error }, ...other }) => {
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
    meta: { touched, error },
    options,
    ...other
}) => {
    return (
        <SelectField
            floatingLabelText={label}
            fullWidth={true}
            {...input}
            onChange={(event, index, value) => input.onChange(value)}
        >
            {options.map(({ locale, name }, i) => (
                <MenuItem key={`option_${i}`} value={locale} primaryText={name} />
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
    meta: { touched, error },
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

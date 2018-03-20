import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField/TextField';
import Checkbox from 'material-ui/Checkbox/Checkbox';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem';
import SearchableGroupEditor from '../../SearchableGroupEditor';
import SearchableOrgUnitTree from '../../SearchableOrgUnitTree';
import { STYLES } from './config';

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

export const renderCheckbox = ({ input, label, meta: { touched, error }, ...other }) => {
    return (
        <Checkbox
            checked={Boolean(input.value)}
            onCheck={input.onChange}
            label={label}
            {...input}
            style={STYLES.checkbox}
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
    const availableItemsHeader = i18next.t(availableItemsLabel);
    const assignedItemsHeader = i18next.t(assignedItemsLabel);
    return (
        <SearchableGroupEditor
            initiallyAssignedItems={initialValues}
            onChange={input.onChange}
            onBlur={input.onBlur}
            availableItemsQuery={availableItemsQuery}
            availableItemsHeader={availableItemsHeader}
            assignedItemsHeader={assignedItemsHeader}
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
}) => {
    return (
        <SearchableOrgUnitTree
            selectedOrgUnits={initialValues}
            onChange={input.onChange}
            wrapperStyle={wrapperStyle}
            headerText={label}
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
    label: PropTypes.string.isRequired,
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

renderText.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired,
};

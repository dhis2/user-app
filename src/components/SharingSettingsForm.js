import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import AsyncAutoComplete from './AsyncAutoComplete';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { RaisedButton } from 'material-ui';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { SelectField } from 'redux-form-material-ui';
import MenuItem from 'material-ui/MenuItem';
import Heading from 'd2-ui/lib/headings/Heading.component';
import i18next from 'i18next';
import api from '../api';
import { connect } from 'react-redux';
import { initialSharingSettingsSelector } from '../selectors';
import { getList, hideDialog, showSnackbar, hideSnackbar } from '../actions';

const styles = {
    heading: {
        fontSize: '14px',
        paddingTop: 0,
    },
    tableCell: {
        paddingLeft: 0,
        fontSize: '14px',
    },
    tableCellRemove: {
        width: '48px',
        paddingLeft: 0,
    },
    deleteIcon: {
        color: '#bdbdbd',
        hoverColor: '#717171',
    },
    tooltip: {
        transform: 'translateY(2px)',
    },
};

const NONE = '--------';
const VIEW = 'r-------';
const VIEW_AND_EDIT = 'rw------';

class SharingSettingsForm extends Component {
    static propTypes = {
        model: PropTypes.object.isRequired,
        getList: PropTypes.func.isRequired,
        hideDialog: PropTypes.func.isRequired,
        showSnackbar: PropTypes.func.isRequired,
        hideSnackbar: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        change: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            accessGroups: this.loadAccessGroups(),
        };

        this.excludeItemsInAccessGroups = this.excludeItemsInAccessGroups.bind(this);
        this.addUserGroupFormSection = this.addUserGroupFormSection.bind(this);
        this.submitSharingSettings = this.submitSharingSettings.bind(this);
        this.renderUserGroupAccesses = this.renderUserGroupAccesses.bind(this);
    }

    loadAccessGroups() {
        const { userGroupAccesses } = this.props.model;
        return userGroupAccesses.map(({ access, displayName, id }) => ({
            access,
            displayName,
            id,
        }));
    }

    getAsyncAutoCompleteProps() {
        return {
            autoCompleteProps: {
                floatingLabelText: i18next.t('Search for user groups to give access to'),
                hintText: i18next.t('Enter user group name'),
                filter: this.excludeItemsInAccessGroups,
            },
            query: api.queryUserGroups,
            selectHandler: this.addUserGroupFormSection,
            minCharLength: 2,
        };
    }

    excludeItemsInAccessGroups(_searchStr, _displayName, { value: { id } }) {
        const { accessGroups } = this.state;
        const { model } = this.props;
        const alreadySelected = accessGroups.some(group => group.id === id);
        const isSelf = id === model.id;
        return !(alreadySelected || isSelf);
    }

    addUserGroupFormSection({ value: { access, displayName, id } }) {
        const { accessGroups } = this.state;
        const { change } = this.props;

        this.setState({
            accessGroups: [
                ...accessGroups,
                {
                    access: VIEW,
                    displayName,
                    id,
                },
            ],
        });

        change(`group_${id}`, VIEW);
    }

    removeUserGroupFormSection(groupToDelete) {
        const { accessGroups } = this.state;
        const deleteIndex = accessGroups.indexOf(groupToDelete);
        const newAccessGroups = [
            ...accessGroups.slice(0, deleteIndex),
            ...accessGroups.slice(deleteIndex + 1),
        ];

        this.setState({ accessGroups: newAccessGroups });
    }

    submitSharingSettings({ publicAccess, ...groups }) {
        const { accessGroups } = this.state;
        const { model, hideDialog } = this.props;
        const { id, modelDefinition: { name: entityType } } = model;

        const userGroupAccesses = accessGroups.map(({ id }) => {
            return {
                access: groups[`group_${id}`],
                id: id,
            };
        });

        const postData = { object: { publicAccess, userGroupAccesses } };
        api
            .updateSharingSettings(entityType, id, postData)
            .then(response => this.showSnackbarAndRefreshList(entityType, false))
            .catch(error => this.showSnackbarAndRefreshList(entityType, true));

        hideDialog();
    }

    showSnackbarAndRefreshList(entityType, hasError) {
        const { showSnackbar, getList } = this.props;
        const successMessage = i18next.t('Sharing settings updated');
        const errorMessage = i18next.t('Something went wrong when, please try again');
        const message = hasError ? errorMessage : successMessage;

        showSnackbar({ message: message });
        getList(entityType);
    }

    renderPublicAccessField() {
        return (
            <TableRow key="publicAccess" displayBorder={false}>
                <TableRowColumn style={styles.tableCell}>
                    {i18next.t('Public access (with login)')}
                </TableRowColumn>
                <TableRowColumn style={styles.tableCell}>
                    <Field name={'publicAccess'} component={SelectField} fullWidth={true}>
                        <MenuItem value={NONE} primaryText={i18next.t('None')} />
                        <MenuItem value={VIEW} primaryText={i18next.t('Can view')} />
                        <MenuItem
                            value={VIEW_AND_EDIT}
                            primaryText={i18next.t('Can view and edit')}
                        />
                    </Field>
                </TableRowColumn>
                <TableRowColumn style={styles.tableCellRemove} />
            </TableRow>
        );
    }

    renderUserGroupAccesses({ fields }) {
        const { accessGroups } = this.state;
        const canViewTxt = i18next.t('Can view');
        const canEditTxt = i18next.t('Can view and edit');
        const tooltipTxt = i18next.t('Delete');

        if (accessGroups.length === 0) {
            return null;
        }

        return accessGroups.map((group, index) => (
            <TableRow key={index} displayBorder={false}>
                <TableRowColumn style={styles.tableCell}>
                    {group.displayName}
                </TableRowColumn>
                <TableRowColumn style={styles.tableCell}>
                    <Field
                        name={`group_${group.id}`}
                        component={SelectField}
                        fullWidth={true}
                    >
                        <MenuItem value={VIEW} primaryText={canViewTxt} />
                        <MenuItem value={VIEW_AND_EDIT} primaryText={canEditTxt} />
                    </Field>
                </TableRowColumn>
                <TableRowColumn style={styles.tableCellRemove}>
                    <IconButton
                        tooltip={tooltipTxt}
                        tooltipPosition={'top-center'}
                        tooltipStyles={styles.tooltip}
                        onClick={() => this.removeUserGroupFormSection(group)}
                    >
                        <ActionDelete
                            color={styles.deleteIcon.color}
                            hoverColor={styles.deleteIcon.hoverColor}
                        />
                    </IconButton>
                </TableRowColumn>
            </TableRow>
        ));
    }

    render() {
        const { handleSubmit, hideDialog, model } = this.props;
        return (
            <div>
                <Heading level={4} style={styles.heading}>
                    {i18next.t('Created by')} {model.user.displayName}
                </Heading>
                <AsyncAutoComplete {...this.getAsyncAutoCompleteProps()} />
                <form onSubmit={handleSubmit(this.submitSharingSettings)}>
                    <Table selectable={false}>
                        <TableBody displayRowCheckbox={false}>
                            {this.renderPublicAccessField()}
                            <FieldArray
                                name="accessGroups"
                                component={this.renderUserGroupAccesses}
                            />
                        </TableBody>
                    </Table>

                    <div style={{ marginTop: 16 }}>
                        <RaisedButton
                            label={i18next.t('Save')}
                            type="submit"
                            primary={true}
                        />
                        <RaisedButton
                            label={i18next.t('Cancel')}
                            onClick={hideDialog}
                            style={{ marginLeft: 8 }}
                        />
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state, { model }) {
    return {
        initialValues: initialSharingSettingsSelector(model),
    };
}

const ReduxFormWrapped = reduxForm({
    form: 'sharingSettingsForm',
})(SharingSettingsForm);

export default connect(mapStateToProps, {
    getList,
    hideDialog,
    showSnackbar,
    hideSnackbar,
})(ReduxFormWrapped);

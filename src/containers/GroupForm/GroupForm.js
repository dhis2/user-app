import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Field, reduxForm } from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import navigateTo from '../../utils/navigateTo';
import asyncValidateUniqueness from '../../utils/asyncValidateUniqueness';
import asArray from '../../utils/asArray';
import { renderSearchableGroupEditor } from '../../utils/fieldRenderers';
import createHumanErrorMessage from '../../utils/createHumanErrorMessage';
import { clearItem, showSnackbar, getList } from '../../actions';
import { NAME, CODE, USERS, MANAGED_GROUPS, FIELDS } from './config';
import { USER_GROUP } from '../../constants/entityTypes';
import detectCurrentUserChanges from '../../utils/detectCurrentUserChanges';
import validate from './validate';
import api from '../../api';

/**
 * Container component that is controlled by redux-form. It renders an array of fields and validates their input.
 * When valid it will save on submit and show relevant snackbar message.
 */
class GroupForm extends Component {
    createIdValueObject(value) {
        return {
            id: typeof value === 'string' ? value : value.id,
        };
    }

    saveGroup = async (values, _, props) => {
        const { group, showSnackbar, clearItem, getList } = props;

        group[NAME] = values[NAME];
        group[CODE] = values[CODE];
        group[USERS] = values[USERS].map(this.createIdValueObject);
        group[MANAGED_GROUPS] = values[MANAGED_GROUPS].map(this.createIdValueObject);

        try {
            await group.save();
            const msg = i18n.t('User group "{{displayName}}" saved successfully', {
                displayName: group.displayName,
            });
            showSnackbar({ message: msg });
            clearItem();
            getList(USER_GROUP);
            this.backToList();
            detectCurrentUserChanges(group);
        } catch (error) {
            showSnackbar({
                message: createHumanErrorMessage(
                    error,
                    i18n.t('There was a problem saving the user group.')
                ),
            });
        }
    };

    backToList = () => {
        navigateTo('/user-groups');
    };

    renderFields() {
        const { group } = this.props;
        return FIELDS.map(fieldConfig => {
            const { name, fieldRenderer, label, isRequiredField, ...conf } = fieldConfig;
            const suffix = isRequiredField ? ' *' : '';
            const labelText = label + suffix;

            if (fieldRenderer === renderSearchableGroupEditor) {
                conf.availableItemsQuery = api[conf.availableItemsQuery];
                if (isRequiredField) {
                    conf.assignedItemsLabel += ' *';
                }
                conf.initialValues = fieldConfig.initialItemsSelector(group);
            }

            return (
                <Field
                    name={name}
                    key={name}
                    component={fieldRenderer}
                    label={labelText}
                    {...conf}
                />
            );
        });
    }

    render() {
        const { handleSubmit, submitting, asyncValidating, pristine, valid } = this.props;
        const disableSubmit = Boolean(
            submitting || asyncValidating || pristine || !valid
        );
        return (
            <main>
                <form onSubmit={handleSubmit(this.saveGroup)}>
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
        );
    }
}

GroupForm.propTypes = {
    showSnackbar: PropTypes.func.isRequired,
    clearItem: PropTypes.func.isRequired,
    getList: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    asyncValidating: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    group: state.currentItem,
    initialValues: {
        [NAME]: state.currentItem[NAME],
        [CODE]: state.currentItem[CODE],
        [USERS]: asArray(state.currentItem[USERS]),
        [MANAGED_GROUPS]: asArray(state.currentItem[MANAGED_GROUPS]),
    },
});

const ReduxFormWrappedGroupForm = reduxForm({
    form: 'groupForm',
    validate,
    asyncValidate: asyncValidateUniqueness,
    asyncBlurFields: [NAME, CODE],
})(GroupForm);

export default connect(mapStateToProps, {
    clearItem,
    showSnackbar,
    getList,
})(ReduxFormWrappedGroupForm);

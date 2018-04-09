import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from 'd2-i18n';
import { Field, reduxForm } from 'redux-form';
import Heading from 'd2-ui/lib/headings/Heading.component';
import RaisedButton from 'material-ui/RaisedButton';
import navigateTo from '../../utils/navigateTo';
import asyncValidateUniqueness from '../../utils/asyncValidateUniqueness';
import asArray from '../../utils/asArray';
import { renderSearchableGroupEditor } from '../../utils/fieldRenderers';
import { clearItem, showSnackbar, getList } from '../../actions';
import { NAME, USERS, MANAGED_GROUPS, FIELDS } from './config';
import { USER_GROUP } from '../../constants/entityTypes';
import validate from './validate';
import api from '../../api';

class GroupForm extends Component {
    saveGroup = (values, _, props) => {
        const { group, showSnackbar, clearItem, getList } = this.props;

        group[NAME] = values[NAME];
        group[USERS] = values[USERS].map(({ id }) => ({ id }));
        group[MANAGED_GROUPS] = values[MANAGED_GROUPS].map(({ id }) => ({ id }));

        group
            .save()
            .then(() => {
                const msg = i18n.t('User group saved successfully');
                showSnackbar({ message: msg });
                clearItem();
                getList(USER_GROUP);
                this.backToList();
            })
            .catch(error => {
                const msg = i18n.t('There was a problem saving the user group.');
                showSnackbar({ message: msg });
            });
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
        const { handleSubmit, asyncValidating, pristine, valid } = this.props;
        const disableSubmit = Boolean(asyncValidating || pristine || !valid);
        return (
            <main>
                <Heading level={2}>{i18n.t('Details')}</Heading>
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
    valid: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    group: state.currentItem,
    initialValues: {
        [NAME]: state.currentItem[NAME],
        [USERS]: asArray(state.currentItem[USERS]),
        [MANAGED_GROUPS]: asArray(state.currentItem[MANAGED_GROUPS]),
    },
});

const ReduxFormWrappedGroupForm = reduxForm({
    form: 'groupForm',
    validate,
    asyncValidate: asyncValidateUniqueness,
    asyncBlurFields: [NAME],
})(GroupForm);

export default connect(mapStateToProps, {
    clearItem,
    showSnackbar,
    getList,
})(ReduxFormWrappedGroupForm);

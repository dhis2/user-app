import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { Field, reduxForm } from 'redux-form';
import Heading from 'd2-ui/lib/headings/Heading.component';
import RaisedButton from 'material-ui/RaisedButton';
import { navigateTo, asyncValidateUniqueness } from '../../utils';
import { clearItem, showSnackbar, getList } from '../../actions';
import { NAME, DESCRIPTION, AUTHORITIES, FIELDS } from './config';
import { USER_ROLE } from '../../constants/entityTypes';
import validate from './validate';

class RoleForm extends Component {
    saveRole = (values, _, props) => {
        const { role, showSnackbar, clearItem, getList } = this.props;
        role[NAME] = values[NAME];
        role[DESCRIPTION] = values[DESCRIPTION];
        role[AUTHORITIES] = values[AUTHORITIES].map(value => ({ id: value }));

        role
            .save()
            .then(() => {
                const msg = i18next.t('User role saved successfully');
                showSnackbar({ message: msg });
                clearItem();
                getList(USER_ROLE);
                this.backToList();
            })
            .catch(error => {
                const msg = i18next.t('There was a problem saving the user role.');
                showSnackbar({ message: msg });
            });
    };

    backToList = () => {
        navigateTo('/user-roles');
    };

    renderFields() {
        return FIELDS.map(fieldConfig => {
            const { name, fieldRenderer, label, isRequiredField, ...conf } = fieldConfig;
            let labelText = i18next.t(label);

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

    render = () => {
        const { handleSubmit, asyncValidating, pristine, valid } = this.props;
        const disableSubmit = Boolean(asyncValidating || pristine || !valid);
        return (
            <main>
                <Heading level={2}>{i18next.t('Details')}</Heading>
                <form onSubmit={handleSubmit(this.saveRole)}>
                    {this.renderFields()}
                    <div style={{ marginTop: '2rem' }}>
                        <RaisedButton
                            label={i18next.t('Save')}
                            type="submit"
                            primary={true}
                            disabled={disableSubmit}
                            style={{ marginRight: '8px' }}
                        />
                        <RaisedButton
                            label={i18next.t('Cancel')}
                            onClick={this.backToList}
                        />
                    </div>
                </form>
            </main>
        );
    };
}

RoleForm.propTypes = {
    showSnackbar: PropTypes.func.isRequired,
    clearItem: PropTypes.func.isRequired,
    getList: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
    role: PropTypes.object.isRequired,
    asyncValidating: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    pristine: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    role: state.currentItem,
    initialValues: {
        [NAME]: state.currentItem[NAME],
        [DESCRIPTION]: state.currentItem[DESCRIPTION],
        [AUTHORITIES]: state.currentItem[AUTHORITIES],
    },
});

const ReduxFormWrappedRoleForm = reduxForm({
    form: 'roleForm',
    validate,
    asyncValidate: asyncValidateUniqueness,
    asyncBlurFields: [NAME],
})(RoleForm);

export default connect(mapStateToProps, {
    clearItem,
    showSnackbar,
    getList,
})(ReduxFormWrappedRoleForm);

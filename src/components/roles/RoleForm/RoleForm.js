import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { Field, reduxForm } from 'redux-form';
import Heading from 'd2-ui/lib/headings/Heading.component';
import RaisedButton from 'material-ui/RaisedButton';
import { navigateTo } from '../../../utils';
import { getItem, initNewItem } from '../../../actions';
import { NAME, DESCRIPTION, AUTHORITIES, FIELDS } from './config';
// import api from '../../api';
import validate from './validate';
import asyncValidateUniqueness from '../../../utils/asyncValidateUniqueness';

class RoleForm extends Component {
    static propTypes = {
        getItem: PropTypes.func.isRequired,
        initNewItem: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        initialValues: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
    };

    saveRole = (values, _, props) => {
        console.log('saving....', values, props);
    };

    backToList = () => {
        navigateTo('/user-roles');
    };

    renderFields = () => {
        // const {role} = this.props;

        return FIELDS.map(fieldConfig => {
            const { name, fieldRenderer, label, isRequiredField, ...conf } = fieldConfig;
            let labelText = i18next.t(label);
            if (name === AUTHORITIES) {
                conf.onAuthorityChange = this.onAuthorityChange;
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
    };

    render = () => {
        const { role, handleSubmit } = this.props;
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
                            disabled={false}
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

const mapStateToProps = state => ({
    role: state.currentItem,
    initialValues: {
        [NAME]: state.currentItem[NAME],
        [DESCRIPTION]: state.currentItem[DESCRIPTION],
        [AUTHORITIES]: state.currentItem[AUTHORITIES],
    },
});

const ReduxFormWrappedRoleForm = reduxForm({
    form: 'userForm',
    validate,
    asyncValidate: asyncValidateUniqueness,
    asyncBlurFields: [NAME],
})(RoleForm);

export default connect(mapStateToProps, {
    getItem,
    initNewItem,
})(ReduxFormWrappedRoleForm);

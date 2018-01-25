import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from '../../constants/lodash';
import { updateFilter, getUsers } from '../../actions';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import * as FILTER_FIELDS from '../../constants/filterFields';

class UserFilter extends Component {
    constructor(props) {
        super(props);
        this.onQueryChange = this.onQueryChange.bind(this);
        this.onSelfRegisteredChange = this.onSelfRegisteredChange.bind(this);
        this.debouncedOnFilterChange = _.debounce(this.onFilterChange.bind(this), 375);
    }

    onFilterChange(fieldName, newValue) {
        const { filter, getUsers, updateFilter } = this.props;
        // Meh empty option in Select returns null as a string
        if (newValue === 'null') {
            newValue = null;
        }
        updateFilter(filter, fieldName, newValue);
        getUsers();
    }

    onQueryChange(event) {
        this.debouncedOnFilterChange(FILTER_FIELDS.QUERY.name, event.target.value);
    }

    onSelfRegisteredChange(event, value) {
        this.onFilterChange(FILTER_FIELDS.SELF_REGISTERED.name, value);
    }

    getFields() {
        const {
            QUERY,
            INACTIVE_MONTHS,
            SELF_REGISTERED,
            INVITATION_STATUS,
        } = FILTER_FIELDS;
        const { filter } = this.props;
        const baseCheckboxClass = SELF_REGISTERED.props.className;

        const query = {
            ...QUERY,
            value: filter.query,
            props: {
                ...QUERY.props,
                onInput: this.onQueryChange,
            },
        };
        const inactiveMonths = {
            ...INACTIVE_MONTHS,
            value: filter.inactiveMonths,
        };
        const invitationStatus = {
            ...INVITATION_STATUS,
            value: filter.invitationStatus,
        };
        const selfRegistered = {
            ...SELF_REGISTERED,
            value: filter.selfRegistered,
            props: {
                ...SELF_REGISTERED.props,
                onCheck: this.onSelfRegisteredChange,
                className: filter.selfRegistered
                    ? `${baseCheckboxClass}--checked`
                    : baseCheckboxClass,
            },
        };

        return [query, inactiveMonths, invitationStatus, selfRegistered];
    }

    render() {
        return (
            <FormBuilder
                fields={this.getFields()}
                onUpdateField={this.onFilterChange.bind(this)}
            />
        );
    }
}
const mapStateToProps = state => {
    return {
        filter: state.filter,
    };
};

export default connect(mapStateToProps, {
    updateFilter,
    getUsers,
})(UserFilter);

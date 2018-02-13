import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from '../../constants/lodash';
import { updateFilter, getList } from '../../actions';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import {
    FIELD_NAMES,
    getQuery,
    getInactiveMonths,
    getInvitationStatus,
    getSelfRegistered,
} from '../../utils/filterFields';

class UserFilter extends Component {
    constructor(props) {
        super(props);
        this.onQueryChange = this.onQueryChange.bind(this);
        this.onSelfRegisteredChange = this.onSelfRegisteredChange.bind(this);
        this.debouncedOnFilterChange = _.debounce(this.onFilterChange.bind(this), 375);
    }

    onFilterChange(fieldName, newValue) {
        const { filter, getList, entityType, updateFilter } = this.props;
        // Meh empty option in Select returns null as a string
        if (newValue === 'null') {
            newValue = null;
        }
        updateFilter(filter, fieldName, newValue);
        getList(entityType);
    }

    onQueryChange(event) {
        this.debouncedOnFilterChange(FIELD_NAMES.QUERY, event.target.value);
    }

    onSelfRegisteredChange(event, value) {
        this.onFilterChange(FIELD_NAMES.SELF_REGISTERED, value);
    }

    getFields() {
        const { filter } = this.props;
        const query = getQuery(filter.query, this.onQueryChange);
        const inactiveMonths = getInactiveMonths(filter.inactiveMonths);
        const invitationStatus = getInvitationStatus(filter.invitationStatus);
        const selfRegistered = getSelfRegistered(
            filter.selfRegistered,
            this.onSelfRegisteredChange
        );
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
    getList,
})(UserFilter);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from '../../constants/lodash';
import { updateFilter, getRoles } from '../../actions';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import * as FILTER_FIELDS from '../../constants/filterFields';

class RoleFilter extends Component {
    static propTypes = {
        filter: PropTypes.object.isRequired,
        getRoles: PropTypes.func.isRequired,
        updateFilter: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.onQueryChange = this.onQueryChange.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.debouncedOnFilterChange = _.debounce(this.onFilterChange.bind(this), 375);
    }

    onFilterChange(fieldName, newValue) {
        const { getRoles, updateFilter } = this.props;
        // Meh empty option in Select returns null as a string
        if (newValue === 'null') {
            newValue = null;
        }
        updateFilter(fieldName, newValue);
        getRoles();
    }

    onQueryChange(event) {
        this.debouncedOnFilterChange(FILTER_FIELDS.QUERY.name, event.target.value);
    }

    getFields() {
        const { QUERY } = FILTER_FIELDS;
        const { filter } = this.props;

        const query = {
            ...QUERY,
            value: filter.query,
            props: {
                ...QUERY.props,
                onInput: this.onQueryChange,
            },
        };
        return [query];
    }

    render() {
        return (
            <FormBuilder fields={this.getFields()} onUpdateField={this.onFilterChange} />
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
    getRoles,
})(RoleFilter);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from '../constants/lodash';
import { updateFilter } from '../actions';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import { FIELD_NAMES, getQuery } from '../utils/filterFields';

class SearchFilter extends Component {
    constructor(props) {
        super(props);
        this.onQueryChange = this.onQueryChange.bind(this);
        this.debouncedOnFilterChange = _.debounce(this.onFilterChange.bind(this), 375);
    }

    onFilterChange(fieldName, newValue) {
        const { filter, getItems, updateFilter } = this.props;
        // Meh empty option in Select returns null as a string
        if (newValue === 'null') {
            newValue = null;
        }
        updateFilter(filter, fieldName, newValue);
        getItems();
    }

    onQueryChange(event) {
        this.debouncedOnFilterChange(FIELD_NAMES.QUERY, event.target.value);
    }

    getFields() {
        const { filter } = this.props;
        const customStyle = { marginBottom: '24px' };
        const query = getQuery(filter.query, this.onQueryChange, customStyle);
        return [query];
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
})(SearchFilter);

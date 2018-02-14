import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from '../constants/lodash';
import { updateFilter, getList } from '../actions';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import { FIELD_NAMES, getQuery } from '../utils/filterFields';

class SearchFilter extends Component {
    static propTypes = {
        filter: PropTypes.object.isRequired,
        getList: PropTypes.func.isRequired,
        entityType: PropTypes.string.isRequired,
        updateFilter: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.onQueryChange = this.onQueryChange.bind(this);
        this.debouncedOnFilterChange = _.debounce(this.onFilterChange.bind(this), 375);
    }

    onFilterChange(fieldName, newValue) {
        const { getList, entityType, updateFilter } = this.props;
        // Meh empty option in Select returns null as a string
        if (newValue === 'null') {
            newValue = null;
        }
        updateFilter(fieldName, newValue);
        getList(entityType);
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
    getList,
    updateFilter,
})(SearchFilter);

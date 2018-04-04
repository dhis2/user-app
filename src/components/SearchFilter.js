import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import TextField from 'material-ui/TextField/TextField';
import _ from '../constants/lodash';
import { updateFilter, getList } from '../actions';
import { QUERY } from '../constants/filterFieldNames';

const style = {
    float: 'left',
    marginRight: '1rem',
    width: '236px',
};

class SearchFilter extends Component {
    static propTypes = {
        filter: PropTypes.object.isRequired,
        getList: PropTypes.func.isRequired,
        entityType: PropTypes.string.isRequired,
        updateFilter: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            localQueryStr: props.filter.query,
        };
        this.updateSearchFilter = _.debounce(this.updateSearchFilter, 375);
    }

    updateSearchFilter = newValue => {
        const { getList, entityType, updateFilter } = this.props;
        updateFilter(QUERY, newValue);
        getList(entityType);
    };

    onQueryStrChange = event => {
        const value = event.target.value;
        this.setState({ localQueryStr: value });
        this.updateSearchFilter(value);
    };

    render() {
        const { localQueryStr } = this.state;
        return (
            <TextField
                className="search-input"
                floatingLabelText={i18next.t('Search by name')}
                style={style}
                hintText={''}
                value={localQueryStr}
                type="search"
                onChange={this.onQueryStrChange}
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

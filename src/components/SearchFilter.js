import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import TextField from 'material-ui/TextField/TextField'
import debounce from 'lodash.debounce'
import { updateFilter, getList } from '../actions'
import { QUERY } from '../constants/filterFieldNames'

const style = {
    float: 'left',
    marginRight: '1rem',
    width: '236px',
}

/**
 * Generic search filter component that is used by the RoleList and the GroupList
 */
class SearchFilter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            localQueryStr: props.filter.query,
        }
        this.updateSearchFilter = debounce(this.updateSearchFilter, 375)
    }

    updateSearchFilter = newValue => {
        const { getList, entityType, updateFilter } = this.props
        updateFilter(QUERY, newValue)
        getList(entityType)
    }

    onQueryStrChange = event => {
        const value = event.target.value
        this.setState({ localQueryStr: value })
        this.updateSearchFilter(value)
    }

    render() {
        const { localQueryStr } = this.state
        return (
            <TextField
                className="search-input"
                floatingLabelText={i18n.t('Search by name')}
                style={style}
                hintText={''}
                value={localQueryStr}
                type="search"
                onChange={this.onQueryStrChange}
            />
        )
    }
}

SearchFilter.propTypes = {
    filter: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    entityType: PropTypes.string.isRequired,
    updateFilter: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
    return {
        filter: state.filter,
    }
}

export default connect(
    mapStateToProps,
    {
        getList,
        updateFilter,
    }
)(SearchFilter)

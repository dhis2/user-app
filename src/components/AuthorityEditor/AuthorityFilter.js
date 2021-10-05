import i18n from '@dhis2/d2-i18n'
import { InputField, CheckboxField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

/**
 * Renders a TextField and Checkbox above the AuthoritySections.
 * The actual filtering is being done in the FilteredAuthoritySections component which uses `utils/filterAuthorities`
 * However, this is done via the AuthorityEditor component
 */
class AuthorityFilter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchStr: '',
            selectedOnly: false,
        }
    }

    onSelectedOnlyChange = ({ checked }) => {
        this.setState({ selectedOnly: checked })
        this.props.onFilterChange(this.state.searchStr, checked)
    }

    onSearchStrChange = ({ value }) => {
        this.setState({ searchStr: value })
        this.props.onFilterChange(value, this.state.selectedOnly)
    }

    render() {
        return (
            <div className="authority-editor__filterbar">
                <InputField
                    className="authority-editor__filter-text-input search-input"
                    label={i18n.t('Search')}
                    onChange={this.onSearchStrChange}
                    type="search"
                    value={this.state.searchStr}
                />
                <CheckboxField
                    className="authority-editor__filter-checkbox"
                    label={i18n.t('Selected authorities only')}
                    checked={this.state.selectedOnly}
                    onChange={this.onSelectedOnlyChange}
                    style={{ width: '300px' }}
                />
            </div>
        )
    }
}

AuthorityFilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
}

export default AuthorityFilter

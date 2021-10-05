import isEqual from 'lodash.isequal'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateFilter, hideDialog, getList } from '../actions'
import SearchableOrgUnitTree from '../components/SearchableOrgUnitTree'
import { USER } from '../constants/entityTypes'
import { TEI_SEARCH_ORG_UNITS } from '../containers/UserForm/config'

/**
 * Displayed inside of a Dialog and displayed by clicking the OrganisationUnitInput.
 * This component renders a SearchableOrgUnitTree and lets a user select one or more organisation units.
 * When this selection is applied the filter state is updated.
 */
class OrganisationUnitFilter extends Component {
    applyFilter = newSelectedOrgUnits => {
        const { updateFilter, hideDialog, getList, selectedOrgUnits } =
            this.props

        if (!isEqual(newSelectedOrgUnits, selectedOrgUnits)) {
            updateFilter('organisationUnits', newSelectedOrgUnits)
            getList(USER)
        }

        hideDialog()
    }

    render() {
        const { selectedOrgUnits, hideDialog } = this.props
        return (
            <SearchableOrgUnitTree
                orgUnitType={TEI_SEARCH_ORG_UNITS}
                selectedOrgUnits={selectedOrgUnits}
                confirmSelection={this.applyFilter}
                cancel={hideDialog}
            />
        )
    }
}

OrganisationUnitFilter.propTypes = {
    getList: PropTypes.func.isRequired,
    hideDialog: PropTypes.func.isRequired,
    selectedOrgUnits: PropTypes.array.isRequired,
    updateFilter: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    selectedOrgUnits: state.filter.organisationUnits,
})

export default connect(mapStateToProps, {
    updateFilter,
    hideDialog,
    getList,
})(OrganisationUnitFilter)

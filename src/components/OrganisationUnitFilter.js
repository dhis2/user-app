import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash.isequal'
import { USER } from '../constants/entityTypes'
import { connect } from 'react-redux'
import { updateFilter, hideDialog, getList } from '../actions'
import SearchableOrgUnitTree from '../components/SearchableOrgUnitTree'
import {
    DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
    TEI_SEARCH_ORG_UNITS,
} from '../containers/UserForm/config'

/**
 * Displayed inside of a Dialog and displayed by clicking the OrganisationUnitInput.
 * This component renders a SearchableOrgUnitTree and lets a user select one or more organisation units.
 * When this selection is applied the filter state is updated.
 */
class OrganisationUnitFilter extends Component {
    applyFilter = newSelectedOrgUnits => {
        const {
            updateFilter,
            hideDialog,
            getList,
            selectedOrgUnits,
        } = this.props

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
    selectedOrgUnits: PropTypes.array.isRequired,
    updateFilter: PropTypes.func.isRequired,
    hideDialog: PropTypes.func.isRequired,
    getList: PropTypes.func.isRequired,
    fallbackOrgUnits: PropTypes.object,
}

const mapStateToProps = state => ({
    selectedOrgUnits: state.filter.organisationUnits,
    fallbackOrgUnits: state.currentUser[DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS],
})

export default connect(
    mapStateToProps,
    {
        updateFilter,
        hideDialog,
        getList,
    }
)(OrganisationUnitFilter)

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from '../constants/lodash';
import { USER } from '../constants/entityTypes';
import { connect } from 'react-redux';
import { updateFilter, hideDialog, getList, appendCurrentUserOrgUnits } from '../actions';
import SearchableOrgUnitTree from '../components/SearchableOrgUnitTree';
import {
    DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
    TEI_SEARCH_ORG_UNITS,
} from '../containers/UserForm/config';

class OrganisationUnitFilter extends Component {
    componentWillMount() {
        const { fallbackOrgUnits, appendCurrentUserOrgUnits } = this.props;
        if (!fallbackOrgUnits) {
            appendCurrentUserOrgUnits();
        }
    }

    applyFilter = newSelectedOrgUnits => {
        const { updateFilter, hideDialog, getList, selectedOrgUnits } = this.props;

        if (!_.isEqual(newSelectedOrgUnits, selectedOrgUnits)) {
            updateFilter('organisationUnits', newSelectedOrgUnits);
            getList(USER);
        }

        hideDialog();
    };

    render() {
        const { selectedOrgUnits, hideDialog } = this.props;
        return (
            <SearchableOrgUnitTree
                orgUnitType={TEI_SEARCH_ORG_UNITS}
                selectedOrgUnits={selectedOrgUnits}
                displayClearFilterButton={true}
                confirmSelection={this.applyFilter}
                cancel={hideDialog}
            />
        );
    }
}

OrganisationUnitFilter.propTypes = {
    selectedOrgUnits: PropTypes.array.isRequired,
    updateFilter: PropTypes.func.isRequired,
    hideDialog: PropTypes.func.isRequired,
    getList: PropTypes.func.isRequired,
    appendCurrentUserOrgUnits: PropTypes.func.isRequired,
    fallbackOrgUnits: PropTypes.object,
};

const mapStateToProps = state => ({
    selectedOrgUnits: state.filter.organisationUnits,
    fallbackOrgUnits: state.currentUser[DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS],
});

export default connect(mapStateToProps, {
    updateFilter,
    hideDialog,
    getList,
    appendCurrentUserOrgUnits,
})(OrganisationUnitFilter);

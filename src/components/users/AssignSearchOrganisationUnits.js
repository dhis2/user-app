import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchableOrgUnitTree from '../SearchableOrgUnitTree';

class AssignSearchOrganisationUnits extends Component {
    assignSearchOrganisationUnits(selectedOrgUnits) {
        console.log(selectedOrgUnits);
    }

    render() {
        const { selectedOrgUnits, hideDialog } = this.props;
        return (
            <SearchableOrgUnitTree
                selectedOrgUnits={selectedOrgUnits}
                displayClearFilterButton={false}
                applySelection={this.assignSearchOrganisationUnits.bind(this)}
                cancel={hideDialog}
            />
        );
    }
}

AssignSearchOrganisationUnits.propTypes = {
    selectedOrgUnits: PropTypes.array.isRequired,
    updateFilter: PropTypes.func.isRequired,
    hideDialog: PropTypes.func.isRequired,
    getList: PropTypes.func.isRequired,
};

export default AssignSearchOrganisationUnits;

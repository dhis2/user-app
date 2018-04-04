import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from '../../constants/lodash';
import { USER } from '../../constants/entityTypes';
import { connect } from 'react-redux';
import { updateFilter, hideDialog, getList } from '../../actions';
import SearchableOrgUnitTree from '../SearchableOrgUnitTree';

class OrganisationUnitFilter extends Component {
    applyFilter = newSelectedOrgUnits => {
        const { updateFilter, hideDialog, getList, selectedOrgUnits } = this.props;

        if (_.isEqual(newSelectedOrgUnits, selectedOrgUnits)) {
            return;
        }

        updateFilter('organisationUnits', newSelectedOrgUnits);
        hideDialog();
        getList(USER);
    };

    render() {
        const { selectedOrgUnits, hideDialog } = this.props;
        return (
            <SearchableOrgUnitTree
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
};

const mapStateToProps = state => ({
    selectedOrgUnits: state.filter.organisationUnits,
});

export default connect(mapStateToProps, {
    updateFilter,
    hideDialog,
    getList,
})(OrganisationUnitFilter);

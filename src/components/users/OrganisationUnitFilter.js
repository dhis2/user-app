import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { USER } from '../../constants/entityTypes';
import { connect } from 'react-redux';
import { updateFilter, hideDialog, getList } from '../../actions';
import SearchableOrgUnitTree from '../SearchableOrgUnitTree';

class OrganisationUnitFilter extends Component {
    applyFilter(selectedOrgUnits) {
        const { updateFilter, hideDialog, getList } = this.props;
        updateFilter('organisationUnits', selectedOrgUnits);
        hideDialog();
        getList(USER);
    }

    render() {
        const { selectedOrgUnits, hideDialog } = this.props;
        return (
            <SearchableOrgUnitTree
                selectedOrgUnits={selectedOrgUnits}
                displayClearFilterButton={true}
                applySelection={this.applyFilter.bind(this)}
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

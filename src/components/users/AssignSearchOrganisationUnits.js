import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../api';
import _ from '../../constants/lodash';
import { hideDialog, showSnackbar, getList } from '../../actions';
import { USER } from '../../constants/entityTypes';
import i18next from 'i18next';
import SearchableOrgUnitTree from '../SearchableOrgUnitTree';

class AssignSearchOrganisationUnits extends Component {
    assignSearchOrganisationUnits(selectedOrgUnits) {
        const { user, hideDialog } = this.props;
        const previousOrgUnits = user.teiSearchOrganisationUnits.toArray();
        const postData = {
            deletions: _.differenceBy(previousOrgUnits, selectedOrgUnits, 'id').map(
                unit => ({ id: unit.id })
            ),
            additions: _.differenceBy(selectedOrgUnits, previousOrgUnits, 'id').map(
                unit => ({ id: unit.id })
            ),
        };

        api
            .updateUserTeiSearchOrganisations(user.id, postData)
            .then(response => this.showSnackbarAndRefreshList(false))
            .catch(error => this.showSnackbarAndRefreshList(true));

        hideDialog();
    }

    showSnackbarAndRefreshList(hasError) {
        const { showSnackbar, getList } = this.props;
        const successMessage = i18next.t('Search Organisation Units updated');
        const errorMessage = i18next.t('Something went wrong when, please try again');
        const message = hasError ? errorMessage : successMessage;

        showSnackbar({ message: message });
        getList(USER);
    }

    render() {
        const { hideDialog, user } = this.props;
        const selectedOrgUnits = user.teiSearchOrganisationUnits.toArray();
        return (
            <SearchableOrgUnitTree
                selectedOrgUnits={selectedOrgUnits}
                displayClearFilterButton={false}
                confirmSelection={this.assignSearchOrganisationUnits.bind(this)}
                cancel={hideDialog}
            />
        );
    }
}

AssignSearchOrganisationUnits.propTypes = {
    user: PropTypes.object.isRequired,
    hideDialog: PropTypes.func.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    getList: PropTypes.func.isRequired,
};

export default connect(null, {
    hideDialog,
    showSnackbar,
    getList,
})(AssignSearchOrganisationUnits);

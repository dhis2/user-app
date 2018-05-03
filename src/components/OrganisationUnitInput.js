import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';
import PropTypes from 'prop-types';
import i18n from 'd2-i18n';
import { showDialog, hideDialog } from '../actions';
import OrganisationUnitFilter from './OrganisationUnitFilter';
import { orgUnitsAsStringSelector } from '../selectors';

const styles = {
    wrap: {
        position: 'relative',
        lineHeight: '24px',
        height: '72px',
        cursor: 'pointer',
        float: 'left',
        marginRight: '1rem',
    },
    icon: {
        position: 'absolute',
        right: 0,
        top: 38,
        width: 20,
        height: 20,
        color: 'rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
    },
    textField: {
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '152px',
    },
    input: {
        width: 'calc(100% - 20px)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
};

/**
 * Part of the UserFilter. This component renders the displayNames of the organisation units that have been set in the filter state.
 * If 3 or more units are selected in the filter, only the length of this array will be displayed.
 */
class OrganisationUnitInput extends Component {
    focusOrgUnitInput = () => {
        this.refs.orgUnitInput.focus();
    };

    showOrgTreeInDialog = () => {
        const { showDialog, hideDialog } = this.props;
        const content = <OrganisationUnitFilter />;
        const props = {
            onRequestClose: hideDialog,
            title: i18n.t('Select an organisation unit'),
            contentStyle: {
                // This doesn't actually influence the height of the dialogue
                // but it will force it upwards, enabling it to have more height
                // The actual height is determined by a scrollbox inside the filter component
                minHeight: '100vh',
            },
        };
        showDialog(content, props);
    };

    render() {
        const { organisationUnits } = this.props;
        return (
            <div style={styles.wrap} onClick={this.focusOrgUnitInput}>
                <ActionOpenInNew style={styles.icon} />
                <TextField
                    ref="orgUnitInput"
                    style={styles.textField}
                    floatingLabelText={i18n.t('Organisation unit')}
                    onFocus={this.showOrgTreeInDialog}
                    value={organisationUnits}
                    inputStyle={styles.input}
                />
            </div>
        );
    }
}

OrganisationUnitInput.propTypes = {
    organisationUnits: PropTypes.string.isRequired,
    showDialog: PropTypes.func.isRequired,
    hideDialog: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    organisationUnits: orgUnitsAsStringSelector(state.filter.organisationUnits),
});

export default connect(mapStateToProps, {
    showDialog,
    hideDialog,
})(OrganisationUnitInput);

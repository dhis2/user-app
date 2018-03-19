import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { showDialog, hideDialog } from '../../actions';
import OrganisationUnitFilter from './OrganisationUnitFilter';
import { orgUnitsAsStringSelector } from '../../selectors';

const styles = {
    wrap: {
        position: 'relative',
        display: 'inline-block',
        lineHeight: '24px',
        height: '72px',
        cursor: 'pointer',
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
    },
    input: {
        width: 'calc(100% - 20px)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
};

class OrganisationUnitInput extends Component {
    static propTypes = {
        organisationUnits: PropTypes.string.isRequired,
        showDialog: PropTypes.func.isRequired,
        hideDialog: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.focusOrgUnitInput = this.focusOrgUnitInput.bind(this);
        this.showOrgTreeInDialog = this.showOrgTreeInDialog.bind(this);
    }

    focusOrgUnitInput() {
        this.refs.orgUnitInput.focus();
    }

    showOrgTreeInDialog() {
        const { showDialog, hideDialog } = this.props;
        const content = <OrganisationUnitFilter />;
        const props = {
            onRequestClose: hideDialog,
            title: i18next.t('Select an organisation unit'),
            contentStyle: {
                // This doesn't actually influence the height of the dialogue
                // but it will force it upwards, enabling it to have more height
                // The actual height is determined by a scrollbox inside the filter component
                minHeight: '100vh',
            },
        };
        showDialog(content, props);
    }

    render() {
        const { organisationUnits } = this.props;
        return (
            <div style={styles.wrap} onClick={this.focusOrgUnitInput}>
                <ActionOpenInNew style={styles.icon} />
                <TextField
                    ref="orgUnitInput"
                    style={styles.textField}
                    floatingLabelText={i18next.t('Organisation unit')}
                    onFocus={this.showOrgTreeInDialog}
                    value={organisationUnits}
                    inputStyle={styles.input}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    organisationUnits: orgUnitsAsStringSelector(state.filter.organisationUnits),
});

export default connect(mapStateToProps, {
    showDialog,
    hideDialog,
})(OrganisationUnitInput);

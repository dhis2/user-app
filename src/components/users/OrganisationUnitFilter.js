import React, { Component } from 'react';
import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import RaisedButton from 'material-ui/RaisedButton';
import i18next from 'i18next';
import _ from '../../constants/lodash';
import PropTypes from 'prop-types';
import { USER } from '../../constants/entityTypes';
import { connect } from 'react-redux';
import { updateFilter, hideDialog, getList } from '../../actions';
import api from '../../api';

const styles = {
    wrapper: {
        minHeight: '20vh',
        maxHeight: '60vh',
    },
    scrollBox: {
        maxHeight: 'calc(60vh - 68px)',
        minHeight: 'calc(20vh - 68px)',
        overflowY: 'auto',
        border: '1px solid #e0e0e0',
        paddingTop: '8px',
        paddingBottom: '8px',
        borderRadius: '2px',
    },
    buttonStrip: {
        paddingTop: '16px',
        height: '36px',
    },
    buttonMargin: {
        marginRight: '8px',
    },
};

class OrganisationUnitFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            root: null,
            tempSelectedOrgUnits: [...props.selectedOrgUnits],
        };
    }

    componentWillMount() {
        api.getOrgUnits().then(root => {
            this.setState({
                root: root,
            });
        });
    }

    getIndexOfOrgUnit(orgUnit) {
        const { tempSelectedOrgUnits } = this.state;
        const selectedUnit = tempSelectedOrgUnits.find(
            unit => unit.path === orgUnit.path
        );
        return tempSelectedOrgUnits.indexOf(selectedUnit);
    }

    onOrgUnitClick(_, orgUnit) {
        const { tempSelectedOrgUnits } = this.state;
        const orgUnitIndex = this.getIndexOfOrgUnit(orgUnit);
        const newOrgUnits =
            orgUnitIndex === -1
                ? [...tempSelectedOrgUnits, orgUnit]
                : [
                      ...tempSelectedOrgUnits.slice(0, orgUnitIndex),
                      ...tempSelectedOrgUnits.slice(orgUnitIndex + 1),
                  ];

        this.setState({ tempSelectedOrgUnits: newOrgUnits });
    }

    applyFilter() {
        const { tempSelectedOrgUnits } = this.state;
        const { updateFilter, hideDialog, getList } = this.props;
        updateFilter('organisationUnits', tempSelectedOrgUnits);
        hideDialog();
        getList(USER);
    }

    clearFilter() {
        this.setState({ tempSelectedOrgUnits: [] });
        _.defer(this.applyFilter.bind(this));
    }

    render() {
        const { root, tempSelectedOrgUnits } = this.state;
        const { hideDialog } = this.props;
        const selected = tempSelectedOrgUnits.map(unit => unit.path);

        if (!root) {
            return <LoadingMask />;
        }

        return (
            <div style={styles.wrapper}>
                <div style={styles.scrollBox}>
                    <OrgUnitTree
                        root={root}
                        onSelectClick={this.onOrgUnitClick.bind(this)}
                        selected={selected}
                        initiallyExpanded={selected}
                    />
                </div>
                <div style={styles.buttonStrip}>
                    <RaisedButton
                        label={i18next.t('Apply')}
                        primary={true}
                        style={styles.buttonMargin}
                        onClick={this.applyFilter.bind(this)}
                    />
                    <RaisedButton
                        label={i18next.t('Clear all')}
                        secondary={true}
                        style={styles.buttonMargin}
                        onClick={this.clearFilter.bind(this)}
                    />
                    <RaisedButton onClick={hideDialog} label={i18next.t('Cancel')} />
                </div>
            </div>
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

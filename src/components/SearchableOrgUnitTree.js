import React, { Component } from 'react';
import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';
import CircularProgress from 'material-ui/CircularProgress';
import AsyncAutoComplete from './AsyncAutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import i18next from 'i18next';
import _ from '../constants/lodash';
import PropTypes from 'prop-types';
import api from '../api';

const styles = {
    wrapper: {
        minHeight: '20vh',
        maxHeight: '60vh',
        position: 'relative',
    },
    scrollBox: {
        marginTop: '-12px',
        maxHeight: 'calc(60vh - 154px)',
        minHeight: 'calc(20vh - 154px)',
        overflowY: 'auto',
        border: '1px solid #e0e0e0',
        paddingTop: '8px',
        paddingBottom: '8px',
        borderRadius: '2px',
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    buttonStrip: {
        paddingTop: '16px',
        height: '36px',
    },
    buttonMargin: {
        marginRight: '8px',
    },
};

class SearchableOrgUnitTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            root: null,
            selectedOrgUnits: [...props.selectedOrgUnits],
            orgUnitFilter: null,
            initiallyExpanded: this.getInitiallyExpandedItems(props.selectedOrgUnits),
        };
    }

    componentWillMount() {
        api.getOrgUnits().then(root => {
            this.setState({
                root: root,
            });
        });
    }

    getInitiallyExpandedItems(orgUnits) {
        return orgUnits.reduce((expandedUnits, orgUnit) => {
            const strippedPath = this.removeLastPathSegment(orgUnit);
            if (strippedPath) {
                expandedUnits.push(strippedPath);
            }
            return expandedUnits;
        }, []);
    }

    getIndexOfOrgUnit(orgUnit) {
        const { selectedOrgUnits } = this.state;
        const selectedUnit = selectedOrgUnits.find(unit => unit.path === orgUnit.path);
        return selectedOrgUnits.indexOf(selectedUnit);
    }

    removeLastPathSegment({ path }) {
        return path.substr(0, path.lastIndexOf('/'));
    }

    toggleSelectedOrgUnits(_, orgUnit) {
        const { selectedOrgUnits } = this.state;
        const orgUnitIndex = this.getIndexOfOrgUnit(orgUnit);
        const newOrgUnits =
            orgUnitIndex === -1
                ? [...selectedOrgUnits, orgUnit]
                : [
                      ...selectedOrgUnits.slice(0, orgUnitIndex),
                      ...selectedOrgUnits.slice(orgUnitIndex + 1),
                  ];

        this.setState({
            selectedOrgUnits: newOrgUnits,
            initiallyExpanded: [],
        });
    }

    selectAndShowFilteredOrgUnitInTreeView(dataSourceItem) {
        const orgUnit = dataSourceItem.value;
        const { selectedOrgUnits } = this.state;
        const initiallyExpanded = [this.removeLastPathSegment(orgUnit)];
        this.setState({
            selectedOrgUnits: [...selectedOrgUnits, orgUnit],
            initiallyExpanded: initiallyExpanded,
        });
    }

    applySelection() {
        const { selectedOrgUnits } = this.state;
        const { applySelection } = this.props;
        applySelection(selectedOrgUnits);
    }

    clearSelection() {
        this.setState({ selectedOrgUnits: [] });
        _.defer(this.applySelection.bind(this));
    }

    render() {
        const { root, selectedOrgUnits, initiallyExpanded, orgUnitFilter } = this.state;
        const { displayClearFilterButton, cancel } = this.props;
        const selected = selectedOrgUnits.map(unit => unit.path);

        const autoCompleteProps = {
            floatingLabelText: i18next.t('Search'),
            hintText: i18next.t('Enter search term'),
            fullWidth: true,
        };

        return (
            <div style={styles.wrapper}>
                <AsyncAutoComplete
                    autoCompleteProps={autoCompleteProps}
                    query={api.queryOrgUnits}
                    minCharLength={3}
                    queryDebounceTime={375}
                    selectHandler={this.selectAndShowFilteredOrgUnitInTreeView.bind(this)}
                />
                <div style={styles.scrollBox}>
                    {!root ? (
                        <CircularProgress style={styles.loader} />
                    ) : (
                        <OrgUnitTree
                            root={root}
                            onSelectClick={this.toggleSelectedOrgUnits.bind(this)}
                            selected={selected}
                            initiallyExpanded={initiallyExpanded}
                            orgUnitsPathsToInclude={orgUnitFilter}
                        />
                    )}
                </div>

                <div style={styles.buttonStrip}>
                    <RaisedButton
                        label={i18next.t('Apply')}
                        primary={true}
                        style={styles.buttonMargin}
                        onClick={this.applySelection.bind(this)}
                        disabled={!root}
                    />
                    {displayClearFilterButton ? (
                        <RaisedButton
                            label={i18next.t('Clear all')}
                            secondary={true}
                            style={styles.buttonMargin}
                            onClick={this.clearSelection.bind(this)}
                            disabled={!root}
                        />
                    ) : null}
                    <RaisedButton onClick={cancel} label={i18next.t('Cancel')} />
                </div>
            </div>
        );
    }
}

SearchableOrgUnitTree.propTypes = {
    selectedOrgUnits: PropTypes.array.isRequired,
    displayClearFilterButton: PropTypes.bool,
    applySelection: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
};

export default SearchableOrgUnitTree;

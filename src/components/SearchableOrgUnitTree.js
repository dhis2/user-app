import React, { Component } from 'react';
import { connect } from 'react-redux';
import OrgUnitTreeMultipleRoots from 'd2-ui/lib/org-unit-tree/OrgUnitTreeMultipleRoots.component';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import AsyncAutoComplete from './AsyncAutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import Heading from 'd2-ui/lib/headings/Heading.component';
import i18n from 'd2-i18n';
import _ from '../constants/lodash';
import PropTypes from 'prop-types';
import api from '../api';
import { orgUnitRootsSelector } from '../selectors';

const styles = {
    wrapper: {
        minHeight: '300px',
        maxHeight: '60vh',
        position: 'relative',
    },
    scrollBox: {
        position: 'relative',
        marginTop: '-12px',
        maxHeight: 'calc(60vh - 154px)',
        minHeight: 'calc(300px - 154px)',
        overflowY: 'auto',
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
    header: {
        paddingBottom: 0,
        fontSize: '1.2rem',
        marginBottom: '-16px',
    },
};

// This component will show buttons if you pass it a confirmSelection (func) property
// If you pass an onChange (func) property it will use that as a callback
class SearchableOrgUnitTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roots: null,
            selectedOrgUnits: [...props.selectedOrgUnits],
            orgUnitFilter: null,
            initiallyExpanded: this.getInitiallyExpandedItems(props.selectedOrgUnits),
        };
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

    update(selectedOrgUnits, initiallyExpanded) {
        const { onChange } = this.props;
        const updateObject = initiallyExpanded
            ? { selectedOrgUnits, initiallyExpanded }
            : { selectedOrgUnits };

        if (onChange) {
            onChange(selectedOrgUnits.map(unit => unit.id));
        }

        this.setState(updateObject);
    }

    toggleSelectedOrgUnits = (_, orgUnit) => {
        const { selectedOrgUnits } = this.state;
        const orgUnitIndex = this.getIndexOfOrgUnit(orgUnit);
        const newOrgUnits =
            orgUnitIndex === -1
                ? [...selectedOrgUnits, orgUnit]
                : [
                      ...selectedOrgUnits.slice(0, orgUnitIndex),
                      ...selectedOrgUnits.slice(orgUnitIndex + 1),
                  ];

        this.update(newOrgUnits, []);
    };

    selectAndShowFilteredOrgUnit = dataSourceItem => {
        const orgUnit = dataSourceItem.value;
        const { selectedOrgUnits } = this.state;
        const initiallyExpanded = [this.removeLastPathSegment(orgUnit)];
        const newOrgUnits = [...selectedOrgUnits, orgUnit];

        this.update(newOrgUnits, initiallyExpanded);
    };

    clearSelection = () => {
        this.update([]);
        _.defer(this.applySelection);
    };

    applySelection = () => {
        const { selectedOrgUnits } = this.state;
        const { confirmSelection } = this.props;
        confirmSelection(selectedOrgUnits);
    };

    render() {
        const { selectedOrgUnits, initiallyExpanded, orgUnitFilter } = this.state;
        const {
            roots,
            confirmSelection,
            displayClearFilterButton,
            cancel,
            orgUnitType,
            headerText,
            wrapperStyle,
        } = this.props;
        const selected = selectedOrgUnits.map(unit => unit.path);
        const autoCompleteProps = {
            floatingLabelText: i18n.t('Search'),
            hintText: i18n.t('Enter search term'),
            fullWidth: true,
        };

        return (
            <div style={{ ...styles.wrapper, ...wrapperStyle }}>
                {headerText ? (
                    <Heading level={4} style={styles.header}>
                        {headerText}
                    </Heading>
                ) : null}
                <AsyncAutoComplete
                    autoCompleteProps={autoCompleteProps}
                    query={api.queryOrgUnits}
                    queryParam={orgUnitType}
                    minCharLength={2}
                    queryDebounceTime={375}
                    selectHandler={this.selectAndShowFilteredOrgUnit}
                />
                <Paper style={styles.scrollBox}>
                    {!roots ? (
                        <CircularProgress style={styles.loader} />
                    ) : (
                        <OrgUnitTreeMultipleRoots
                            roots={roots}
                            onSelectClick={this.toggleSelectedOrgUnits}
                            selected={selected}
                            initiallyExpanded={initiallyExpanded}
                            orgUnitsPathsToInclude={orgUnitFilter}
                        />
                    )}
                </Paper>
                {confirmSelection ? (
                    <div style={styles.buttonStrip}>
                        <RaisedButton
                            label={i18n.t('Apply')}
                            primary={true}
                            style={styles.buttonMargin}
                            onClick={this.applySelection}
                            disabled={!root}
                        />
                        {displayClearFilterButton ? (
                            <RaisedButton
                                label={i18n.t('Clear all')}
                                secondary={true}
                                style={styles.buttonMargin}
                                onClick={this.clearSelection}
                                disabled={!root}
                            />
                        ) : null}
                        <RaisedButton onClick={cancel} label={i18n.t('Cancel')} />
                    </div>
                ) : null}
            </div>
        );
    }
}

SearchableOrgUnitTree.propTypes = {
    roots: PropTypes.array,
    selectedOrgUnits: PropTypes.array.isRequired,
    orgUnitType: PropTypes.string.isRequired,
    headerText: PropTypes.string,
    wrapperStyle: PropTypes.object,
    displayClearFilterButton: PropTypes.bool,
    confirmSelection: PropTypes.func,
    onChange: PropTypes.func,
    cancel: PropTypes.func,
};

// export default SearchableOrgUnitTree;
const mapStateToProps = (state, props) => {
    return {
        roots: orgUnitRootsSelector(props.orgUnitType, state.currentUser),
    };
};

export default connect(mapStateToProps)(SearchableOrgUnitTree);

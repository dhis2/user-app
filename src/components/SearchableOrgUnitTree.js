import React, { Component } from 'react';
import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';
import CircularProgress from 'material-ui/CircularProgress';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { orange500, cyan500 } from 'material-ui/styles/colors';
import i18next from 'i18next';
import _ from '../constants/lodash';
import PropTypes from 'prop-types';
import api from '../api';

const MIN_QUERY_STRING_LENGTH = 3;

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
    error: {
        info: {
            color: cyan500,
        },
        warning: {
            color: orange500,
        },
    },
};

const loaderDataSource = [
    {
        text: 'loading...',
        value: (
            <MenuItem style={{ textAlign: 'center' }}>
                <CircularProgress style={{ marginTop: '12px' }} />
            </MenuItem>
        ),
    },
];

class SearchableOrgUnitTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            root: null,
            filteredOrgUnits: [],
            selectedOrgUnits: [...props.selectedOrgUnits],
            orgUnitFilter: null,
            initiallyExpanded: this.getInitiallyExpandedItems(props.selectedOrgUnits),
            searchWarning: null,
            errorStyle: styles.error.info,
            autoCompleteText: '',
        };
        this.getMatchingOrgUnits = _.debounce(this.getMatchingOrgUnits.bind(this), 375);
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

    onAutoCompleteChange(value) {
        this.setState({ autoCompleteText: value });
        this.getMatchingOrgUnits(value);
    }

    getMatchingOrgUnits(value) {
        const baseState = {
            searchWarning: null,
            filteredOrgUnits: [],
            errorStyle: styles.error.info,
            initiallyExpanded: [],
        };

        if (!value || value.length < MIN_QUERY_STRING_LENGTH) {
            // Don't query if too few characters were entered
            const searchWarning = value
                ? i18next.t('Please enter at least {{ minCharCount }} characters', {
                      minCharCount: MIN_QUERY_STRING_LENGTH,
                  })
                : null;
            this.setState({ ...baseState, searchWarning });
        } else {
            // Set loading state
            this.setState({ ...baseState, filteredOrgUnits: loaderDataSource });

            // Then query
            api.queryOrgUnits(value).then(orgUnits => {
                if (orgUnits.size > 0) {
                    // Display results if any were returned
                    const filteredOrgUnits = orgUnits.toArray().map(unit => ({
                        text: unit.displayName,
                        value: unit,
                    }));
                    this.setState({
                        ...baseState,
                        filteredOrgUnits: filteredOrgUnits,
                    });
                } else {
                    // Otherwise show warning
                    this.setState({
                        ...baseState,
                        errorStyle: styles.error.warning,
                        searchWarning: i18next.t('No matches found'),
                    });
                }
            });
        }
    }

    selectAndShowFilteredOrgUnitInTreeView(dataSourceItem) {
        const orgUnit = dataSourceItem.value;
        const { selectedOrgUnits } = this.state;
        const initiallyExpanded = [this.removeLastPathSegment(orgUnit)];
        this.setState({
            autoCompleteText: '',
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
        const {
            root,
            filteredOrgUnits,
            selectedOrgUnits,
            initiallyExpanded,
            searchWarning,
            errorStyle,
            orgUnitFilter,
            autoCompleteText,
        } = this.state;
        const { displayClearFilterButton, cancel } = this.props;
        const selected = selectedOrgUnits.map(unit => unit.path);
        const marginBottom = searchWarning ? 0 : 28;

        return (
            <div style={styles.wrapper}>
                <AutoComplete
                    floatingLabelText={i18next.t('Search')}
                    hintText={i18next.t('Enter search term')}
                    searchText={autoCompleteText}
                    type="search"
                    filter={() => true}
                    onUpdateInput={this.onAutoCompleteChange.bind(this)}
                    dataSource={filteredOrgUnits}
                    errorText={searchWarning}
                    errorStyle={errorStyle}
                    floatingLabelShrinkStyle={errorStyle}
                    fullWidth={true}
                    style={{ marginBottom: marginBottom }}
                    onNewRequest={this.selectAndShowFilteredOrgUnitInTreeView.bind(this)}
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

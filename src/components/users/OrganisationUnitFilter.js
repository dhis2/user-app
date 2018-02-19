import React, { Component } from 'react';
import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { orange500, cyan500 } from 'material-ui/styles/colors';
import i18next from 'i18next';
import _ from '../../constants/lodash';
import PropTypes from 'prop-types';
import { USER } from '../../constants/entityTypes';
import { connect } from 'react-redux';
import { updateFilter, hideDialog, getList } from '../../actions';
import api from '../../api';

const MIN_QUERY_STRING_LENGTH = 3;
const MAX_QUERY_RESULT_SIZE = 50;

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
// TODO: Discuss an alternative UI
// This works but the search input combined with the OrgUnitTree is VERY heavy on the network traffic.
// Perhaps a simple auto suggest input would be just as clear and much more efficient..
class OrganisationUnitFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            root: null,
            tempSelectedOrgUnits: [...props.selectedOrgUnits],
            orgUnitFilter: null,
            initiallyExpanded: props.selectedOrgUnits.map(unit => unit.path),
            searchWarning: null,
            searchLoading: false,
            errorStyle: styles.error.info,
            lastQuery: '',
        };
        this.debouncedQueryOrgUnits = _.debounce(this.queryOrgUnits.bind(this), 375);
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

    toggleSelectedOrgUnits(_, orgUnit) {
        const { tempSelectedOrgUnits } = this.state;
        const orgUnitIndex = this.getIndexOfOrgUnit(orgUnit);
        const newOrgUnits =
            orgUnitIndex === -1
                ? [...tempSelectedOrgUnits, orgUnit]
                : [
                      ...tempSelectedOrgUnits.slice(0, orgUnitIndex),
                      ...tempSelectedOrgUnits.slice(orgUnitIndex + 1),
                  ];

        this.setState({
            tempSelectedOrgUnits: newOrgUnits,
            initiallyExpanded: [],
        });
    }

    onOrgUnitQueryChange(event) {
        this.debouncedQueryOrgUnits(event.target.value);
    }

    queryOrgUnits(value) {
        const lastQuery = this.state.lastQuery;
        const baseState = {
            searchWarning: null,
            initiallyExpanded: [],
            orgUnitFilter: null,
            searchLoading: false,
            errorStyle: styles.error.info,
            lastQuery: value,
        };
        // Prevent GET requests if search string is too short
        if (!value || value.length < MIN_QUERY_STRING_LENGTH) {
            const searchWarning = value
                ? i18next.t('Please enter at least {{ minCharCount }} characters', {
                      minCharCount: MIN_QUERY_STRING_LENGTH,
                  })
                : null;
            this.setState({ ...baseState, searchWarning });

            // Show a loader and force back to initial state
            if (
                value.length < lastQuery.length &&
                lastQuery.length === MIN_QUERY_STRING_LENGTH
            ) {
                this.setState({ searchLoading: true });
                setTimeout(() => {
                    this.setState({ searchLoading: false });
                }, 150);
            }
        } else {
            // Start loading because GET request is being initiated
            this.setState({ ...baseState, searchLoading: true });

            api.queryOrgUnits(value).then(orgUnits => {
                // Show filtered and expanded tree if possible
                if (orgUnits.size > 0 && orgUnits.size < MAX_QUERY_RESULT_SIZE) {
                    const paths = orgUnits.toArray().map(unit => unit.path);
                    this.setState({
                        ...baseState,
                        initiallyExpanded: paths,
                        orgUnitFilter: paths,
                    });
                } else {
                    // Don't show filtered tree and explain why
                    const message =
                        orgUnits.size === 0
                            ? i18next.t('No matches found')
                            : i18next.t(
                                  'Your query returned {{resultCount}} matches. This is too many to display in the tree-view',
                                  { resultCount: orgUnits.size }
                              );
                    this.setState({
                        ...baseState,
                        errorStyle: styles.error.warning,
                        searchWarning: message,
                    });
                }
            });
        }
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
        const {
            root,
            tempSelectedOrgUnits,
            initiallyExpanded,
            searchLoading,
            searchWarning,
            errorStyle,
            orgUnitFilter,
        } = this.state;
        const { hideDialog } = this.props;
        const selected = tempSelectedOrgUnits.map(unit => unit.path);
        const marginBottom = searchWarning ? 0 : 28;
        const expand =
            root && (!initiallyExpanded || initiallyExpanded.length === 0)
                ? [root.path]
                : initiallyExpanded;

        return (
            <div style={styles.wrapper}>
                <TextField
                    floatingLabelText={i18next.t('Search')}
                    hintText={i18next.t('Enter search term')}
                    type="search"
                    onInput={this.onOrgUnitQueryChange.bind(this)}
                    errorText={searchWarning}
                    errorStyle={errorStyle}
                    floatingLabelShrinkStyle={errorStyle}
                    fullWidth={true}
                    style={{ marginBottom: marginBottom }}
                />
                <div style={styles.scrollBox}>
                    {!root || searchLoading ? (
                        <CircularProgress style={styles.loader} />
                    ) : (
                        <OrgUnitTree
                            root={root}
                            onSelectClick={this.toggleSelectedOrgUnits.bind(this)}
                            selected={selected}
                            initiallyExpanded={expand}
                            orgUnitsPathsToInclude={orgUnitFilter}
                        />
                    )}
                </div>

                <div style={styles.buttonStrip}>
                    <RaisedButton
                        label={i18next.t('Apply')}
                        primary={true}
                        style={styles.buttonMargin}
                        onClick={this.applyFilter.bind(this)}
                        disabled={!root || searchLoading}
                    />
                    <RaisedButton
                        label={i18next.t('Clear all')}
                        secondary={true}
                        style={styles.buttonMargin}
                        onClick={this.clearFilter.bind(this)}
                        disabled={!root || searchLoading}
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

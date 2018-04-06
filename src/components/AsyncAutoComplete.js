import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import { orange500, blue500 } from 'material-ui/styles/colors';
import i18next from 'i18next';
import makeTrashable from 'trashable';
import _ from '../constants/lodash';
import PropTypes from 'prop-types';

const styles = {
    error: {
        info: {
            color: blue500,
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

const baseState = {
    filteredItems: [],
    searchWarning: null,
    errorStyle: styles.error.info,
};

const defaultAutoCompleteProps = {
    floatingLabelText: i18next.t('Search'),
    hintText: i18next.t('Enter search term'),
    fullWidth: true,
    type: 'search',
    filter: () => true,
};

class AsyncAutoComplete extends Component {
    constructor(props) {
        super(props);
        const debounceTime = props.queryDebounceTime || 375;
        this.state = { ...baseState };
        this.getItems = _.debounce(this.getItems, debounceTime);
        this.trashableQuery = null;
    }

    componentWillUnmount() {
        this.trashableQuery && this.trashableQuery.trash();
    }

    onAutoCompleteChange = value => {
        this.setState({ autoCompleteText: value });
        this.getItems(value);
    };

    getItems = value => {
        const { minCharLength, query } = this.props;

        if (!value || value.length < minCharLength) {
            // Don't query if too few characters were entered
            const searchWarning = value
                ? i18next.t('Please enter at least {{ minCharCount }} characters', {
                      minCharCount: minCharLength,
                  })
                : null;
            this.setState({ ...baseState, searchWarning });
        } else {
            // Set loading state
            this.setState({ ...baseState, filteredItems: loaderDataSource });

            // Then query
            this.trashableQuery = makeTrashable(query(value));
            this.trashableQuery.then(modelCollection => {
                if (modelCollection.size > 0) {
                    // Display results if any were returned
                    const filteredItems = modelCollection.toArray().map(model => ({
                        text: model.displayName,
                        value: model,
                    }));
                    this.setState({
                        ...baseState,
                        filteredItems: filteredItems,
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
    };

    onItemSelect = dataSourceItem => {
        const { selectHandler } = this.props;
        this.setState({ autoCompleteText: '' });
        selectHandler(dataSourceItem);
    };

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

    render() {
        const { autoCompleteProps } = this.props;
        const mergedAutoCompleteProps = {
            ...defaultAutoCompleteProps,
            ...autoCompleteProps,
        };
        const { filteredItems, searchWarning, errorStyle, autoCompleteText } = this.state;
        const marginBottom = searchWarning ? 0 : 28;
        const mergedProps = {
            ...mergedAutoCompleteProps,
            onUpdateInput: this.onAutoCompleteChange,
            onNewRequest: this.onItemSelect,
            searchText: autoCompleteText,
            dataSource: filteredItems,
            errorText: searchWarning,
            errorStyle: errorStyle,
            floatingLabelShrinkStyle: errorStyle,
            style: { marginBottom: marginBottom },
            menuStyle: { maxHeight: '600px' },
        };

        return <AutoComplete {...mergedProps} />;
    }
}

AsyncAutoComplete.propTypes = {
    queryDebounceTime: PropTypes.number,
    minCharLength: PropTypes.number,
    query: PropTypes.func.isRequired,
    selectHandler: PropTypes.func.isRequired,
    autoCompleteProps: PropTypes.object,
};

AsyncAutoComplete.defaultProps = {
    queryDebounceTime: 375,
    minCharLength: 3,
};

export default AsyncAutoComplete;

import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import { orange500, blue500, red500 } from 'material-ui/styles/colors';
import i18n from '@dhis2/d2-i18n';
import makeTrashable from 'trashable';
import createHumanErrorMessage from '../utils/createHumanErrorMessage';
import _ from '../constants/lodash';
import PropTypes from 'prop-types';
import asArray from '../utils/asArray';

const styles = {
    error: {
        info: {
            color: blue500,
        },
        warning: {
            color: orange500,
        },
        error: {
            color: red500,
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
    floatingLabelText: i18n.t('Search'),
    hintText: i18n.t('Enter search term'),
    fullWidth: true,
    type: 'search',
    filter: () => true,
};

/**
 * Generic component that renders a MUI AutoComplete. It can execute an async query and show a list of results.
 * Which query to execute and what happens when a list item is clicked should be defined in the parent component.
 */
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

    getItems = async value => {
        const { minCharLength, query, queryParam } = this.props;

        if (!value || value.length < minCharLength) {
            // Don't query if too few characters were entered
            const searchWarning = value
                ? i18n.t('Please enter at least {{ minCharCount }} characters', {
                      minCharCount: minCharLength,
                  })
                : null;
            this.setState({ ...baseState, searchWarning });
        } else {
            // Set loading state
            this.setState({ ...baseState, filteredItems: loaderDataSource });

            // Then query
            this.trashableQuery = makeTrashable(query(value, queryParam));
            try {
                let filteredResults = await this.trashableQuery;
                filteredResults = asArray(filteredResults);
                if (filteredResults.length > 0) {
                    // Display results if any were returned
                    const filteredItems = filteredResults.map(model => ({
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
                        searchWarning: i18n.t('No matches found'),
                    });
                }
            } catch (error) {
                // Show error on input
                this.setState({
                    ...baseState,
                    errorStyle: styles.error.warning,
                    searchWarning: createHumanErrorMessage(
                        error,
                        i18n.t('There was a problem retreiving your search results')
                    ),
                });
            }
        }
    };

    onItemSelect = dataSourceItem => {
        const { selectHandler } = this.props;
        this.setState({ autoCompleteText: '' });
        selectHandler(dataSourceItem);
    };

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
    queryParam: PropTypes.any,
    selectHandler: PropTypes.func.isRequired,
    autoCompleteProps: PropTypes.object,
};

AsyncAutoComplete.defaultProps = {
    queryDebounceTime: 375,
    minCharLength: 3,
};

export default AsyncAutoComplete;

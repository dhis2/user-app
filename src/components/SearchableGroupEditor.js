import React, { Component } from 'react';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';
import Store from 'd2-ui/lib/store/Store';
import PropTypes from 'prop-types';
import { red500 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField/TextField';
import Heading from 'd2-ui/lib/headings/Heading.component';
import asArray from '../utils/asArray';
import i18n from 'd2-i18n';

const styles = {
    outerWrap: {
        paddingTop: 0,
        paddingBottom: '2.5rem',
    },
    headerWrap: {
        display: 'flex',
    },
    headerSpacer: {
        flex: '0 0 120px',
    },
    header: {
        flex: '1 0 120px',
        paddingBottom: 0,
        fontSize: '1.2rem',
    },
    error: {
        color: red500,
    },
    errorText: {
        fontSize: '0.8rem',
        marginLeft: '0.8rem',
    },
};

/**
 * A component that renders the d2-ui GroupEditor with a search input above it.
 * It can fetch its own items and has been made compliant with redux form.
 * On update it can return an array of either IDs or d2-models
 */
class SearchableGroupEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemStore: Store.create(),
            assignedItemStore: Store.create(),
            filterText: '',
        };
    }

    async componentWillMount() {
        try {
            const availableItems = await this.props.availableItemsQuery();
            this.availableItemsReceivedHandler(availableItems);
        } catch (error) {
            console.error(error);
        }
    }

    availableItemsReceivedHandler = response => {
        // On update we want to be able to return an array of IDs or models
        const { initiallyAssignedItems, returnModelsOnUpdate } = this.props;
        const { itemStore, assignedItemStore } = this.state;

        if (returnModelsOnUpdate) {
            this.modelLookup = new Map();
        }

        const assignedItems = asArray(initiallyAssignedItems).map(({ id }) => id);
        const availableItems = asArray(response).map(item => {
            if (returnModelsOnUpdate) {
                this.modelLookup.set(item.id, item);
            }
            const text = item.displayName || item.name;
            return {
                value: item.id,
                text: text,
            };
        });

        itemStore.setState(availableItems);
        assignedItemStore.setState(assignedItems);
    };

    onAssignItems = items => {
        const { assignedItemStore } = this.state;
        const assigned = assignedItemStore.state.concat(items);

        return this.update(assigned);
    };

    onRemoveItems = items => {
        const { assignedItemStore } = this.state;
        const assigned = assignedItemStore.state.filter(
            item => items.indexOf(item) === -1
        );

        return this.update(assigned);
    };

    update(assignedItemIds) {
        const { onChange, returnModelsOnUpdate, onBlur } = this.props;
        const { assignedItemStore } = this.state;
        const assignedItems = returnModelsOnUpdate
            ? assignedItemIds.map(id => this.modelLookup.get(id))
            : assignedItemIds;

        assignedItemStore.setState(assignedItemIds);
        onChange(assignedItems);
        // Also call onBlur if this is available. In a redux-form the component will be 'touched' by it
        onBlur && onBlur();
        return Promise.resolve();
    }

    updateFilterText = event => {
        this.setState({ filterText: event.target.value });
    };

    renderHeader() {
        const { availableItemsHeader, assignedItemsHeader, errorText } = this.props;
        const assignedStyle = errorText
            ? { ...styles.header, ...styles.error }
            : styles.header;

        return (
            <div style={styles.headerWrap}>
                <Heading level={4} style={styles.header}>
                    {availableItemsHeader}
                </Heading>
                <div style={styles.headerSpacer} />
                <Heading level={4} style={assignedStyle}>
                    {assignedItemsHeader}
                    {errorText ? <span style={styles.errorText}>{errorText}</span> : null}
                </Heading>
            </div>
        );
    }

    renderSearchInput() {
        return (
            <TextField
                fullWidth={true}
                type="search"
                onChange={this.updateFilterText}
                value={this.state.filterText}
                floatingLabelText={i18n.t('Filter')}
                hintText={i18n.t('Filter available and selected items')}
                style={{ marginTop: '-16px' }}
            />
        );
    }

    render() {
        return (
            <div style={styles.outerWrap}>
                {this.renderHeader()}
                {this.renderSearchInput()}
                <GroupEditor
                    itemStore={this.state.itemStore}
                    assignedItemStore={this.state.assignedItemStore}
                    onAssignItems={this.onAssignItems}
                    onRemoveItems={this.onRemoveItems}
                    height={250}
                    filterText={this.state.filterText}
                />
            </div>
        );
    }
}

SearchableGroupEditor.propTypes = {
    availableItemsQuery: PropTypes.func.isRequired,
    initiallyAssignedItems: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.array.isRequired,
    ]),
    onChange: PropTypes.func.isRequired,
    availableItemsHeader: PropTypes.string.isRequired,
    assignedItemsHeader: PropTypes.string.isRequired,
    returnModelsOnUpdate: PropTypes.bool,
    errorText: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    onBlur: PropTypes.func,
};

export default SearchableGroupEditor;

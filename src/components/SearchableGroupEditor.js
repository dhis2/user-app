import React, { Component } from 'react';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';
import Store from 'd2-ui/lib//store/Store';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField/TextField';
import Heading from 'd2-ui/lib/headings/Heading.component';
import { asArray } from '../utils';
import i18next from 'i18next';

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
};

class SearchableGroupEditor extends Component {
    static propTypes = {
        availableItemsQuery: PropTypes.func.isRequired,
        initiallyAssignedItems: PropTypes.oneOfType([
            PropTypes.object.isRequired,
            PropTypes.array.isRequired,
        ]),
        onChange: PropTypes.func.isRequired,
        availableItemsHeader: PropTypes.string.isRequired,
        assignedItemsHeader: PropTypes.string.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            itemStore: Store.create(),
            assignedItemStore: Store.create(),
            filterText: '',
        };
    }

    componentWillMount() {
        const { availableItemsQuery } = this.props;
        console.log('groupeditor mounting', availableItemsQuery.name);
        availableItemsQuery()
            .then(this.onAvailableItemsReceived.bind(this))
            .catch(() => alert('Problem getting the available items'));
    }

    onAvailableItemsReceived(response) {
        const { initiallyAssignedItems } = this.props;
        const { itemStore, assignedItemStore } = this.state;
        const assignedItems = asArray(initiallyAssignedItems).map(({ id }) => id);
        const availableItems = asArray(response).map(item => {
            const text = item.displayName || item.name;
            return {
                value: item.id,
                text: text,
            };
        });

        itemStore.setState(availableItems);
        assignedItemStore.setState(assignedItems);
    }

    onAssignItems(items) {
        const { assignedItemStore } = this.state;
        const { onChange } = this.props;
        const assigned = assignedItemStore.state.concat(items);

        assignedItemStore.setState(assigned);
        onChange(assigned);
        return Promise.resolve();
    }

    onRemoveItems(items) {
        const { assignedItemStore } = this.state;
        const { onChange } = this.props;
        const assigned = assignedItemStore.state.filter(
            item => items.indexOf(item) === -1
        );

        assignedItemStore.setState(assigned);
        onChange(assigned);
        return Promise.resolve();
    }

    updateFilterText(event) {
        this.setState({ filterText: event.target.value });
    }

    renderHeader() {
        const { availableItemsHeader, assignedItemsHeader } = this.props;
        return (
            <div style={styles.headerWrap}>
                <Heading level={4} style={styles.header}>
                    {availableItemsHeader}
                </Heading>
                <div style={styles.headerSpacer} />
                <Heading level={4} style={styles.header}>
                    {assignedItemsHeader}
                </Heading>
            </div>
        );
    }

    renderSearchInput() {
        return (
            <TextField
                fullWidth={true}
                type="search"
                onChange={this.updateFilterText.bind(this)}
                value={this.state.filterText}
                floatingLabelText={i18next.t('Filter')}
                hintText={i18next.t('Filter available and selected items')}
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
                    onAssignItems={this.onAssignItems.bind(this)}
                    onRemoveItems={this.onRemoveItems.bind(this)}
                    height={250}
                    filterText={this.state.filterText}
                />
            </div>
        );
    }
}

export default SearchableGroupEditor;

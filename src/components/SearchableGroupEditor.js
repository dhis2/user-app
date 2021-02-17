import React, { Component } from 'react'
import { Store, Heading } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import { red500 } from 'material-ui/styles/colors'
import TextField from 'material-ui/TextField/TextField'
import ErrorMessage from './ErrorMessage'
import createHumanErrorMessage from '../utils/createHumanErrorMessage'
import i18n from '@dhis2/d2-i18n'
import debounce from 'lodash.debounce'
import { GroupEditor as OriginalGroupEditor } from '@dhis2/d2-ui-group-editor'

const optionElToObject = el => ({
    value: el.value,
    text: el.innerText,
})

class GroupEditor extends OriginalGroupEditor {
    constructor(props, context) {
        super(props, context)

        const i18n = this.context.d2.i18n
        this.getTranslation = i18n.getTranslation.bind(i18n)
    }

    getAssignedItems() {
        return this.getAssignedItemStoreIsCollection()
            ? Array.from(
                  this.props.assignedItemStore.state.values()
              ).map(item => ({ value: item.id, text: item.name }))
            : this.props.assignedItemStore.state || []
    }

    onAssignItems = () => {
        this.setState({ loading: true })
        this.props
            .onAssignItems(
                [].map.call(this.leftSelect.selectedOptions, optionElToObject)
            )
            .then(() => {
                this.clearSelection()
                this.setState({ loading: false })
            })
            .catch(() => {
                this.setState({ loading: false })
            })
    }

    onAssignAll = () => {
        this.setState({ loading: true })
        this.props
            .onAssignItems(
                [].map.call(this.leftSelect.options, optionElToObject)
            )
            .then(() => {
                this.clearSelection()
                this.setState({ loading: false })
            })
            .catch(() => {
                this.setState({ loading: false })
            })
    }

    onRemoveItems = () => {
        this.setState({ loading: true })
        this.props
            .onRemoveItems(
                [].map.call(this.rightSelect.selectedOptions, optionElToObject)
            )
            .then(() => {
                this.clearSelection()
                this.setState({ loading: false })
            })
            .catch(() => {
                this.setState({ loading: false })
            })
    }

    onRemoveAll = () => {
        this.setState({ loading: true })
        this.props
            .onRemoveItems(
                [].map.call(this.rightSelect.options, optionElToObject)
            )
            .then(() => {
                this.clearSelection()
                this.setState({ loading: false })
            })
            .catch(() => {
                this.setState({ loading: false })
            })
    }

    getAvailableItemsFiltered() {
        const allItems = this.getAllItems()
        const assignedItemsLookup = new Set(
            this.getAssignedItems().map(item => item.value)
        )
        return allItems.filter(item => !assignedItemsLookup.has(item.value))
    }

    getAvailableItemsCount() {
        return this.getAvailableItemsFiltered().length
    }
}

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
}

/**
 * A component that renders the d2-ui GroupEditor with a search input above it.
 * It can fetch its own items and has been made compliant with redux form.
 * On update it can return an array of either IDs or d2-models
 */
class SearchableGroupEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            itemStore: Store.create(),
            assignedItemStore: Store.create(),
            filterText: '',
            fetchErrorMsg: null,
            page: 1,
            pageCount: null,
        }
        this.wrapRef = React.createRef()
        this.fetchNextPageAtEnd = debounce(
            this.fetchNextPageAtEnd.bind(this),
            100
        )
        this.debouncedFetchWithFilter = debounce(() => {
            this.setState({
                page: 1,
                pageCount: null,
            })
            this.state.itemStore.setState([])
            this.fetchItems(1, this.state.filterText)
        }, 500)
    }

    componentDidMount() {
        this.getScrollingSelectEl().addEventListener(
            'scroll',
            this.fetchNextPageAtEnd
        )
        const { page, filterText } = this.state
        this.fetchItems(page, filterText)
    }

    componentDidUpdate(_, prevState) {
        if (prevState.filterText !== this.state.filterText) {
            this.debouncedFetchWithFilter(1, this.state.filterText)
        } else if (this.isEndInView() && this.hasMorePages()) {
            this.fetchItems(this.state.page + 1, this.state.filterText)
        }
    }

    componentWillUnmount() {
        this.getScrollingSelectEl().removeEventListener(
            'scroll',
            this.fetchNextPageAtEnd
        )
    }

    fetchItems = async (page, filterText) => {
        try {
            const response = await this.props.availableItemsQuery(
                page,
                filterText
            )
            this.availableItemsReceivedHandler(response)
        } catch (error) {
            console.error(error)
            const fetchErrorMsg = createHumanErrorMessage(
                error,
                i18n.t('Could not load available items')
            )
            this.setState({ fetchErrorMsg })
        }
    }

    fetchNextPageAtEnd() {
        if (this.isEndInView() && this.hasMorePages()) {
            const { page, filterText } = this.state
            this.fetchItems(page + 1, filterText)
        }
    }

    isEndInView() {
        const offset = 30
        const el = this.getScrollingSelectEl()
        return (
            !!el && el.scrollHeight - el.scrollTop <= el.clientHeight + offset
        )
    }

    hasMorePages() {
        return this.state.page < this.state.pageCount
    }

    getScrollingSelectEl() {
        const wrapEl = this.wrapRef.current
        return wrapEl.getElementsByTagName('select')[0]
    }

    availableItemsReceivedHandler = ({ pager, items }) => {
        // On update we want to be able to return an array of IDs or models
        const { initiallyAssignedItems } = this.props
        const { itemStore, assignedItemStore } = this.state

        // if (returnModelsOnUpdate) {
        //     this.modelLookup = new Map()
        // }
        const assignedItems =
            assignedItemStore.state ||
            initiallyAssignedItems
                .map(item => ({
                    value: item.id,
                    text: item.displayName || item.name,
                }))
                .concat(assignedItemStore.state || [])

        const availableItems = items.reduce((acc, item) => {
            acc.push({
                value: item.id,
                text: item.displayName || item.name,
            })
            return acc
        }, itemStore.state || [])

        this.setState({
            page: pager.page,
            pageCount: pager.pageCount,
        })
        itemStore.setState(availableItems)
        assignedItemStore.setState(assignedItems)
    }

    onAssignItems = items => {
        const { assignedItemStore } = this.state
        const assigned = assignedItemStore.state.concat(items)

        return this.update(assigned)
    }

    onRemoveItems = items => {
        const removeLookup = new Set(items.map(item => item.value))
        const { assignedItemStore } = this.state
        const assigned = assignedItemStore.state.filter(
            item => !removeLookup.has(item.value)
        )
        return this.update(assigned)
    }

    update(assignedItems) {
        const { onChange, onBlur } = this.props
        const { assignedItemStore } = this.state
        const assignedItemIds = assignedItems.map(item => item.value)

        assignedItemStore.setState(assignedItems)
        onChange(assignedItemIds)
        // Also call onBlur if this is available. In a redux-form the component will be 'touched' by it
        onBlur && onBlur()
        return Promise.resolve()
    }

    updateFilterText = event => {
        this.setState({ filterText: event.target.value })
    }

    renderHeader() {
        const {
            availableItemsHeader,
            assignedItemsHeader,
            errorText,
        } = this.props
        const assignedStyle = errorText
            ? { ...styles.header, ...styles.error }
            : styles.header

        return (
            <div style={styles.headerWrap}>
                <Heading level={4} style={styles.header}>
                    {availableItemsHeader}
                </Heading>
                <div style={styles.headerSpacer} />
                <Heading level={4} style={assignedStyle}>
                    {assignedItemsHeader}
                    {errorText ? (
                        <span style={styles.errorText}>{errorText}</span>
                    ) : null}
                </Heading>
            </div>
        )
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
        )
    }
    renderGroupEditor() {
        const { itemStore, assignedItemStore, fetchErrorMsg } = this.state

        if (fetchErrorMsg) {
            const introText = i18n.t(
                'There was a problem displaying the GroupEditor'
            )
            return (
                <ErrorMessage
                    introText={introText}
                    errorMessage={fetchErrorMsg}
                />
            )
        }

        return (
            <GroupEditor
                itemStore={itemStore}
                assignedItemStore={assignedItemStore}
                onAssignItems={this.onAssignItems}
                onRemoveItems={this.onRemoveItems}
                // height={250}
                height={80}
            />
        )
    }

    render() {
        return (
            <div style={styles.outerWrap} ref={this.wrapRef}>
                {this.renderHeader()}
                {this.renderSearchInput()}
                {this.renderGroupEditor()}
            </div>
        )
    }
}

SearchableGroupEditor.propTypes = {
    assignedItemsHeader: PropTypes.string.isRequired,
    availableItemsHeader: PropTypes.string.isRequired,
    availableItemsQuery: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errorText: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    initiallyAssignedItems: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.array.isRequired,
    ]),
    // returnModelsOnUpdate: PropTypes.bool,
    onBlur: PropTypes.func,
}

export default SearchableGroupEditor

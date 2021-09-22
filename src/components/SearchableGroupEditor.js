import i18n from '@dhis2/d2-i18n'
import { Field, Transfer } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import asArray from '../utils/asArray'
import createHumanErrorMessage from '../utils/createHumanErrorMessage'
import ErrorMessage from './ErrorMessage'

const styles = {
    transferHeader: {
        margin: '12px 0',
        fontWeight: 'normal',
    },
}

const Header = ({ children }) => (
    <h4 style={styles.transferHeader}>{children}</h4>
)
Header.propTypes = {
    children: PropTypes.node,
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
            loading: true,
            availableItems: [],
            selected: [],
            fetchErrorMsg: null,
        }
    }

    async componentDidMount() {
        try {
            const {
                availableItemsQuery,
                initiallyAssignedItems,
                returnModelsOnUpdate,
            } = this.props
            const response = await availableItemsQuery()

            if (returnModelsOnUpdate) {
                this.modelLookup = new Map()
            }

            const selected = asArray(initiallyAssignedItems).map(({ id }) => id)
            const availableItems = asArray(response).map(item => {
                if (returnModelsOnUpdate) {
                    this.modelLookup.set(item.id, item)
                }
                const label = item.displayName || item.name
                return {
                    label,
                    value: item.id,
                }
            })

            this.setState({ availableItems, selected, loading: false })
        } catch (error) {
            const fetchErrorMsg = createHumanErrorMessage(
                error,
                i18n.t('Could not load available items')
            )
            this.setState({ fetchErrorMsg, loading: false })
        }
    }

    onChange = ({ selected }) => {
        const { returnModelsOnUpdate, onBlur } = this.props
        const assignedItems = returnModelsOnUpdate
            ? selected.map(id => this.modelLookup.get(id))
            : selected

        this.props.onChange(assignedItems)
        // Also call onBlur if this is available. In a redux-form the component will be 'touched' by it
        onBlur && onBlur()
        this.setState({ selected })
        return Promise.resolve()
    }

    render() {
        const { availableItems, selected, loading } = this.state
        const {
            availableItemsHeader,
            assignedItemsHeader,
            errorText,
        } = this.props

        if (this.state.fetchErrorMsg) {
            return (
                <ErrorMessage
                    introText={i18n.t(
                        'There was a problem displaying the GroupEditor'
                    )}
                    errorMessage={this.state.fetchErrorMsg}
                />
            )
        }

        return (
            <Field error={!!errorText} validationText={errorText || ''}>
                <Transfer
                    filterable
                    filterablePicked
                    filterPlaceholder={i18n.t('Filter available options')}
                    filterPlaceholderPicked={i18n.t('Filter selected options')}
                    leftHeader={<Header>{availableItemsHeader}</Header>}
                    rightHeader={<Header>{assignedItemsHeader}</Header>}
                    options={availableItems}
                    loading={loading}
                    loadingPicked={loading}
                    selected={selected}
                    optionsWidth="calc(100% - 48px)"
                    selectedWidth="calc(100% - 48px)"
                    height="400px"
                    onChange={this.onChange}
                />
            </Field>
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
    returnModelsOnUpdate: PropTypes.bool,
    onBlur: PropTypes.func,
}

export default SearchableGroupEditor

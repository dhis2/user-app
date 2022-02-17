import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Field, Transfer } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import createHumanErrorMessage from '../../utils/createHumanErrorMessage'
import ErrorMessage from '../ErrorMessage'
import styles from './SearchableGroupEditor.module.css'

const SearchableGroupEditor = ({
    assignedItemsHeader,
    availableItemsHeader,
    availableItemsQuery,
    onChange,
    errorText,
    initiallyAssignedItems,
    returnModelsOnUpdate,
    onBlur,
}) => {
    const modelLookupRef = useRef(new Map())
    const { loading, error, data } = useDataQuery(availableItemsQuery)
    const entityName = availableItemsQuery.availableItems.resource.split('/')[0]
    const availableItems = data
        ? data.availableItems[entityName].map(item => {
              if (returnModelsOnUpdate) {
                  modelLookupRef.current.set(item.id, item)
              }
              const label = item.displayName || item.name
              return {
                  label,
                  value: item.id,
              }
          })
        : []
    const [selectedItems, setSelectedItems] = useState(
        initiallyAssignedItems.map(({ id }) => id)
    )
    const fetchErrorMessage = error
        ? createHumanErrorMessage(
              error,
              i18n.t('Could not load available items')
          )
        : null
    const onTransferChange = ({ selected }) => {
        const assignedItems = returnModelsOnUpdate
            ? selected.map(id => this.modelLookup.get(id))
            : selected

        onChange(assignedItems)
        // Also call onBlur if this is available. In a redux-form the component will be 'touched' by it
        onBlur && onBlur()
        setSelectedItems(selected)
    }

    if (fetchErrorMessage) {
        return (
            <ErrorMessage
                introText={i18n.t(
                    'There was a problem displaying the GroupEditor'
                )}
                errorMessage={fetchErrorMessage}
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
                leftHeader={
                    <h4 className={styles.header}>{availableItemsHeader}</h4>
                }
                rightHeader={
                    <h4 className={styles.header}>{assignedItemsHeader}</h4>
                }
                options={availableItems}
                loading={loading}
                loadingPicked={loading}
                selected={selectedItems}
                optionsWidth="calc(100% - 48px)"
                selectedWidth="calc(100% - 48px)"
                height="400px"
                onChange={onTransferChange}
            />
        </Field>
    )
}

SearchableGroupEditor.propTypes = {
    assignedItemsHeader: PropTypes.string.isRequired,
    availableItemsHeader: PropTypes.string.isRequired,
    availableItemsQuery: PropTypes.object.isRequired,
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

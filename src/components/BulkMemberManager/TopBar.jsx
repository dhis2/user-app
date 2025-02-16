import { InputField, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { addEntity, removeEntity } from './pendingChangesActions.js'
import PendingChangesPropType from './PendingChangesPropType.js'
import styles from './TopBar.module.css'

const TopBar = ({
    filterLabel,
    selectionText,
    actionText,
    mode,
    filter,
    onFilterChange,
    selectedResults,
    pagerTotal,
    pendingChanges,
    onChange,
    clearAllSelected,
}) => {
    const selectedCount = selectedResults.length

    if (selectedCount === 0) {
        return (
            <InputField
                placeholder={
                    typeof filterLabel === 'function'
                        ? filterLabel({ mode })
                        : filterLabel
                }
                value={filter}
                onChange={({ value }) => onFilterChange(value)}
                inputWidth="300px"
                type="search"
                dense
            />
        )
    }

    return (
        <>
            <span className={styles.selection}>
                {typeof selectionText === 'function'
                    ? selectionText({ selectedCount, pagerTotal })
                    : selectionText}
            </span>
            <Button
                small
                secondary
                onClick={() => {
                    onChange(
                        selectedResults.reduce((pendingChanges, entity) => {
                            if (mode === 'MEMBERS') {
                                return removeEntity(pendingChanges, entity)
                            } else {
                                return addEntity(pendingChanges, entity)
                            }
                        }, pendingChanges)
                    )
                    clearAllSelected()
                }}
            >
                {typeof actionText === 'function'
                    ? actionText({ mode, selectedCount })
                    : actionText}
            </Button>
        </>
    )
}

TopBar.defaultProps = {
    selectedResults: [],
}

TopBar.propTypes = {
    clearAllSelected: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    mode: PropTypes.oneOf(['MEMBERS', 'NON_MEMBERS']).isRequired,
    pendingChanges: PendingChangesPropType.isRequired,
    onChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    actionText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    filterLabel: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    pagerTotal: PropTypes.number,
    selectedResults: PropTypes.array,
    selectionText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
}

export default TopBar

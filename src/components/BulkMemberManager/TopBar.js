import { InputField, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { addEntity, removeEntity } from './pendingChangesActions'
import PendingChangesPropType from './PendingChangesPropType'
import styles from './TopBar.module.css'

const TopBar = ({
    filterLabel,
    selectionText,
    actionText,
    mode,
    loading,
    filter,
    onFilterChange,
    selectedUsers,
    pagerTotal,
    pendingChanges,
    onChange,
}) => {
    const selectedCount = selectedUsers.length

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
                disabled={loading}
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
                        selectedUsers.reduce((pendingChanges, user) => {
                            if (mode === 'MEMBERS') {
                                return removeEntity(pendingChanges, user)
                            } else {
                                return addEntity(pendingChanges, user)
                            }
                        }, pendingChanges)
                    )
                }}
            >
                {typeof actionText === 'function'
                    ? actionText({ mode, selectedCount })
                    : actionText}
            </Button>
        </>
    )
}

TopBar.propTypes = {
    filter: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(['MEMBERS', 'NON_MEMBERS']).isRequired,
    pendingChanges: PendingChangesPropType.isRequired,
    selectedUsers: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    actionText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    filterLabel: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    pagerTotal: PropTypes.number,
    selectionText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
}

export default TopBar

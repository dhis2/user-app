import i18n from '@dhis2/d2-i18n'
import { InputField, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './TopBar.module.css'

const TopBar = ({
    mode,
    loading,
    filter,
    onFilterChange,
    selectedUsers,
    totalUsers,
    pendingChanges,
}) => {
    const selectedCount = selectedUsers.length

    if (selectedCount === 0) {
        return (
            <InputField
                placeholder={
                    mode === 'MEMBERS'
                        ? i18n.t('Search for a user in this group')
                        : i18n.t('Search for a user to add')
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
                {totalUsers === 1
                    ? i18n.t('1 of 1 user selected')
                    : i18n.t(
                          '{{selectedCount}} of {{totalUsers}} users selected',
                          {
                              selectedCount,
                              totalUsers,
                          }
                      )}
            </span>
            <Button
                small
                secondary
                onClick={() => {
                    selectedUsers.forEach(user => {
                        if (mode === 'MEMBERS') {
                            pendingChanges.remove(user)
                        } else {
                            pendingChanges.add(user)
                        }
                    })
                }}
            >
                {mode === 'MEMBERS'
                    ? selectedCount === 1
                        ? i18n.t('Remove 1 user')
                        : i18n.t('Remove {{selectedCount}} users', {
                              selectedCount,
                          })
                    : selectedCount === 1
                    ? i18n.t('Add 1 user')
                    : i18n.t('Add {{selectedCount}} users', {
                          selectedCount,
                      })}
            </Button>
        </>
    )
}

TopBar.propTypes = {
    filter: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(['MEMBERS', 'NON_MEMBERS']).isRequired,
    pendingChanges: PropTypes.shape({
        add: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
    }).isRequired,
    selectedUsers: PropTypes.array.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    totalUsers: PropTypes.number,
}

export default TopBar

import i18n from '@dhis2/d2-i18n'
import { Button, IconCross16, IconAdd16, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './PendingChanges.module.css'

const PendingChanges = ({ pendingChanges }) => (
    <>
        <div className={styles.pendingChangesRow}>
            <span className={styles.pendingChangesCount}>
                {pendingChanges.size === 1
                    ? i18n.t('1 pending change')
                    : i18n.t('{{pendingChanges}} pending changes', {
                          pendingChanges: pendingChanges.size,
                      })}
            </span>
            {pendingChanges.size > 0 && (
                <Button secondary small onClick={pendingChanges.cancelAll}>
                    {i18n.t('Cancel all')}
                </Button>
            )}
        </div>
        {pendingChanges.map(pendingChange => {
            const { action, userId, username } = pendingChange

            return (
                <div
                    key={userId}
                    className={
                        action === 'ADD'
                            ? styles.pendingAddRow
                            : styles.pendingRemoveRow
                    }
                >
                    <span className={styles.pendingChangeSummary}>
                        {action === 'ADD' ? (
                            <IconAdd16 color={colors.green700} />
                        ) : (
                            <IconCross16 color={colors.red700} />
                        )}
                        {username}
                    </span>
                    <Button
                        secondary
                        small
                        onClick={() => pendingChanges.cancel(pendingChange)}
                    >
                        {i18n.t('Cancel')}
                    </Button>
                </div>
            )
        })}
    </>
)

PendingChanges.propTypes = {
    pendingChanges: PropTypes.shape({
        cancel: PropTypes.func.isRequired,
        cancelAll: PropTypes.func.isRequired,
        map: PropTypes.func.isRequired,
        size: PropTypes.number.isRequired,
    }).isRequired,
}

export default PendingChanges

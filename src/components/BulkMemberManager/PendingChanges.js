import i18n from '@dhis2/d2-i18n'
import { Button, IconCross16, IconAdd16, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './PendingChanges.module.css'
import {
    resetChanges,
    cancelAddEntity,
    cancelRemoveEntity,
    totalPendingChanges,
} from './pendingChangesActions.js'
import PendingChangesPropType from './PendingChangesPropType.js'

const PendingChanges = ({ pendingChanges, onChange }) => (
    <>
        <div className={styles.pendingChangesRow}>
            <span className={styles.pendingChangesCount}>
                {totalPendingChanges(pendingChanges) === 1
                    ? i18n.t('1 pending change')
                    : i18n.t('{{pendingChanges}} pending changes', {
                          pendingChanges: totalPendingChanges(pendingChanges),
                      })}
            </span>
            {totalPendingChanges(pendingChanges) > 0 && (
                <Button
                    secondary
                    small
                    onClick={() => onChange(resetChanges())}
                >
                    {i18n.t('Cancel all')}
                </Button>
            )}
        </div>
        <div className={styles.scrollbox}>
            {pendingChanges.additions.map((entity) => (
                <div key={entity.id} className={styles.pendingAddRow}>
                    <span className={styles.pendingChangeSummary}>
                        <IconAdd16 color={colors.green700} />
                        {entity.displayName}
                    </span>
                    <Button
                        secondary
                        small
                        onClick={() =>
                            onChange(cancelAddEntity(pendingChanges, entity))
                        }
                    >
                        {i18n.t('Cancel')}
                    </Button>
                </div>
            ))}
            {pendingChanges.removals.map((entity) => (
                <div key={entity.id} className={styles.pendingRemoveRow}>
                    <span className={styles.pendingChangeSummary}>
                        <IconCross16 color={colors.red700} />
                        {entity.displayName}
                    </span>
                    <Button
                        secondary
                        small
                        onClick={() =>
                            onChange(cancelRemoveEntity(pendingChanges, entity))
                        }
                    >
                        {i18n.t('Cancel')}
                    </Button>
                </div>
            ))}
        </div>
    </>
)

PendingChanges.propTypes = {
    pendingChanges: PendingChangesPropType.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default PendingChanges

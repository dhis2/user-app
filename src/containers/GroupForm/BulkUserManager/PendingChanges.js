import i18n from '@dhis2/d2-i18n'
import { Button, IconCross16, IconAdd16, colors } from '@dhis2/ui'
import React from 'react'
import styles from './PendingChanges.module.css'

const PendingChanges = () => (
    <div>
        <div className={styles.pendingChangesRow}>
            <span className={styles.pendingChangesCount}>
                {i18n.t('{{pendingChanges}} pending changes', {
                    pendingChanges: 2,
                })}
            </span>
            <Button secondary small>
                {i18n.t('Cancel all')}
            </Button>
        </div>
        <div className={styles.pendingAddRow}>
            <span className={styles.pendingChangeSummary}>
                <IconAdd16 color={colors.green700} />
                k.olayinka
            </span>
            <Button secondary small>
                {i18n.t('Cancel')}
            </Button>
        </div>
        <div className={styles.pendingRemoveRow}>
            <span className={styles.pendingChangeSummary}>
                <IconCross16 color={colors.red700} />
                afolayan
            </span>
            <Button secondary small>
                {i18n.t('Cancel')}
            </Button>
        </div>
    </div>
)

export default PendingChanges

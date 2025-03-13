import i18n from '@dhis2/d2-i18n'
import {
    DataTableRow,
    DataTableCell,
    Checkbox,
    Button,
    IconAdd16,
    IconCross16,
    colors,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ResultsTableRow.module.css'

const PendingChange = ({ action, onCancel }) => (
    <div className={styles.pendingChange}>
        {action === 'ADD' ? (
            <>
                <IconAdd16 color={colors.green700} />
                <span className={styles.pendingChangeDescription}>
                    {i18n.t('Will be added')}
                </span>
            </>
        ) : (
            <>
                <IconCross16 color={colors.red700} />
                <span className={styles.pendingChangeDescription}>
                    {i18n.t('Will be removed')}
                </span>
            </>
        )}
        <Button secondary small onClick={onCancel}>
            {i18n.t('Cancel')}
        </Button>
    </div>
)

PendingChange.propTypes = {
    action: PropTypes.oneOf(['ADD', 'REMOVE']).isRequired,
    onCancel: PropTypes.func.isRequired,
}

const ResultsTableRow = ({
    cells,
    pendingChangeAction,
    onPendingChangeCancel,
    actionButton,
    selected,
    onToggleSelected,
}) => (
    <DataTableRow
        className={cx(styles.row, {
            [styles.pendingAddRow]: pendingChangeAction === 'ADD',
            [styles.pendingRemoveRow]: pendingChangeAction === 'REMOVE',
        })}
    >
        <DataTableCell width="48px">
            <Checkbox
                checked={selected}
                disabled={!!pendingChangeAction}
                onChange={onToggleSelected}
            />
        </DataTableCell>
        {cells.map((cell, index) => (
            <DataTableCell key={index}>{cell}</DataTableCell>
        ))}
        <DataTableCell className={styles.actionCell}>
            {pendingChangeAction ? (
                <PendingChange
                    action={pendingChangeAction}
                    onCancel={onPendingChangeCancel}
                />
            ) : (
                actionButton
            )}
        </DataTableCell>
    </DataTableRow>
)

ResultsTableRow.propTypes = {
    actionButton: PropTypes.element.isRequired,
    cells: PropTypes.array.isRequired,
    selected: PropTypes.bool.isRequired,
    onPendingChangeCancel: PropTypes.func.isRequired,
    onToggleSelected: PropTypes.func.isRequired,
    pendingChangeAction: PropTypes.oneOf(['ADD', 'REMOVE']),
}

export default ResultsTableRow

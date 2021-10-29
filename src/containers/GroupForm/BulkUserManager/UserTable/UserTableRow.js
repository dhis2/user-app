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
import PropTypes from 'prop-types'
import React from 'react'
import styles from './UserTableRow.module.css'

const getRowClass = pendingChangeAction => {
    switch (pendingChangeAction) {
        case 'ADD':
            return styles.pendingAddRow
        case 'REMOVE':
            return styles.pendingRemoveRow
    }
}

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

const UserTableRow = ({
    user,
    pendingChangeAction,
    onPendingChangeCancel,
    actionButton,
    toggleSelected,
}) => (
    <DataTableRow key={user.id} className={getRowClass(pendingChangeAction)}>
        <DataTableCell width="48px">
            <Checkbox onChange={toggleSelected} value={user.id} />
        </DataTableCell>
        <DataTableCell>{user.username}</DataTableCell>
        <DataTableCell>{user.name}</DataTableCell>
        <DataTableCell>
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

UserTableRow.propTypes = {
    actionButton: PropTypes.element.isRequired,
    toggleSelected: PropTypes.func.isRequired,
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
    }).isRequired,
    onPendingChangeCancel: PropTypes.func.isRequired,
    pendingChangeAction: PropTypes.oneOf(['ADD', 'REMOVE']),
}

export default UserTableRow

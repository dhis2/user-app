import i18n from '@dhis2/d2-i18n'
import { useDataEngine } from '@dhis2/app-runtime'
import React, { useState } from 'react'
import styles from './BulkUserManager.module.css'
import PendingChanges from './PendingChanges'
import UsersTable from './UsersTable'
import PropTypes from 'prop-types'

const useDataQuery = ({ groupId }) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)
    const engine = useDataEngine()

    // TODO: handle pagination
    // TODO: reset pagination when switching modes

    useEffect(() => {
        const fields = [
            'id',
            'firstName',
            'surname',
        ]
        engine.query({
            existingUsers: {
                resource: `userGroups/${groupId}/users/gist`,
                params: {
                    fields,
                    total: true,
                }
            }
        })
    }, [])

    return {
        loading,
        error,
        data
    }
}

const BulkUserManager = ({ groupId }) => {
    const [mode, setMode] = useState('VIEW_AND_REMOVE')
    const { loading, error, data } = useDataQuery({ groupId })

    const toggleAll = () => {}
    const toggleSelected = () => {}

    return (
        <div className={styles.container}>
            <h2>{i18n.t('Users')}</h2>
            <div className={styles.modeButtons}>
                <button
                    type="button"
                    className={
                        mode === 'VIEW_AND_REMOVE'
                            ? styles.selectedModeButton
                            : styles.modeButton
                    }
                    onClick={() => setMode('VIEW_AND_REMOVE')}
                >
                    {i18n.t('View and remove users from group')}
                </button>
                <button
                    type="button"
                    className={
                        mode === 'ADD'
                            ? styles.selectedModeButton
                            : styles.modeButton
                    }
                    onClick={() => setMode('ADD')}
                >
                    {i18n.t('Add users to group')}
                </button>
            </div>
            <div className={styles.grid}>
                <UsersTable
                    mode={mode}
                    toggleAll={toggleAll}
                    toggleSelected={toggleSelected}
                />
                <PendingChanges />
            </div>
        </div>
    )
}

BulkUserManager.propTypes = {
    groupId: PropTypes.string.isRequired,
}

export default BulkUserManager

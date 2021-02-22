import React from 'react'
import BulkUpdateButton from './BulkUpdateButton.js'
import SearchInput from './SearchInput.js'
import StatusSelect, { STATUS_ALL, STATUS_MEMBER } from './StatusSelect.js'
import UserList from './UserList.js'
import useGroupUserManagerState from './hooks/index.js'
import styles from './GroupUserManagement.module.css'
import Pagination from '../../../components/Pagination.js'

const initialState = {
    data: {},
    page: 1,
    error: null,
    loading: true,
    filterStr: '',
    filterStatus: STATUS_MEMBER,
    selectedUsers: [],
}

export default function GroupUserManagement() {
    const { state, actions } = useGroupUserManagerState(initialState)
    const allowBulkUpdate = state.filterStatus !== STATUS_ALL
    const pagination = (
        <Pagination
            decrementPage={() => actions.setPage(state.page - 1)}
            incrementPage={() => actions.setPage(state.page + 1)}
            pager={state.data.pager}
        />
    )

    return (
        <div>
            <div className={styles.toolbar}>
                <div className={styles.left}>
                    <SearchInput callback={actions.setFilterString} />
                    <StatusSelect
                        value={state.filterStatus}
                        onChange={actions.setFilterStatus}
                    />
                </div>
                <div className={styles.right}>
                    {allowBulkUpdate && state.selectedUsers.length > 0 && (
                        <BulkUpdateButton
                            isMemberMode={state.filterStatus === STATUS_MEMBER}
                            selectedUsers={state.selectedUsers}
                        />
                    )}
                    {pagination}
                </div>
            </div>
            <UserList
                users={state.data && state.data.users}
                selectedUsers={state.selectedUsers}
                selectable={allowBulkUpdate}
                loading={state.loading}
                error={state.error}
                setSelectedUsers={actions.setSelectedUsers}
            />
            {pagination}
        </div>
    )
}

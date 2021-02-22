import React, { useState } from 'react'
import i18n from '@dhis2/d2-i18n'
import { connect } from 'react-redux'
import PropTypes from '@dhis2/prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import detectCurrentUserChanges from '../../../utils/detectCurrentUserChanges'
import navigateTo from '../../../utils/navigateTo'
import { clearItem, showSnackbar, getList } from '../../../actions'
import { USER_GROUP } from '../../../constants/entityTypes'
import api from '../../../api'
import createHumanErrorMessage from '../../../utils/createHumanErrorMessage'

const BulkUpdateButton = ({
    group,
    isMemberMode,
    selectedUsers,
    ...actions
}) => {
    const [isDialogOpen, setDialogOpen] = useState(false)
    const closeDialog = () => setDialogOpen(false)

    const confirm = async () => {
        closeDialog()
        try {
            await api.updateUserGroupMembership(
                group.id,
                selectedUsers,
                isMemberMode
            )

            const msg = i18n.t(
                'Successfully {{action}} {{count}} users form user group "{{displayName}}"',
                {
                    action: isMemberMode ? i18n.t('removed') : i18n.t('added'),
                    count: selectedUsers.length,
                    displayName: group.name,
                }
            )

            actions.showSnackbar({ message: msg })
            actions.clearItem()
            actions.getList(USER_GROUP)
            navigateTo('/user-groups')
            detectCurrentUserChanges(group)
        } catch (error) {
            showSnackbar({
                message: createHumanErrorMessage(
                    error,
                    i18n.t(
                        'There was a problem updating the user group memberships.'
                    )
                ),
            })
        }
    }
    const buttonLabel = i18n.t('{{action}} {{count}} users', {
        action: isMemberMode ? i18n.t('Remove') : i18n.t('Add'),
        count: selectedUsers.length,
    })
    const dialogMsg = i18n.t('Please confirm {{action}} of {{count}} users', {
        action: isMemberMode ? 'removal' : 'addition',
        count: selectedUsers.length,
    })
    const dialogButtons = [
        <FlatButton
            key="cancel"
            label={i18n.t('Cancel')}
            onClick={closeDialog}
        />,
        <FlatButton
            key="confirm"
            keyboardFocused={true}
            label={i18n.t('Confirm')}
            primary
            onClick={confirm}
        />,
    ]

    return (
        <>
            <RaisedButton
                label={buttonLabel}
                primary
                onClick={() => setDialogOpen(true)}
            />
            <Dialog
                title={i18n.t('Confirmation')}
                actions={dialogButtons}
                open={isDialogOpen}
                onRequestClose={closeDialog}
            >
                {dialogMsg}
            </Dialog>
        </>
    )
}

BulkUpdateButton.propTypes = {
    group: PropTypes.object,
    isMemberMode: PropTypes.bool,
    selectedUsers: PropTypes.arrayOf(PropTypes.string),
}

const mapStateToProps = state => ({
    group: state.currentItem,
})

export default connect(mapStateToProps, {
    clearItem,
    showSnackbar,
    getList,
})(BulkUpdateButton)

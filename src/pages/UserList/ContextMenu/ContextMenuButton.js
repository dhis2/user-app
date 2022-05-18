import { colors, IconMore24, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import ContextMenu from './ContextMenu.js'
import styles from './ContextMenuButton.module.css'

const ContextMenuButton = ({ user, refetchUsers }) => {
    const ref = useRef()
    const [visible, setVisible] = useState(false)

    return (
        <div ref={ref} className={styles.container}>
            <Button
                small
                secondary
                icon={<IconMore24 color={colors.grey600} />}
                onClick={() => setVisible(true)}
                dataTest="context-menu-button"
            ></Button>
            {visible && (
                <ContextMenu
                    anchorRef={ref}
                    user={user}
                    refetchUsers={refetchUsers}
                    onClose={() => setVisible(false)}
                />
            )}
        </div>
    )
}

ContextMenuButton.propTypes = {
    refetchUsers: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
}

export default ContextMenuButton

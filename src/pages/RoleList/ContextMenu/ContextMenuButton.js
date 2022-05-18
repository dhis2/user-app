import { colors, IconMore24, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import ContextMenu from './ContextMenu.js'
import styles from './ContextMenuButton.module.css'

const ContextMenuButton = ({ role, refetchRoles }) => {
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
                    role={role}
                    refetchRoles={refetchRoles}
                    onClose={() => setVisible(false)}
                />
            )}
        </div>
    )
}

ContextMenuButton.propTypes = {
    refetchRoles: PropTypes.func.isRequired,
    role: PropTypes.object.isRequired,
}

export default ContextMenuButton

import { colors, IconMore24, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import ContextMenu from './ContextMenu'
import styles from './ContextMenuButton.module.css'

const ContextMenuButton = ({ user }) => {
    const ref = useRef()
    const [visible, setVisible] = useState(false)

    return (
        <div ref={ref} className={styles.container}>
            <Button
                small
                secondary
                icon={<IconMore24 color={colors.grey600} />}
                onClick={() => setVisible(true)}
            ></Button>
            {visible && (
                <ContextMenu
                    anchorRef={ref}
                    user={user}
                    onClose={() => setVisible(false)}
                />
            )}
        </div>
    )
}

ContextMenuButton.propTypes = {
    user: PropTypes.object.isRequired,
}

export default ContextMenuButton

import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    DataTableRow,
    DataTableCell,
    CenteredContent,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import createHumanErrorMessage from '../../utils/createHumanErrorMessage'
import styles from './AuthorityTableBodyMask.module.css'

const AuthorityTableBodyMask = ({
    children,
    loading,
    error,
    noMatches,
    colSpan,
}) => {
    if (loading || error || noMatches) {
        return (
            <DataTableRow>
                <DataTableCell
                    colSpan={colSpan}
                    muted={!loading && noMatches}
                    error={!loading && error}
                    className={cx({ [styles.fullHeight]: loading })}
                    staticStyle
                    align="center"
                >
                    {loading && (
                        <CenteredContent>
                            <CircularLoader />
                        </CenteredContent>
                    )}

                    {!loading &&
                        error &&
                        createHumanErrorMessage(
                            error,
                            i18n.t(
                                'There was a problem retreiving the available authorities.'
                            )
                        )}

                    {!loading && noMatches && i18n.t('No matches found')}
                </DataTableCell>
            </DataTableRow>
        )
    }

    return children
}

AuthorityTableBodyMask.propTypes = {
    children: PropTypes.node.isRequired,
    colSpan: PropTypes.string,
    error: PropTypes.any,
    loading: PropTypes.bool,
    noMatches: PropTypes.bool,
}

export { AuthorityTableBodyMask }

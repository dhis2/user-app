import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    DataTableRow,
    DataTableCell,
    CenteredContent,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import createHumanErrorMessage from '../../utils/createHumanErrorMessage'

const AuthorityTableBodyMask = ({ children, loading, error, noMatches }) => {
    if (loading) {
        return (
            <DataTableRow>
                <DataTableCell>
                    <CenteredContent>
                        <CircularLoader small />
                    </CenteredContent>
                </DataTableCell>
            </DataTableRow>
        )
    }

    if (!loading && error) {
        return (
            <DataTableRow>
                <DataTableCell error>
                    {createHumanErrorMessage(
                        error,
                        i18n.t(
                            'There was a problem retreiving the available authorities.'
                        )
                    )}
                </DataTableCell>
                )
            </DataTableRow>
        )
    }

    if (!loading && noMatches) {
        return (
            <DataTableRow>
                <DataTableCell muted>
                    {i18n.t('No matches found')}
                </DataTableCell>
            </DataTableRow>
        )
    }

    return children
}

AuthorityTableBodyMask.propTypes = {
    children: PropTypes.node.isRequired,
    error: PropTypes.any,
    loading: PropTypes.bool,
    noMatches: PropTypes.bool,
}

export { AuthorityTableBodyMask }

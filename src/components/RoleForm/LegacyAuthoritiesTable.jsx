import i18n from '@dhis2/d2-i18n'
import {
    Button,
    DataTable,
    DataTableHead,
    DataTableRow,
    DataTableColumnHeader,
    DataTableBody,
    DataTableCell,
    ReactFinalForm,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import DataTableInfoWrapper from '../BulkMemberManager/ResultsTable/DataTableInfoWrapper.jsx'
import styles from './MetadataAuthoritiesTable.module.css'

const ColumnHeader = ({ children }) => (
    <DataTableColumnHeader fixed top="0" className={styles.columnHeader}>
        {children}
    </DataTableColumnHeader>
)

ColumnHeader.propTypes = {
    children: PropTypes.node.isRequired,
}

const EmptyMessage = () => (
    <DataTableInfoWrapper>
        <span>
            {i18n.t(
                'There are no legacy or nonstandard authorities assigned to this user role.'
            )}
        </span>
    </DataTableInfoWrapper>
)

const Row = ({ item, removeAuthority }) => (
    <DataTableRow>
        <DataTableCell>{item}</DataTableCell>
        <DataTableCell>
            <Button small destructive secondary onClick={removeAuthority}>
                {i18n.t('Remove')}
            </Button>
        </DataTableCell>
    </DataTableRow>
)

Row.propTypes = {
    item: PropTypes.string.isRequired,
    removeAuthority: PropTypes.func.isRequired,
}

const LegacyAuthoritiesTable = React.memo(
    ({ legacyAuthorities, handleAuthorityRemove }) => {
        if (legacyAuthorities.size === 0) {
            return (
                <div className={styles.container}>
                    <EmptyMessage />
                </div>
            )
        }
        return (
            <div
                className={styles.container}
                data-test="legacy-authorities-table"
            >
                <DataTable scrollHeight="375px">
                    <DataTableHead>
                        <DataTableRow>
                            <ColumnHeader>{i18n.t('Authority')}</ColumnHeader>
                            <ColumnHeader>
                                {i18n.t('Remove authority')}
                            </ColumnHeader>
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        {[...legacyAuthorities].map((item) => (
                            <Row
                                key={item}
                                item={item}
                                removeAuthority={() => {
                                    handleAuthorityRemove({ id: item })
                                }}
                            />
                        ))}
                    </DataTableBody>
                </DataTable>
            </div>
        )
    }
)

LegacyAuthoritiesTable.propTypes = {
    legacyAuthorities: PropTypes.instanceOf(Set).isRequired,
    handleAuthorityRemove: PropTypes.func,
}

const LegacyAuthoritiesTableFF = ({
    input,
    // Don't pass meta to MetadataAuthoritiesTable component as it invalidates React.memo
    // eslint-disable-next-line no-unused-vars
    meta,
    ...props
}) => {
    const { value: inputValue, onChange: inputOnChange } = input
    const handleAuthorityRemove = useCallback(
        ({ id }) => {
            const newSelectedAuthorities = new Set(inputValue)
            if (newSelectedAuthorities.has(id)) {
                newSelectedAuthorities.delete(id)
            }
            inputOnChange(newSelectedAuthorities)
        },
        [inputValue, inputOnChange]
    )

    return (
        <LegacyAuthoritiesTable
            {...props}
            legacyAuthorities={input.value}
            handleAuthorityRemove={handleAuthorityRemove}
        />
    )
}

LegacyAuthoritiesTableFF.propTypes = {
    input: PropTypes.shape({
        value: PropTypes.instanceOf(Set).isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
    meta: PropTypes.object.isRequired,
}

export const LegacyAuthoritiesTableField = ({
    legacyAuthorities,
    ...props
}) => {
    // Fixes the infinite loop rendering bug that occurs when the
    // initial value fails shallow equal on form rerender.
    // Issue on GitHub: https://github.com/final-form/react-final-form/issues/686
    const [memoedInitialValue] = useState(new Set(legacyAuthorities))

    return (
        <ReactFinalForm.Field
            {...props}
            component={LegacyAuthoritiesTableFF}
            initialValue={memoedInitialValue}
            legacyAuthorities={legacyAuthorities}
        />
    )
}

LegacyAuthoritiesTableField.propTypes = {
    legacyAuthorities: PropTypes.arrayOf(PropTypes.string.isRequired)
        .isRequired,
    name: PropTypes.string.isRequired,
}

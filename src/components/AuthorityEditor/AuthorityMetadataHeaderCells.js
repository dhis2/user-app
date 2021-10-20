import { CheckboxField, DataTableColumnHeader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const AuthorityMetadataHeaderCells = ({
    items,
    headers,
    selected,
    setSelected,
    disabled,
}) => {
    const isColumnSelected = columnIndex =>
        items.every(item => {
            const { selected, implicitlySelected, empty } =
                item.items[columnIndex]
            return selected || implicitlySelected || empty
        })
    const isColumnEmpty = columnIndex =>
        items.every(item => item.items[columnIndex].empty)
    const toggleColumn = ({ checked, value: columnIndex }) => {
        const authoritiesInColumn = items.map(
            item => item.items[columnIndex].id
        )
        if (checked) {
            setSelected(
                Array.from(new Set([...selected, ...authoritiesInColumn]))
            )
        } else {
            const authoritiesSet = new Set(authoritiesInColumn)
            const selectedWithoutItems = selected.filter(
                authId => !authoritiesSet.has(authId)
            )
            setSelected(selectedWithoutItems)
        }
    }

    return headers.map((header, index) => (
        <DataTableColumnHeader fixed top="0" key={header}>
            {index === 0 ? (
                header
            ) : (
                <CheckboxField
                    dense
                    label={header}
                    onChange={toggleColumn}
                    checked={
                        isColumnSelected(index - 1) && !isColumnEmpty(index - 1)
                    }
                    disabled={disabled || isColumnEmpty(index - 1)}
                    value={index - 1}
                />
            )}
        </DataTableColumnHeader>
    ))
}

// const AuthorityMetadataHeaderCells = ({
//     items,
//     headers,
//     selected,
//     setSelected,
//     disabled,
// }) => {
//     const columnSelection = headers.slice(1).map((_, headerIndex) => {
//         const allSelected = items.every(item => {
//             const { selected, implicitlySelected, empty } =
//                 item.items[headerIndex]
//             return selected || implicitlySelected || empty
//         })
//         const allEmpty = items.every(item => item.items[headerIndex].empty)
//         return { isSelected: allSelected, isEmpty: allEmpty }
//     })
//     const toggleColumn = ({ checked, value: columnIndex }) => {
//         const authoritiesInColumn = items.map(
//             item => item.items[columnIndex].id
//         )
//         if (checked) {
//             setSelected(
//                 Array.from(new Set([...selected, ...authoritiesInColumn]))
//             )
//         } else {
//             const authoritiesSet = new Set(authoritiesInColumn)
//             const selectedWithoutItems = selected.filter(
//                 authId => !authoritiesSet.has(authId)
//             )
//             setSelected(selectedWithoutItems)
//         }
//     }

//     return headers.map((header, index) => (
//         <DataTableColumnHeader fixed top="0" key={header}>
//             {index === 0 ? (
//                 header
//             ) : (
//                 <CheckboxField
//                     dense
//                     label={header}
//                     onChange={toggleColumn}
//                     checked={
//                         columnSelection[index - 1].allSelected &&
//                         !columnSelection[index - 1].allEmpty
//                     }
//                     disabled={disabled || columnSelection[index - 1].allEmpty}
//                     value={index}
//                 />
//             )}
//         </DataTableColumnHeader>
//     ))
// }

AuthorityMetadataHeaderCells.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    items: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    setSelected: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

export { AuthorityMetadataHeaderCells }

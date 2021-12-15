import i18n from '@dhis2/d2-i18n'
import {
    OrganisationUnitTree,
    getAllExpandedOrgUnitPaths,
    Button,
    ButtonStrip,
    Field,
} from '@dhis2/ui'
import cx from 'classnames'
import defer from 'lodash.defer'
import PropTypes from 'prop-types'
import React, { useState, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import api from '../../api'
import AsyncAutoComplete from './AsyncAutoComplete/index.js'
import getInitiallyExpandedUnits from './getInitiallyExpandedUnits.js'
import getInitiallySelectedUnits from './getInitiallySelectedUnits.js'
import getOrgUnitRoots from './getOrgUnitRoots.js'
import removeLastPathSegment from './removeLastPathSegment.js'
import styles from './SearchableOrgUnitTree.module.css'
import { useDeepMemo } from './useDeepMemo.js'

// Rendering an org unit tree can be expensive and this is particularly
// problematic in React Final Form forms due to the fact that they rerender on
// every input change
const MemoedOrganisationUnitTree = React.memo(OrganisationUnitTree)

/**
 * Renders a @dhis2/ui OrganisationUnitTree with an AsyncAutoComplete above it and a button strip below
 * This component will only show buttons if you pass it a confirmSelection (func) property
 * It has been made compliant with redux form
 */
const SearchableOrgUnitTree = ({
    className,
    orgUnitType,
    initiallySelected,
    confirmSelection,
    errorText,
    headerText,
    description,
    side,
    onBlur,
    onChange,
}) => {
    const roots = useSelector(({ currentUser }) =>
        getOrgUnitRoots(orgUnitType, currentUser)
    )

    const [selectedOrgUnits, setSelectedOrgUnits] = useState(() =>
        getInitiallySelectedUnits(initiallySelected)
    )

    const [expanded, setExpanded] = useState(() =>
        getInitiallyExpandedUnits(initiallySelected)
    )

    const handleExpand = useCallback(
        ({ path }) => {
            if (!expanded.includes(path)) {
                setExpanded([...expanded, path])
            }
        },
        [expanded, setExpanded]
    )

    const handleCollapse = useCallback(
        ({ path }) => {
            const pathIndex = expanded.indexOf(path)

            if (pathIndex !== -1) {
                const updatedExpanded =
                    pathIndex === 0
                        ? expanded.slice(1)
                        : [
                              ...expanded.slice(0, pathIndex),
                              ...expanded.slice(pathIndex + 1),
                          ]

                setExpanded(updatedExpanded)
            }
        },
        [expanded, setExpanded]
    )

    const update = useCallback(
        (nextOrgUnits, nextExpanded) => {
            if (onChange) {
                onChange(nextOrgUnits.map(unit => unit.id))
                // Also call onBlur if this is available. In a redux-form the component will be 'touched' by it
                onBlur && onBlur()
            }

            setSelectedOrgUnits(nextOrgUnits)

            if (nextExpanded) {
                setExpanded(nextExpanded)
            }
        },
        [onChange, onBlur, setSelectedOrgUnits, setExpanded]
    )

    const toggleSelectedOrgUnits = useCallback(
        ({ id, path, displayName }) => {
            const orgUnitIndex = selectedOrgUnits.findIndex(u => u.id === id)
            const nextOrgUnits =
                orgUnitIndex === -1
                    ? [...selectedOrgUnits, { id, path, displayName }]
                    : [
                          ...selectedOrgUnits.slice(0, orgUnitIndex),
                          ...selectedOrgUnits.slice(orgUnitIndex + 1),
                      ]

            update(nextOrgUnits)
        },
        [selectedOrgUnits, update]
    )

    const selectAndShowFilteredOrgUnit = orgUnit => {
        const nextOrgUnits = [...selectedOrgUnits, orgUnit]
        const nextExpanded = getAllExpandedOrgUnitPaths([
            ...expanded,
            removeLastPathSegment(orgUnit.path),
        ])

        update(nextOrgUnits, nextExpanded)
    }

    const applySelection = () => {
        confirmSelection(selectedOrgUnits)
    }

    const clearSelection = () => {
        update([])
        // TODO: see if we can get rid of defer
        defer(() => confirmSelection([]))
    }

    const rootIds = useDeepMemo(() => roots.map(({ id }) => id), [roots])
    const selectedOrgUnitPaths = useMemo(
        () => selectedOrgUnits.map(({ path }) => path),
        [selectedOrgUnits]
    )

    return (
        <div className={cx(styles.wrapper, styles[side], className)}>
            <Field error={!!errorText} validationText={errorText || ''}>
                {headerText && (
                    <div className={styles.header}>
                        <h4 className={styles.headerText}>{headerText}</h4>
                        {description && (
                            <p className={styles.headerDescription}>
                                {description}
                            </p>
                        )}
                    </div>
                )}
                <div className={styles.searchFilterWrapper}>
                    <AsyncAutoComplete
                        query={api.queryOrgUnits}
                        orgUnitType={orgUnitType}
                        selectHandler={selectAndShowFilteredOrgUnit}
                    />
                </div>
                <div className={styles.scrollBox}>
                    <MemoedOrganisationUnitTree
                        roots={rootIds}
                        onChange={toggleSelectedOrgUnits}
                        selected={selectedOrgUnitPaths}
                        expanded={expanded}
                        handleExpand={handleExpand}
                        handleCollapse={handleCollapse}
                    />
                </div>
            </Field>
            {confirmSelection && (
                <div className={styles.buttonStrip}>
                    <ButtonStrip>
                        <Button
                            primary={true}
                            onClick={applySelection}
                            disabled={!roots}
                            small
                        >
                            {i18n.t('Apply')}
                        </Button>
                        <Button
                            onClick={clearSelection}
                            disabled={!roots}
                            small
                        >
                            {i18n.t('Clear all')}
                        </Button>
                    </ButtonStrip>
                </div>
            )}
        </div>
    )
}

SearchableOrgUnitTree.propTypes = {
    initiallySelected: PropTypes.arrayOf(
        PropTypes.shape({
            displayName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
    orgUnitType: PropTypes.string.isRequired,
    className: PropTypes.string,
    confirmSelection: PropTypes.func,
    description: PropTypes.string,
    errorText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    headerText: PropTypes.node,
    side: PropTypes.oneOf(['left', 'right']),
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
}

export default SearchableOrgUnitTree

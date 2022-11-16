import i18n from '@dhis2/d2-i18n'
import {
    OrganisationUnitTree,
    getAllExpandedOrgUnitPaths,
    Button,
    ButtonStrip,
    IconErrorFilled24,
    theme,
} from '@dhis2/ui'
import cx from 'classnames'
import { defer } from 'lodash-es'
import PropTypes from 'prop-types'
import React, { useState, useCallback, useMemo } from 'react'
import { useCurrentUser } from '../../hooks/useCurrentUser.js'
import AsyncAutoComplete from './AsyncAutoComplete/index.js'
import getInitiallyExpandedUnits from './getInitiallyExpandedUnits.js'
import getInitiallySelectedUnits from './getInitiallySelectedUnits.js'
import getOrgUnitRoots from './getOrgUnitRoots.js'
import removeLastPathSegment from './removeLastPathSegment.js'
import styles from './SearchableOrgUnitTree.module.css'
import { useDeepMemo } from './useDeepMemo.js'

// Rendering an org unit tree can be expensive and this is particularly
// problematic in React Final Form forms due to the fact that they rerender on
// every input change, so we use React.memo and useCallback to ensure props are
// shallow equal on rerenders.
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
    headerText,
    description,
    error,
    onBlur,
    onChange,
}) => {
    const currentUser = useCurrentUser()
    const roots = getOrgUnitRoots(orgUnitType, currentUser)

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
                onChange(nextOrgUnits.map((unit) => unit.id))
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
            const orgUnitIndex = selectedOrgUnits.findIndex((u) => u.id === id)
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

    const selectAndShowFilteredOrgUnit = (orgUnit) => {
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
        <div className={styles.flexWrapper}>
            <div
                className={cx(styles.innerWrapper, className, {
                    [styles.error]: error,
                })}
            >
                <div>
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
                </div>
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
            {error && (
                <div className={styles.errorIcon}>
                    <IconErrorFilled24 color={theme.error} />
                </div>
            )}
        </div>
    )
}

SearchableOrgUnitTree.propTypes = {
    initiallySelected: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
            displayName: PropTypes.string,
        }).isRequired
    ).isRequired,
    orgUnitType: PropTypes.string.isRequired,
    className: PropTypes.string,
    confirmSelection: PropTypes.func,
    description: PropTypes.string,
    error: PropTypes.bool,
    headerText: PropTypes.node,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
}

export default SearchableOrgUnitTree

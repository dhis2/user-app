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
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../../api'
import AsyncAutoComplete from './AsyncAutoComplete/index.js'
import getInitiallyExpandedUnits from './getInitiallyExpandedUnits.js'
import getInitiallySelectedUnits from './getInitiallySelectedUnits.js'
import getOrgUnitRoots from './getOrgUnitRoots.js'
import removeLastPathSegment from './removeLastPathSegment.js'
import styles from './SearchableOrgUnitTree.module.css'

/**
 * Renders a @dhis2/ui OrganisationUnitTree with an AsyncAutoComplete above it and a button strip below
 * This component will only show buttons if you pass it a confirmSelection (func) property
 * It has been made compliant with redux form
 */
const SearchableOrgUnitTree = ({
    orgUnitType,
    initiallySelected,
    cancel,
    confirmSelection,
    errorText,
    headerText,
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

    const handleExpand = ({ path }) => {
        if (!expanded.includes(path)) {
            setExpanded([...expanded, path])
        }
    }

    const handleCollapse = ({ path }) => {
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
    }

    const update = (nextOrgUnits, nextExpanded) => {
        if (onChange) {
            onChange(nextOrgUnits.map(unit => unit.id))
            // Also call onBlur if this is available. In a redux-form the component will be 'touched' by it
            onBlur && onBlur()
        }

        setSelectedOrgUnits(nextOrgUnits)

        if (nextExpanded) {
            setExpanded(nextExpanded)
        }
    }

    const toggleSelectedOrgUnits = ({ id, path, displayName }) => {
        const orgUnitIndex = selectedOrgUnits.findIndex(u => u.id === id)
        const nextOrgUnits =
            orgUnitIndex === -1
                ? [...selectedOrgUnits, { id, path, displayName }]
                : [
                      ...selectedOrgUnits.slice(0, orgUnitIndex),
                      ...selectedOrgUnits.slice(orgUnitIndex + 1),
                  ]

        update(nextOrgUnits, [])
    }

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
        defer(() => confirmSelection(selectedOrgUnits))
    }

    return (
        <div className={cx(styles.wrapper, styles[side])}>
            <Field error={!!errorText} validationText={errorText || ''}>
                {headerText && <h4 className={styles.header}>{headerText}</h4>}
                <AsyncAutoComplete
                    query={api.queryOrgUnits}
                    orgUnitType={orgUnitType}
                    selectHandler={selectAndShowFilteredOrgUnit}
                />
                <div className={styles.scrollBox}>
                    <OrganisationUnitTree
                        roots={roots.map(({ id }) => id)}
                        onChange={toggleSelectedOrgUnits}
                        selected={selectedOrgUnits.map(({ path }) => path)}
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
                        >
                            {i18n.t('Apply')}
                        </Button>
                        <Button onClick={clearSelection} disabled={!roots}>
                            {i18n.t('Clear all')}
                        </Button>
                        <Button onClick={cancel}>{i18n.t('Cancel')}</Button>
                    </ButtonStrip>
                </div>
            )}
        </div>
    )
}

SearchableOrgUnitTree.propTypes = {
    initiallySelected: PropTypes.array.isRequired,
    orgUnitType: PropTypes.string.isRequired,
    cancel: PropTypes.func,
    confirmSelection: PropTypes.func,
    errorText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    headerText: PropTypes.string,
    side: PropTypes.oneOf(['left', 'right']),
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
}

export default SearchableOrgUnitTree

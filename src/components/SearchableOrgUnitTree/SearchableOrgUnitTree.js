import i18n from '@dhis2/d2-i18n'
import {
    OrganisationUnitTree,
    getAllExpandedOrgUnitPaths,
    Button,
    ButtonStrip,
    Field,
    Divider,
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
import classes from './SearchableOrgUnitTree.module.css'

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
    side,
    dense,
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

        update(nextOrgUnits)
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
        <div className={cx(classes.wrapper, classes[side], className)}>
            <Field error={!!errorText} validationText={errorText || ''}>
                {/* Without `display: grid`, AsyncAutoComplete takes up too much vertical space */}
                <div className={classes.grid}>
                    <div className={classes.header}>
                        {headerText && (
                            <h4 className={classes.headerText}>{headerText}</h4>
                        )}
                        <AsyncAutoComplete
                            query={api.queryOrgUnits}
                            orgUnitType={orgUnitType}
                            selectHandler={selectAndShowFilteredOrgUnit}
                            dense={dense}
                        />
                    </div>

                    <Divider margin="0" />

                    <div className={classes.scrollBox}>
                        <OrganisationUnitTree
                            roots={roots.map(({ id }) => id)}
                            onChange={toggleSelectedOrgUnits}
                            selected={selectedOrgUnits.map(({ path }) => path)}
                            expanded={expanded}
                            handleExpand={handleExpand}
                            handleCollapse={handleCollapse}
                        />
                    </div>
                </div>
            </Field>
            {confirmSelection && (
                <div className={classes.buttonStrip}>
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
    dense: PropTypes.bool,
    errorText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    headerText: PropTypes.string,
    side: PropTypes.oneOf(['left', 'right']),
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
}

export default SearchableOrgUnitTree

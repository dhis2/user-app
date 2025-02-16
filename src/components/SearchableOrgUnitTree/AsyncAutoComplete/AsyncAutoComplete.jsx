import i18n from '@dhis2/d2-i18n'
import { InputField, Menu, MenuItem, Popper, Layer, Card } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import styles from './AsyncAutoComplete.module.css'
import { PAGE_SIZE } from './constants.js'
import getRefineSearchLabel from './getRefineSearchLabel.js'
import getValidationText from './getValidationText.js'
import useOrgUnitSearchResults from './useOrgUnitSearchResults.js'

const AsyncAutoComplete = ({ selectHandler, orgUnitType }) => {
    const inputRef = useRef(null)
    const inputEl = inputRef.current?.querySelector('input')
    const [searchText, setSearchText] = useState('')
    const {
        clear,
        error,
        fetching,
        organisationUnits,
        totalSearchResultCount,
        waiting,
    } = useOrgUnitSearchResults({ searchText, orgUnitType })
    const validationText = getValidationText({
        error,
        fetching,
        organisationUnits,
        searchText,
        waiting,
    })
    const selectOrgUnit = (orgUnit) => {
        setSearchText('')
        clear()
        selectHandler(orgUnit)
    }
    const onBackdropClick = () => {
        setSearchText('')
        clear()
    }

    return (
        <>
            <div ref={inputRef}>
                <InputField
                    error={!!error}
                    loading={fetching}
                    onChange={({ value }) => setSearchText(value)}
                    placeholder={i18n.t('Search for an organisation unit')}
                    validationText={validationText}
                    value={searchText}
                    dense={true}
                />
            </div>

            {organisationUnits.length > 0 && (
                <Layer onBackdropClick={onBackdropClick}>
                    <Popper placement="bottom-start" reference={inputEl}>
                        <Card>
                            <div className={styles.scrollBox}>
                                <Menu dense>
                                    {organisationUnits.map((orgUnit) => (
                                        <MenuItem
                                            key={orgUnit.id}
                                            label={orgUnit.displayName}
                                            onClick={() =>
                                                selectOrgUnit(orgUnit)
                                            }
                                        />
                                    ))}
                                    {totalSearchResultCount > PAGE_SIZE && (
                                        <MenuItem
                                            className={
                                                styles.refineSearchWarning
                                            }
                                            disabled
                                            label={getRefineSearchLabel(
                                                totalSearchResultCount
                                            )}
                                        />
                                    )}
                                </Menu>
                            </div>
                        </Card>
                    </Popper>
                </Layer>
            )}
        </>
    )
}

AsyncAutoComplete.propTypes = {
    orgUnitType: PropTypes.string.isRequired,
    selectHandler: PropTypes.func.isRequired,
}

export default AsyncAutoComplete

import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import SearchableOrgUnitTree from '../../components/SearchableOrgUnitTree'
import { TEI_SEARCH_ORG_UNITS } from '../UserForm/config'
import styles from './OrganisationUnitFilter.module.css'
import { Select } from './select'
import { Input } from './single-select/input'

const formatList = items => {
    // Wrap Intl.ListFormat in try/catch as DHIS2 locales are not always ISO 639 compliant
    try {
        const formatter = new Intl.ListFormat(i18n.language, {
            style: 'long',
            type: 'conjunction',
        })
        return formatter.format(items)
    } catch (error) {
        return items.join(', ')
    }
}

const OrganisationUnitFilter = ({
    organisationUnits,
    onOrganisationUnitsChange,
}) => (
    <div className={styles.rootInput}>
        <Select
            input={
                <Input
                    prefix={i18n.t('Org.unit')}
                    value={formatList(
                        organisationUnits.map(({ displayName }) => displayName)
                    )}
                    valueClassName={styles.inputValue}
                />
            }
            menu={
                <SearchableOrgUnitTree
                    className={styles.orgUnitTree}
                    orgUnitType={TEI_SEARCH_ORG_UNITS}
                    initiallySelected={organisationUnits}
                    confirmSelection={onOrganisationUnitsChange}
                    dense
                />
            }
            maxHeight="350px"
            dense
        />
    </div>
)

OrganisationUnitFilter.propTypes = {
    organisationUnits: PropTypes.arrayOf(
        PropTypes.shape({
            displayName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
    onOrganisationUnitsChange: PropTypes.func.isRequired,
}

export default OrganisationUnitFilter

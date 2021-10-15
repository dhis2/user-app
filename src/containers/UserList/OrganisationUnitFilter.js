import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import SearchableOrgUnitTree from '../../components/SearchableOrgUnitTree'
import { TEI_SEARCH_ORG_UNITS } from '../UserForm/config'
import classes from './OrganisationUnitFilter.module.css'
import { Select } from './select'
import { Input } from './single-select/input'

const OrganisationUnitFilter = ({
    organisationUnits,
    onOrganisationUnitsChange,
}) => (
    <div className={classes.rootInput}>
        {/* TODO: support RTL languages */}
        <Select
            input={
                <Input
                    prefix={i18n.t('Org.unit')}
                    value={organisationUnits
                        .map(({ displayName }) => displayName)
                        .join(', ')}
                />
            }
            menu={
                <SearchableOrgUnitTree
                    className={classes.orgUnitTree}
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

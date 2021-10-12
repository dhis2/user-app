import i18n from '@dhis2/d2-i18n'
import React from 'react'
import OrganisationUnitFilter from './OrganisationUnitFilter'
import classes from './OrganisationUnitInput.module.css'
import { Select } from './select'
import { Input } from './single-select/input'

const OrganisationUnitInput = () => (
    <div className={classes.rootInput}>
        <Select
            input={<Input prefix={i18n.t('Org.unit')} />}
            menu={<OrganisationUnitFilter />}
            dense
        />
    </div>
)

export default OrganisationUnitInput

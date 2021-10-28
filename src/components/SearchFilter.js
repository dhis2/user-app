import i18n from '@dhis2/d2-i18n'
import { InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './SearchFilter.module.css'

/**
 * Generic search filter component that is used by the RoleList and the GroupList
 */
const SearchFilter = ({ value, onChange }) => (
    <InputField
        className={styles.input}
        placeholder={i18n.t('Search by name')}
        value={value}
        onChange={({ value }) => onChange(value)}
        dataTest="search-filter"
        dense
    />
)

SearchFilter.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default SearchFilter

import i18n from '@dhis2/d2-i18n'
import { InputField, CheckboxField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './AuthorityFilter.module.css'

/**
 * Renders a TextField and Checkbox above the AuthoritySections.
 * The actual filtering is being done in the FilteredAuthoritySections component which uses `utils/filterAuthorities`
 * However, this is done via the AuthorityEditor component
 */
const AuthorityFilter = ({
    filterString,
    filterSelectedOnly,
    setFilterString,
    setFilterSelectedOnly,
}) => (
    <div className={styles.container}>
        <InputField
            className={styles.input}
            label={i18n.t('Search')}
            onChange={({ value }) => setFilterString(value)}
            type="search"
            value={filterString}
        />
        <CheckboxField
            className={styles.checkbox}
            label={i18n.t('Selected authorities only')}
            checked={filterSelectedOnly}
            onChange={({ checked }) => setFilterSelectedOnly(checked)}
        />
    </div>
)

AuthorityFilter.propTypes = {
    filterSelectedOnly: PropTypes.bool.isRequired,
    filterString: PropTypes.string.isRequired,
    setFilterSelectedOnly: PropTypes.func.isRequired,
    setFilterString: PropTypes.func.isRequired,
}

export { AuthorityFilter }

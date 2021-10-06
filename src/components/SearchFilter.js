import i18n from '@dhis2/d2-i18n'
import { InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useDebouncedCallback } from 'use-debounce'
import { updateFilter, getList } from '../actions'
import { QUERY } from '../constants/filterFieldNames'
import styles from './SearchFilter.module.css'

/**
 * Generic search filter component that is used by the RoleList and the GroupList
 */
const SearchFilter = ({ entityType, getList, query, updateQuery }) => {
    const [localQueryStr, setLocalQueryStr] = useState(query)
    const updateSearchFilter = useDebouncedCallback(newValue => {
        updateQuery(newValue)
        getList(entityType)
    }, 375)

    const handleQueryChange = ({ value }) => {
        setLocalQueryStr(value)
        updateSearchFilter(value)
    }

    return (
        <InputField
            className={styles.input}
            placeholder={i18n.t('Search by name')}
            value={localQueryStr}
            onChange={handleQueryChange}
            dense
        />
    )
}

SearchFilter.propTypes = {
    entityType: PropTypes.string.isRequired,
    getList: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    updateQuery: PropTypes.func.isRequired,
}

const mapStateToProps = ({ filter }) => ({
    query: filter.query,
})

export default connect(mapStateToProps, {
    getList,
    updateQuery: newValue => updateFilter(QUERY, newValue),
})(SearchFilter)

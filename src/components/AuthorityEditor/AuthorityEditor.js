import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './AuthorityEditor.module.css'
import { AuthorityFilter } from './AuthorityFilter'
import { AuthorityTable } from './AuthorityTable'
import { METADATA } from './useAuthorities/constants'
import { useAuthorities } from './useAuthorities/index.js'

const AuthorityEditor = ({ initiallySelected, reduxFormOnChange }) => {
    const [selected, setSelected] = useState(initiallySelected)
    const [filterString, setFilterString] = useState('')
    const [filterSelectedOnly, setFilterSelectedOnly] = useState(false)
    const { loading, error, authorities, searchChunks } = useAuthorities({
        selected,
        filterString,
        filterSelectedOnly,
        reduxFormOnChange,
    })
    return (
        <div className={styles.container}>
            <AuthorityFilter
                filterString={filterString}
                filterSelectedOnly={filterSelectedOnly}
                setFilterString={setFilterString}
                setFilterSelectedOnly={setFilterSelectedOnly}
            />
            <div className={styles.tables}>
                {Object.entries(authorities).map(([key, authSection]) => (
                    <AuthorityTable
                        error={error}
                        headers={authSection.headers}
                        items={authSection.items}
                        key={key}
                        loading={loading}
                        metadata={authSection.id === METADATA}
                        name={authSection.name}
                        searchChunks={searchChunks}
                        selected={selected}
                        setSelected={setSelected}
                    />
                ))}
            </div>
        </div>
    )
}

AuthorityEditor.propTypes = {
    initiallySelected: PropTypes.array,
    reduxFormOnChange: PropTypes.func,
}

export { AuthorityEditor }

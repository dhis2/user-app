import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './AuthorityEditor.module.css'
import { AuthorityFilter } from './AuthorityFilter'
import { AuthorityTable } from './AuthorityTable'
import { AuthoritySelectionContext } from './useAuthorities/AuthoritySelectionContext'
import { METADATA } from './useAuthorities/constants'
import { useAuthorities } from './useAuthorities/index.js'

const AuthorityEditor = ({ initiallySelected, reduxFormOnChange }) => {
    const [filterString, setFilterString] = useState('')
    const [filterSelectedOnly, setFilterSelectedOnly] = useState(false)
    const {
        loading,
        error,
        authorities,
        searchChunks,
        authoritySelectionManager,
    } = useAuthorities({
        initiallySelected,
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
                <AuthoritySelectionContext.Provider
                    value={authoritySelectionManager}
                >
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
                        />
                    ))}
                </AuthoritySelectionContext.Provider>
            </div>
        </div>
    )
}

AuthorityEditor.propTypes = {
    initiallySelected: PropTypes.array,
    reduxFormOnChange: PropTypes.func,
}

export { AuthorityEditor }

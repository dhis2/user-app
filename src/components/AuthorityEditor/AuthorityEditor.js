import React, { Component } from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import './style.css'
import { Heading } from '@dhis2/d2-ui-core'
import makeTrashable from 'trashable'
import createHumanErrorMessage from '../../utils/createHumanErrorMessage'
import api from '../../api'
import AuthorityFilter from './AuthorityFilter'
import FilteredAuthoritySections from './FilteredAuthoritySections'
import { getEmptyGroupedAuthorities } from './utils/groupAuthorities'

/**
 * This is the parent component of the authorities section in the RoleForm.
 * It has been made compliant with redux-form.
 */
class AuthorityEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allGroupedAuthorities: getEmptyGroupedAuthorities(),
        }
        // This lookup may be updated without triggering re-renders
        this.selectedItemsLookup = props.initiallySelected.reduce(
            (lookup, item) => lookup.set(item, true),
            new Map()
        )
        this.groupedAuthoritiesPromise = null
    }

    getChildContext() {
        return {
            shouldSelect: this.shouldSelect,
            onAuthChange: this.onAuthChange,
            selectedItemsLookup: this.selectedItemsLookup,
        }
    }

    async componentDidMount() {
        this.groupedAuthoritiesPromise = makeTrashable(
            api.getGroupedAuthorities()
        )
        try {
            const allGroupedAuthorities = await this.groupedAuthoritiesPromise
            this.setState({ allGroupedAuthorities })
        } catch (error) {
            this.handleAuthorityFetchError(error)
        }
    }

    componentWillUnmount() {
        this.groupedAuthoritiesPromise.trash()
    }

    handleAuthorityFetchError(error) {
        const errorMsg = createHumanErrorMessage(
            error,
            i18n.t('There was a problem retreiving the available authorities.')
        )
        const allGroupedAuthorities = Object.keys(
            getEmptyGroupedAuthorities()
        ).reduce((total, key) => {
            total[key] = {
                ...getEmptyGroupedAuthorities()[key],
                items: errorMsg,
            }
            return total
        }, {})
        this.setState({ allGroupedAuthorities })
    }

    onFilterChange = (searchStr, selectedOnly) => {
        // Here we directly call a method on a child component instead of
        // letting state changes trigger full re-render. This is to prevent the TextField
        // from being blocked whilst typing.
        this.filteredAuthSections.updateFilter(searchStr, selectedOnly)
    }

    /**
     * Responds to checkbox changes for individual authorities and section headers. Will also notify redux-form Field components if onChange and onBlur handlers were passed
     * @param {Array<string>} ids - The IDs of the authorities that were toggled
     * @param {boolean} value - Checkbox was toggled to checked (true) or unchecked (false)
     * @method
     */
    onAuthChange = (ids, value) => {
        const { reduxFormOnChange } = this.props
        const authorityIds = []

        ids.forEach(id => {
            this.selectedItemsLookup.set(id, value)
        })

        this.selectedItemsLookup.forEach((value, key) => {
            if (value) {
                authorityIds.push(key)
            }
        })

        reduxFormOnChange && reduxFormOnChange(authorityIds)
    }

    shouldSelect = id => {
        return Boolean(this.selectedItemsLookup.get(id))
    }

    render() {
        const { allGroupedAuthorities } = this.state

        return (
            <div className="authority-editor">
                <Heading level={4} className="authority-editor__header">
                    {i18n.t('Authorities')}
                </Heading>
                <AuthorityFilter onFilterChange={this.onFilterChange} />
                <FilteredAuthoritySections
                    ref={comp => {
                        this.filteredAuthSections = comp
                    }}
                    allGroupedAuthorities={allGroupedAuthorities}
                />
            </div>
        )
    }
}

AuthorityEditor.propTypes = {
    initiallySelected: PropTypes.array,
    reduxFormOnChange: PropTypes.func,
}

AuthorityEditor.defaultProps = {
    initiallySelected: [],
}

AuthorityEditor.childContextTypes = {
    shouldSelect: PropTypes.func.isRequired,
    onAuthChange: PropTypes.func.isRequired,
    selectedItemsLookup: PropTypes.object.isRequired,
}

export default AuthorityEditor

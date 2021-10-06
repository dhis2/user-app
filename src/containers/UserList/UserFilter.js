import i18n from '@dhis2/d2-i18n'
import { CheckboxField, SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateFilter, getList } from '../../actions'
import SearchFilter from '../../components/SearchFilter'
import {
    INACTIVE_MONTHS,
    INVITATION_STATUS,
    SELF_REGISTERED,
} from '../../constants/filterFieldNames'
import OrganisationUnitInput from './OrganisationUnitInput'

/**
 * Renders a SearchFilter, OrganisationUnitInput, dropdowns for inactive months and invitation status, and a checkbox for self registration.
 * Controlled by the filter state and updates this on change.
 */
class UserFilter extends Component {
    onFilterChange = (fieldName, newValue) => {
        const { getList, entityType, updateFilter, filter } = this.props

        if (filter[fieldName] === newValue) {
            return
        }

        updateFilter(fieldName, newValue)
        getList(entityType)
    }

    renderInactiveMonthsFilter() {
        const options = Array(12)
            .fill()
            .map((_, index) => {
                const months = index + 1
                const displayName =
                    months === 1
                        ? i18n.t('1 month')
                        : i18n.t('{{months}} months', { months })
                return { months, displayName }
            })

        return (
            <SingleSelectField
                clearable
                label={i18n.t('Inactivity')}
                onChange={({ selected }) =>
                    this.onFilterChange(INACTIVE_MONTHS, selected)
                }
                selected={this.props.filter.inactiveMonths}
            >
                {options.map(({ months, displayName }) => (
                    <SingleSelectOption
                        key={months}
                        label={displayName}
                        value={String(months)}
                    />
                ))}
            </SingleSelectField>
        )
    }

    renderInvitationStatusFilter() {
        return (
            <SingleSelectField
                clearable
                label={i18n.t('Invitations')}
                onChange={({ selected }) =>
                    this.onFilterChange(INVITATION_STATUS, selected)
                }
                selected={this.props.filter.invitationStatus}
            >
                <SingleSelectOption
                    label={i18n.t('All invitations')}
                    value="all"
                />
                <SingleSelectOption
                    label={i18n.t('Expired invitations')}
                    value="expired"
                />
            </SingleSelectField>
        )
    }

    renderSelfRegisteredFilter() {
        return (
            <CheckboxField
                checked={this.props.filter.selfRegistered}
                onChange={({ checked }) =>
                    this.onFilterChange(SELF_REGISTERED, checked)
                }
                label={i18n.t('Self registrations')}
            />
        )
    }

    render() {
        const { entityType } = this.props
        return (
            <div>
                <SearchFilter entityType={entityType} />
                <OrganisationUnitInput />
                {this.renderInactiveMonthsFilter()}
                {this.renderInvitationStatusFilter()}
                {this.renderSelfRegisteredFilter()}
            </div>
        )
    }
}

UserFilter.propTypes = {
    entityType: PropTypes.string.isRequired,
    filter: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    updateFilter: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
    return {
        filter: state.filter,
    }
}

export default connect(mapStateToProps, {
    updateFilter,
    getList,
})(UserFilter)

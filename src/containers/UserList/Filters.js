import i18n from '@dhis2/d2-i18n'
import {
    InputField,
    CheckboxField,
    SingleSelectField,
    SingleSelectOption,
    Button,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './Filters.module.css'

const InactiveMonthsFilter = ({ inactiveMonths, onInactiveMonthsChange }) => {
    const options = Array(12)
        .fill()
        .map((_, index) => {
            const months = String(index + 1)
            const displayName =
                months === 1
                    ? i18n.t('1 month')
                    : i18n.t('{{months}} months', { months })
            return { displayName, months }
        })

    return (
        <SingleSelectField
            prefix={i18n.t('Time inactive')}
            selected={inactiveMonths}
            onChange={({ selected }) => onInactiveMonthsChange(selected)}
            className={styles.input}
            dense
        >
            {options.map(({ displayName, months }) => (
                <SingleSelectOption
                    key={months}
                    label={displayName}
                    value={months}
                />
            ))}
        </SingleSelectField>
    )
}

InactiveMonthsFilter.propTypes = {
    onInactiveMonthsChange: PropTypes.func.isRequired,
    inactiveMonths: PropTypes.string,
}

const Filters = ({
    query,
    onQueryChange,
    inactiveMonths,
    onInactiveMonthsChange,
    invitationStatus,
    onInvitationStatusChange,
    selfRegistered,
    onSelfRegisteredChange,
    onClear,
}) => (
    <div className={styles.container}>
        <InputField
            placeholder={i18n.t('Search by name')}
            value={query}
            onChange={({ value }) => onQueryChange(value)}
            className={styles.input}
            dense
        />
        {/* TODO: org unit selector */}
        <InactiveMonthsFilter
            inactiveMonths={inactiveMonths}
            onInactiveMonthsChange={onInactiveMonthsChange}
        />
        <SingleSelectField
            prefix={i18n.t('Invitation')}
            selected={invitationStatus}
            onChange={({ selected }) => onInvitationStatusChange(selected)}
            className={styles.input}
            dense
        >
            <SingleSelectOption label={i18n.t('All invitations')} value="all" />
            <SingleSelectOption
                label={i18n.t('Expired invitations')}
                value="expired"
            />
        </SingleSelectField>
        <CheckboxField
            label={i18n.t('Show self-registrations')}
            checked={selfRegistered}
            onChange={({ checked }) => onSelfRegisteredChange(checked)}
            className={styles.input}
            dense
        />
        <Button small onClick={onClear}>
            {i18n.t('Clear filters')}
        </Button>
    </div>
)

Filters.propTypes = {
    onClear: PropTypes.func.isRequired,
    onInactiveMonthsChange: PropTypes.func.isRequired,
    onInvitationStatusChange: PropTypes.func.isRequired,
    onQueryChange: PropTypes.func.isRequired,
    onSelfRegisteredChange: PropTypes.func.isRequired,
    inactiveMonths: PropTypes.string,
    invitationStatus: PropTypes.string,
    query: PropTypes.string,
    selfRegistered: PropTypes.bool,
}

export default Filters

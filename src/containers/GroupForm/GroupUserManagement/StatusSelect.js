import React from 'react'
import i18n from '@dhis2/d2-i18n'
import PropTypes from '@dhis2/prop-types'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

export const STATUS_ALL = 'ALL'
export const STATUS_MEMBER = 'MEMBER'
export const STATUS_NON_MEMBER = 'NON_MEMBER'

export default function StatusSelect({ onChange, value }) {
    const changeHandler = (_event, _key, value) => {
        onChange(value)
    }
    return (
        <SelectField
            value={value}
            onChange={changeHandler}
            floatingLabelText={i18n.t('Membership')}
        >
            <MenuItem
                key={STATUS_ALL}
                value={STATUS_ALL}
                primaryText={i18n.t('All users')}
            />
            <MenuItem
                key={STATUS_MEMBER}
                value={STATUS_MEMBER}
                primaryText={i18n.t('Group members')}
            />
            <MenuItem
                key={STATUS_NON_MEMBER}
                value={STATUS_NON_MEMBER}
                primaryText={i18n.t('Non members')}
            />
        </SelectField>
    )
}
StatusSelect.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
}

import React, { useState, useRef, useEffect } from 'react'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { TextField } from 'material-ui'

export default function SearchInput({ callback }) {
    const [value, setValue] = useState('')
    const onChange = event => setValue(event.target.value)
    const debounced = useRef(debounce(newValue => callback(newValue), 400))

    useEffect(() => debounced.current(value), [value])

    return (
        <TextField
            value={value}
            onChange={onChange}
            floatingLabelText={i18n.t('Search users')}
            type="search"
            style={{ marginRight: 16 }}
        />
    )
}
SearchInput.propTypes = {
    callback: PropTypes.func,
}

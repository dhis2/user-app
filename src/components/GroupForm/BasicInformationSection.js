import i18n from '@dhis2/d2-i18n'
import {
    composeValidators,
    hasValue,
    createMaxCharacterLength,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { FormSection, TextField } from '../Form.js'
import {
    useDebouncedUniqueGroupNameValidator,
    useDebouncedUniqueGroupCodeValidator,
} from './validators.js'

const codeLengthValidator = createMaxCharacterLength(50)

const BasicInformationSection = React.memo(({ group }) => {
    const debouncedUniqueGroupNameValidator =
        useDebouncedUniqueGroupNameValidator({ groupName: group?.name })
    const debouncedUniqueGroupCodeValidator =
        useDebouncedUniqueGroupCodeValidator({ groupCode: group?.code })

    return (
        <FormSection title={i18n.t('Basic information')}>
            <TextField
                required
                name="name"
                label={i18n.t('Name')}
                initialValue={group?.name}
                validate={composeValidators(
                    hasValue,
                    debouncedUniqueGroupNameValidator
                )}
            />
            <TextField
                name="code"
                label={i18n.t('Code')}
                helpText={i18n.t('Used in analytics reports.')}
                initialValue={group?.code}
                validate={composeValidators(
                    codeLengthValidator,
                    debouncedUniqueGroupCodeValidator
                )}
            />
        </FormSection>
    )
})

BasicInformationSection.propTypes = {
    group: PropTypes.object,
}

export default BasicInformationSection

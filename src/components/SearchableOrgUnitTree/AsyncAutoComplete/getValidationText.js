import i18n from '@dhis2/d2-i18n'
import createHumanErrorMessage from '../../../utils/createHumanErrorMessage'
import { MIN_CHAR_LENGTH } from './constants.js'

const getValidationText = ({ searchText, organisationUnits, error }) => {
    if (error) {
        console.error(error)
        return createHumanErrorMessage(
            error,
            i18n.t('There was a problem retreiving your search results')
        )
    }

    if (searchText.length > 0 && searchText.length < MIN_CHAR_LENGTH) {
        return i18n.t('Please enter at least {{ minCharLength }} characters', {
            minCharLength: MIN_CHAR_LENGTH,
        })
    }

    if (organisationUnits.length === 0) {
        return i18n.t('No matches found')
    }

    return ''
}

export default getValidationText

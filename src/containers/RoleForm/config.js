import i18n from '@dhis2/d2-i18n'
import {
    renderTextField,
    renderAuthorityEditor,
} from '../../utils/fieldRenderers'

export const NAME = 'name'
export const DESCRIPTION = 'description'
export const AUTHORITIES = 'authorities'

export const ROLE_PROPS = [NAME, DESCRIPTION, AUTHORITIES]

export const getFields = () => [
    {
        name: NAME,
        label: i18n.t('Name'),
        fieldRenderer: renderTextField,
        isRequiredField: true,
    },
    {
        name: DESCRIPTION,
        label: i18n.t('Description'),
        fieldRenderer: renderTextField,
    },
    {
        name: AUTHORITIES,
        label: i18n.t('Authorities'),
        fieldRenderer: renderAuthorityEditor,
    },
]

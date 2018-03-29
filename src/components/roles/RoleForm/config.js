import { renderTextField, renderAuthorityEditor } from '../../../utils/fieldRenderers';

export const NAME = 'name';
export const DESCRIPTION = 'description';
export const AUTHORITIES = 'authorities';

export const ROLE_PROPS = [NAME, DESCRIPTION, AUTHORITIES];

export const FIELDS = [
    {
        name: NAME,
        label: 'Name',
        fieldRenderer: renderTextField,
        isRequiredField: true,
    },
    {
        name: DESCRIPTION,
        label: 'Description',
        fieldRenderer: renderTextField,
    },
    {
        name: AUTHORITIES,
        label: 'Authorities',
        fieldRenderer: renderAuthorityEditor,
    },
];

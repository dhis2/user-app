import SelectField from 'd2-ui/lib/form-fields/DropDown.component';
import TextField from 'd2-ui/lib/form-fields/TextField';
import CheckBox from 'd2-ui/lib/form-fields/CheckBox.component';

const style = {
    float: 'left',
    marginRight: '1rem',
};

// TODO: Translate these babies

export const QUERY = {
    name: 'query',
    value: '',
    component: TextField,
    type: 'search',
    props: {
        floatingLabelText: 'Search by name',
        style: { ...style, width: '256px' },
        hintText: '',
        type: 'search',
    },
};

export const INACTIVE_MONTHS = {
    name: 'inactiveMonths',
    value: null,
    component: SelectField,
    props: {
        menuItems: [
            { id: 1, displayName: '1 month' },
            { id: 2, displayName: '2 months' },
            { id: 3, displayName: '3 months' },
            { id: 4, displayName: '4 months' },
            { id: 5, displayName: '5 months' },
            { id: 6, displayName: '6 months' },
            { id: 7, displayName: '7 months' },
            { id: 8, displayName: '8 months' },
            { id: 9, displayName: '9 months' },
            { id: 10, displayName: '10 months' },
            { id: 11, displayName: '11 months' },
            { id: 12, displayName: '12 months' },
        ],
        includeEmpty: true,
        emptyLabel: '<No value>',
        floatingLabelText: 'Show by inactivity',
        style: { ...style, width: '172px' },
    },
};

export const INVITATION_STATUS = {
    name: 'invitationStatus',
    value: null,
    component: SelectField,
    props: {
        menuItems: [
            { id: 'all', displayName: 'All invitations' },
            { id: 'expired', displayName: 'Expired invitations' },
        ],
        includeEmpty: true,
        emptyLabel: '<No value>',
        floatingLabelText: 'Show invitations',
        style: { ...style, width: '172px' },
    },
};

export const SELF_REGISTERED = {
    name: 'selfRegistered',
    value: false,
    component: CheckBox,
    props: {
        label: 'Show self registrations',
        className: 'data-table__filter-bar__checkbox',
        style: {
            ...style,
            display: 'inline-block',
            float: 'left',
            width: '222px',
            paddingTop: '37px',
            height: '35px',
            marginBottom: '24px', // Give some padding to the last filter element to create space for the table
        },
        wrapperStyle: {
            marginTop: 0,
            marginBottom: 0,
        },
    },
};

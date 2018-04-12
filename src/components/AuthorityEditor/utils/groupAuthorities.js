import _ from '../../../constants/lodash';

/**
 * This module receives an array of authorities and returns and object that is grouped into
 * logical sections. This is done in a semi dynamic way by using pre- and suffixes in tandem
 * with hard-coded group definitions
 * @param {array} allAuths the key-value list of authorities that will be transformed
 * @param {Object[]} allAuth - The allAuth who are responsible for the project.
 * @param {string} allAuth[].id - The name of an employee.
 * @param {string} allAuth[].name - The employee's department.
 */

// The target object to which the allAuths array will be mapped
// Exported so it can be used by the AuthorityEditor component
export const EMPTY_GROUPED_AUTHORITIES = {
    metadata: {
        name: 'Meta data',
        items: null,
        headers: [
            'Name',
            'Add/Update Public',
            'Add/Update Private',
            'Delete',
            'External access',
        ],
    },
    apps: {
        name: 'Apps',
        items: null,
        headers: ['Name'],
    },
    actions: {
        name: 'Actions',
        items: null,
        headers: ['Name'],
    },
};
export const PUBLIC_ADD_SUFFIX = '_PUBLIC_ADD';
export const PRIVATE_ADD_SUFFIX = '_PRIVATE_ADD';

const DELETE_SUFFIX = '_DELETE';
const EXTERNAL_ACCESS_SUFFIX = '_EXTERNAL';
const APP_AUTH_PREFIX = 'M_';
const MD_SUFFIXES = [PUBLIC_ADD_SUFFIX, PRIVATE_ADD_SUFFIX, DELETE_SUFFIX];
const ID_SUFFIXES = ['_ADD', DELETE_SUFFIX];
const ALL_SUFFIXES = [...MD_SUFFIXES, ...ID_SUFFIXES, EXTERNAL_ACCESS_SUFFIX];

const AUTHS_WITH_IMPLICIT_ADD_PRIVATE_AND_DELETE = {
    F_CHART_PUBLIC_ADD: true,
    F_DASHBOARD_PUBLIC_ADD: true,
    F_EVENTCHART_PUBLIC_ADD: true,
    F_EVENTREPORT_PUBLIC_ADD: true,
    F_MAP_PUBLIC_ADD: true,
    F_REPORTTABLE_PUBLIC_ADD: true,
};

const EMPTY_GROUP_ITEM = {
    name: '**EMPTY CELL**',
    id: null,
    empty: true,
};

const IMPLICIT_OPTION = {
    implicit: true,
    name: `**CHECKED AND DISABLED**`,
};

const hasNoSuffix = auth => {
    return !ALL_SUFFIXES.some(suffix => _.endsWith(auth.id, suffix));
};

const createGroup = (auth, suffixes, lookup) => {
    if (!lookup[auth.id]) {
        return null;
    }
    const metaDataSuffix = suffixes.find(suffix => _.endsWith(auth.id, suffix));
    if (!metaDataSuffix) {
        return null;
    }

    const baseName = auth.id.replace(metaDataSuffix, '');
    const hasAllSuffixes = suffixes.every(suffix =>
        Boolean(lookup[baseName + suffix])
    );
    if (!hasAllSuffixes) {
        return null;
    }

    let group = {
        name: lookup[baseName + DELETE_SUFFIX].name.replace('Delete ', ''),
        items: [],
    };
    suffixes.forEach(suffix => {
        const currAuth = lookup[baseName + suffix];
        group.items.push(currAuth);
        if (currAuth.id === 'F_CHART_EXTERNAL') {
            console.log('deleting your friend');
        }
        delete lookup[currAuth.id];
    });

    if (suffixes === ID_SUFFIXES) {
        group.items.splice(1, 0, EMPTY_GROUP_ITEM);
    }

    appendExternalAccessGroup(group, baseName, lookup);

    return group;
};

const processExeption = (auth, grouped, lookup) => {
    if (AUTHS_WITH_IMPLICIT_ADD_PRIVATE_AND_DELETE[auth.id]) {
        const baseName = auth.id.replace(PUBLIC_ADD_SUFFIX, '');
        const group = {
            name: auth.name.replace('Add/Update Public ', ''),
            items: [auth, IMPLICIT_OPTION, IMPLICIT_OPTION],
        };
        appendExternalAccessGroup(group, baseName, lookup);
        grouped.metadata.items.push(group);
        delete lookup[auth.id];
    } else if (!_.endsWith(auth.id, EXTERNAL_ACCESS_SUFFIX)) {
        grouped.actions.items.push(auth);
        delete lookup[auth.id];
    }
};

const appendExternalAccessGroup = (group, baseName, lookup, test) => {
    const authName = baseName + EXTERNAL_ACCESS_SUFFIX;
    const auth = lookup[authName] || EMPTY_GROUP_ITEM;
    group.items.push(auth);
    if (!auth.empty) {
        delete lookup[authName];
    }
};

const groupAuthorities = authorities => {
    const base = Object.keys(EMPTY_GROUPED_AUTHORITIES).reduce(
        (groupedBase, key) => {
            groupedBase[key] = { ...EMPTY_GROUPED_AUTHORITIES[key], items: [] };
            return groupedBase;
        },
        {}
    );
    const allLookup = authorities.reduce((lookup, auth) => {
        lookup[auth.id] = auth;
        return lookup;
    }, {});

    console.log(
        'Bestaat ie hier nog? ',
        JSON.stringify(allLookup['F_CHART_EXTERNAL'])
    );

    return authorities.reduce((grouped, auth) => {
        if (_.startsWith(auth.id, APP_AUTH_PREFIX)) {
            grouped.apps.items.push(auth);
            if (auth.id === 'F_CHART_EXTERNAL') {
                console.log('deleting your friend');
            }
            delete allLookup[auth.id];
        } else if (hasNoSuffix(auth)) {
            grouped.actions.items.push(auth);
            if (auth.id === 'F_CHART_EXTERNAL') {
                console.log('deleting your friend');
            }
            delete allLookup[auth.id];
        } else {
            const mGroup = createGroup(auth, MD_SUFFIXES, allLookup);
            const iGroup = !mGroup && createGroup(auth, ID_SUFFIXES, allLookup);

            if (mGroup || iGroup) {
                grouped.metadata.items.push(mGroup || iGroup);
            } else if (allLookup[auth.id]) {
                processExeption(auth, grouped, allLookup);
            }
        }
        return grouped;
    }, base);
};

export default groupAuthorities;

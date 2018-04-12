import _ from '../../../constants/lodash';

const DELETE_SUFFIX = '_DELETE';
export const PUBLIC_ADD_SUFFIX = '_PUBLIC_ADD';
export const PRIVATE_ADD_SUFFIX = '_PRIVATE_ADD';
const APP_AUTH_PREFIX = 'M_';
const MD_SUFFIXES = [PUBLIC_ADD_SUFFIX, PRIVATE_ADD_SUFFIX, DELETE_SUFFIX];
const ID_SUFFIXES = ['_ADD', DELETE_SUFFIX];
const ALL_SUFFIXES = [...MD_SUFFIXES, ...ID_SUFFIXES];

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

export const EMPTY_GROUPED_AUTHORITIES = {
    metadata: {
        name: 'Meta data',
        items: null,
        headers: ['Name', 'Add/Update Public', 'Add/Update Private', 'Delete'],
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
        delete lookup[currAuth.id];
    });

    if (suffixes === ID_SUFFIXES) {
        group.items.splice(1, 0, EMPTY_GROUP_ITEM);
    }

    return group;
};

const processExeption = (auth, grouped, lookup) => {
    if (AUTHS_WITH_IMPLICIT_ADD_PRIVATE_AND_DELETE[auth.id]) {
        const implicitOption = {
            implicit: true,
            name: `**CHECKED AND DISABLED**`,
        };
        const group = {
            name: auth.name.replace('Add/Update Public ', ''),
            items: [auth, implicitOption, implicitOption],
        };
        grouped.metadata.items.push(group);
    } else {
        grouped.actions.items.push(auth);
    }
    delete lookup[auth.id];
};

const groupAuthorities = allAuths => {
    const base = Object.keys(EMPTY_GROUPED_AUTHORITIES).reduce(
        (groupedBase, key) => {
            groupedBase[key] = { ...EMPTY_GROUPED_AUTHORITIES[key], items: [] };
            return groupedBase;
        },
        {}
    );
    const allLookup = allAuths.reduce((lookup, auth) => {
        lookup[auth.id] = auth;
        return lookup;
    }, {});

    return allAuths.reduce((grouped, auth) => {
        if (_.startsWith(auth.id, APP_AUTH_PREFIX)) {
            grouped.apps.items.push(auth);
            delete allLookup[auth.id];
        } else if (hasNoSuffix(auth)) {
            grouped.actions.items.push(auth);
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

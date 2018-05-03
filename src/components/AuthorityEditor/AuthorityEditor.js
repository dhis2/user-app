import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import './style.css';
import Heading from 'd2-ui/lib/headings/Heading.component';
import makeTrashable from 'trashable';

import api from '../../api';
import AuthorityFilter from './AuthorityFilter';
import FilteredAuthoritySections from './FilteredAuthoritySections';
import { EMPTY_GROUPED_AUTHORITIES } from './utils/groupAuthorities';

/**
 * This is the parent component of the authorities section in the RoleForm.
 * It has been made compliant with REDUX-form.
 */
class AuthorityEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allGroupedAuthorities: EMPTY_GROUPED_AUTHORITIES,
        };
        // This lookup may be updated without triggering re-renders
        this.selectedItemsLookup = props.initiallySelected.reduce(
            (lookup, item) => lookup.set(item, true),
            new Map()
        );
        this.groupedAuthoritiesPromise = null;
    }

    getChildContext() {
        return {
            shouldSelect: this.shouldSelect,
            onAuthChange: this.onAuthChange,
            selectedItemsLookup: this.selectedItemsLookup,
        };
    }

    async componentDidMount() {
        this.groupedAuthoritiesPromise = makeTrashable(api.getGroupedAuthorities());
        try {
            const allGroupedAuthorities = await this.groupedAuthoritiesPromise;
            this.setState({ allGroupedAuthorities: allGroupedAuthorities });
        } catch (error) {
            console.error(error);
        }
    }

    componentWillUnmount() {
        this.groupedAuthoritiesPromise.trash();
    }

    getChangedProperties(newObject, oldObject) {
        return Object.keys(newObject).reduce((changes, key) => {
            if (newObject[key] !== oldObject[key]) {
                changes.push(key);
            }
            return changes;
        }, []);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const propChanges = this.getChangedProperties(nextProps, this.props);
        const stateChanges = this.getChangedProperties(nextState, this.state);
        const allChanges = [...propChanges, ...stateChanges];

        return allChanges.length > 0 && allChanges.includes('allGroupedAuthorities');
    }

    onFilterChange = (searchStr, selectedOnly) => {
        // Here we directly call a method on a child component instead of
        // letting state changes trigger full re-render. This is to prevent the TextField
        // from being blocked whilst typing.
        this.filteredAuthSections.updateFilter(searchStr, selectedOnly);
    };

    /**
     * Responds to checkbox changes. Will also notify redux-form Field components if onChange and onBlur handlers were passed
     * @param {string} id - The ID of the authority that was toggled
     * @param {boolean} value - Checkbox was toggled to checked (true) or unchecked (false)
     * @method
     */
    onAuthChange = (id, value) => {
        const { reduxFormOnBlur, reduxFormOnChange } = this.props;
        let authorityIds = [];

        this.selectedItemsLookup.set(id, value);

        this.selectedItemsLookup.forEach((value, key) => {
            if (value) {
                authorityIds.push(key);
            }
        });
        reduxFormOnChange && reduxFormOnChange(authorityIds);
        reduxFormOnBlur && reduxFormOnBlur();
    };

    shouldSelect = id => {
        return Boolean(this.selectedItemsLookup.get(id));
    };

    render() {
        const { allGroupedAuthorities } = this.state;

        return (
            <div className="authority-editor">
                <Heading level={4} className="authority-editor__header">
                    {i18n.t('Authorities')}
                </Heading>
                <AuthorityFilter onFilterChange={this.onFilterChange} />
                <FilteredAuthoritySections
                    ref={comp => {
                        this.filteredAuthSections = comp;
                    }}
                    allGroupedAuthorities={allGroupedAuthorities}
                />
            </div>
        );
    }
}

AuthorityEditor.propTypes = {
    initiallySelected: PropTypes.array,
    reduxFormOnChange: PropTypes.func,
    reduxFormOnBlur: PropTypes.func,
};

AuthorityEditor.defaultProps = {
    initiallySelected: [],
};

AuthorityEditor.childContextTypes = {
    shouldSelect: PropTypes.func.isRequired,
    onAuthChange: PropTypes.func.isRequired,
    selectedItemsLookup: PropTypes.object.isRequired,
};

export default AuthorityEditor;

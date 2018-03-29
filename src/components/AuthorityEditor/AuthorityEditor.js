import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import './style.css';
import api from '../../api';
import Heading from 'd2-ui/lib/headings/Heading.component';

import AuthorityFilter from './AuthorityFilter';
import FilteredAuthoritySections from './FilteredAuthoritySections';
import { EMPTY_GROUPED_AUTHORITIES } from './utils/groupAuthorities';

// TODO: Remove once grouping is final
const renderCopyPasteOutput = false;
const keysInCopyPasteOutput = false;

class AuthorityEditor extends Component {
    static propTypes = {
        initiallySelected: PropTypes.array,
        reduxFormOnChange: PropTypes.func,
        reduxFormOnBlur: PropTypes.func,
    };

    static defaultProps = {
        initiallySelected: [],
    };

    static childContextTypes = {
        shouldSelect: PropTypes.func.isRequired,
        onAuthChange: PropTypes.func.isRequired,
        selectedItemsLookup: PropTypes.object.isRequired,
    };

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
    }

    getChildContext = () => ({
        shouldSelect: this.shouldSelect,
        onAuthChange: this.onAuthChange,
        selectedItemsLookup: this.selectedItemsLookup,
    });

    componentDidMount() {
        api.getGroupedAuthorities().then(allGroupedAuthorities => {
            this.setState({ allGroupedAuthorities: allGroupedAuthorities });
        });
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

        return !(allChanges.length === 1 && allChanges[0] === 'initiallySelected');
    }

    onFilterChange = (searchStr, selectedOnly) => {
        // Here we directly call a method on a child component instead of
        // letting state changes trigger full rerender. This is to prevent the TextField
        // from being blocked whilst typing.
        this.filteredAuthSections.updateFilter(searchStr, selectedOnly);
    };

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

    // TODO: Remove once grouping is final
    renderCopyPasteOutput(filteredAuthorities) {
        return Object.keys(filteredAuthorities).map(key => {
            const authGroup = filteredAuthorities[key];
            return (
                <div key={key}>
                    <h1>{authGroup.name}</h1>
                    <table>
                        <tbody>
                            {authGroup.items.map((item, index) => (
                                <tr key={`row-${index}`}>
                                    {item.items ? (
                                        item.items.map(({ id, name }, index) => (
                                            <td key={`cell-${index}`}>
                                                {keysInCopyPasteOutput
                                                    ? `${id} | ${name}`
                                                    : name}
                                            </td>
                                        ))
                                    ) : (
                                        <td>
                                            {keysInCopyPasteOutput
                                                ? `${item.id} | ${item.name}`
                                                : item.name}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        });
    }

    render() {
        const { allGroupedAuthorities } = this.state;
        if (renderCopyPasteOutput && allGroupedAuthorities) {
            return this.renderCopyPasteOutput(allGroupedAuthorities);
        }
        return (
            <div className="authority-editor">
                <Heading level={4} className="authority-editor__header">
                    {i18next.t('Authorities')}
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

export default AuthorityEditor;

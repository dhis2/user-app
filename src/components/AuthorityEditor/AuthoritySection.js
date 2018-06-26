import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper, CircularProgress } from 'material-ui';
import i18n from '@dhis2/d2-i18n';
import Heading from 'd2-ui/lib/headings/Heading.component';
import AuthorityGroup from './AuthorityGroup';
import AuthorityItem from './AuthorityItem';

const FLUSH_COUNT = 7;
const FLUSH_INTERVAL = 10;

/**
 * Renders a logical authority section. Within the section it can either render rows with `AuthorityGroups` for metadata,
 * or `AuthorityItems` for other types of authorities. This component renders a lot MUI checkboxes which would cause the UI to hang
 * if they were all rendered in one cycle. To prevent this UI lag, it uses batched rendering.
 */
class AuthoritySection extends Component {
    constructor(props) {
        super(props);
        this.state = { renderedItems: null };
        this.appendInterval = null;
    }

    componentWillReceiveProps(newProps) {
        if (newProps.authSection.items.length) {
            this.setState({ renderedItems: null });
            this.createBatchedRenderInterval(newProps.authSection.items);
        }
    }

    componentWillUnmount() {
        clearInterval(this.appendInterval);
    }

    /**
     * Will receives a (long) array of authorities and gradually populates the state.renderedItems with these.
     * By decreasing the `FLUSH_COUNT` and/or increasing the `FLUSH_INTERVAL` the rendering will become slower but the UI will be more responsive.
     * @param {Array} items - The authorities to render
     */
    createBatchedRenderInterval(items) {
        let currSliceEnd = 0;
        this.appendInterval = setInterval(() => {
            const currItems = this.state.renderedItems || [];
            const reachedEnd = currSliceEnd + FLUSH_COUNT > items.length;
            const sliceEnd = reachedEnd ? items.length : currSliceEnd + FLUSH_COUNT;
            const newItems = items.slice(currSliceEnd, sliceEnd);
            const renderedItems = [...currItems, ...newItems];

            currSliceEnd = sliceEnd;

            if (renderedItems.length === items.length) {
                clearInterval(this.appendInterval);
            }

            this.setState({ renderedItems });
        }, FLUSH_INTERVAL);
    }

    renderAuthRow = (authSubject, index) => {
        const { shouldSelect, onAuthChange } = this.context;
        return (
            <tr key={`row-${index}`}>
                {authSubject.items ? (
                    <AuthorityGroup items={authSubject.items} name={authSubject.name} />
                ) : (
                    <AuthorityItem
                        authSubject={authSubject}
                        withLabel={true}
                        selected={shouldSelect(authSubject.id)}
                        onCheckedCallBack={onAuthChange}
                    />
                )}
            </tr>
        );
    };

    renderLoaderRow() {
        return (
            <tr>
                <td className="authority-editor__placeholder-cell">
                    <CircularProgress size={24} />
                </td>
            </tr>
        );
    }

    renderInfoRow(errorMsg) {
        let className = 'authority-editor__placeholder-cell';
        let msg = i18n.t('No matches found');

        if (errorMsg) {
            className += '--error';
            msg = errorMsg;
        }

        return (
            <tr>
                <td className={className}>{msg}</td>
            </tr>
        );
    }

    renderContent(authSection) {
        const { renderedItems } = this.state;
        if (!authSection.items || !renderedItems) {
            return this.renderLoaderRow();
        }

        if (typeof authSection.items === 'string') {
            return this.renderInfoRow(authSection.items);
        }

        if (authSection.items.length === 0) {
            return this.renderInfoRow();
        }

        return this.state.renderedItems.map(this.renderAuthRow);
    }

    renderTableHead({ headers }) {
        return (
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={`header-${index}`}>{header}</th>
                    ))}
                </tr>
            </thead>
        );
    }

    render() {
        const { sectionKey, authSection } = this.props;
        let wrapperClassName = `authority-editor__auth-group ${sectionKey}`;
        if (authSection.items && authSection.items.length > 11) {
            wrapperClassName += ' scrollable';
        }

        let tableClassName = 'authority-editor__auth-group-table';
        tableClassName += ` columns-${authSection.headers.length}`;

        return (
            <Paper className={wrapperClassName}>
                <Heading level={6} className="authority-editor__auth-group-header">
                    {authSection.name}
                </Heading>
                <table className={tableClassName}>
                    {this.renderTableHead(authSection)}
                    <tbody>{this.renderContent(authSection)}</tbody>
                </table>
            </Paper>
        );
    }
}

AuthoritySection.propTypes = {
    sectionKey: PropTypes.string.isRequired,
    authSection: PropTypes.object.isRequired,
};

AuthoritySection.contextTypes = {
    shouldSelect: PropTypes.func.isRequired,
    onAuthChange: PropTypes.func.isRequired,
};

export default AuthoritySection;

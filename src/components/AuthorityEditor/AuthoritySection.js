import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper, CircularProgress } from 'material-ui';
import i18n from 'd2-i18n';
import Heading from 'd2-ui/lib/headings/Heading.component';
import AuthorityGroup from './AuthorityGroup';
import AuthorityItem from './AuthorityItem';

const FLUSH_COUNT = 300;
const FLUSH_INTERVAL = 1;

// This component used to cause the page to hang whilst it was rendering
// a long list of MUI Checkboxes. To prevent this we have switched to batched rendering
// which makes the component a little more complicated but it renders a lot better.
class AuthoritySection extends Component {
    constructor(props) {
        super(props);
        this.state = { renderedItems: null };
        this.appendInterval = null;
    }

    componentWillReceiveProps(newProps) {
        if (newProps.authSection.items.length) {
            this.setState({ renderedItems: null });
            this.createBatchedRenderInterval(newProps);
        }
    }

    componentWillUnmount() {
        clearInterval(this.appendInterval);
    }

    createBatchedRenderInterval(props) {
        const items = props.authSection.items;
        let currSliceEnd = 0;
        this.appendInterval = setInterval(() => {
            const currItems = this.state.renderedItems || [];
            const reachedEnd = currSliceEnd + FLUSH_COUNT > items.length;
            const sliceEnd = reachedEnd
                ? items.length
                : currSliceEnd + FLUSH_COUNT;
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
                    <AuthorityGroup
                        items={authSubject.items}
                        name={authSubject.name}
                    />
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
                    <CircularProgress size={36} />
                </td>
            </tr>
        );
    }

    renderNoResultsRow() {
        return (
            <tr>
                <td className="authority-editor__placeholder-cell">
                    {i18n.t('No matches found')}
                </td>
            </tr>
        );
    }

    renderContent(authSection) {
        const { renderedItems } = this.state;
        if (!authSection.items || !renderedItems) {
            return this.renderLoaderRow();
        }

        if (authSection.items.length === 0) {
            return this.renderNoResultsRow();
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
        let tableClassName = 'authority-editor__auth-group-table';
        tableClassName += ` columns-${authSection.headers.length}`;

        return (
            <Paper className={`authority-editor__auth-group ${sectionKey}`}>
                <Heading
                    level={6}
                    className="authority-editor__auth-group-header"
                >
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

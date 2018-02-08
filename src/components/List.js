import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import Pagination from 'd2-ui/lib/pagination/Pagination.component';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import Heading from 'd2-ui/lib/headings/Heading.component';
import 'd2-ui/lib/css/DataTable.css';
import 'd2-ui/lib/css/Pagination.css';
import { incrementPage, decrementPage } from '../actions';
import ErrorMessage from './ErrorMessage';

const styles = {
    dataTableWrap: {
        flex: 1,
    },
    clearBoth: {
        clear: 'both',
    },
    headerBarPagination: {
        float: 'right',
    },
};

class List extends Component {
    static propTypes = {
        items: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
        pager: PropTypes.object.isRequired,
        getItems: PropTypes.func.isRequired,
        incrementPage: PropTypes.func.isRequired,
        decrementPage: PropTypes.func.isRequired,
    };

    componentWillMount() {
        const { getItems } = this.props;
        getItems();
    }

    renderPagination() {
        const {
            users,
            incrementPage,
            decrementPage,
            pager,
            pager: { page, pageCount, total, currentlyShown },
        } = this.props;
        const style =
            users && (users.length === 0 || typeof users === 'string')
                ? { visibility: 'hidden' }
                : {};

        const paginationProps = {
            hasNextPage: () => users && users.length && page < pageCount,
            hasPreviousPage: () => users && users.length && page > 1,
            onNextPageClick: () => {
                incrementPage(pager);
            },
            onPreviousPageClick: () => {
                decrementPage(pager);
            },
            total,
            currentlyShown,
            style,
        };

        return (
            <div style={style}>
                <Pagination {...paginationProps} />
            </div>
        );
    }

    renderHeaderBar() {
        const { FilterComponent, getItems } = this.props;
        return (
            <div className="data-table__filter-bar" style={styles.clearBoth}>
                <div style={styles.headerBarPagination}>{this.renderPagination()}</div>
                <div>
                    <FilterComponent getItems={getItems} />
                </div>
            </div>
        );
    }

    renderDataTable() {
        const {
            users,
            columns,
            primaryAction,
            contextMenuActions,
            contextMenuIcons,
            isContextActionAllowed,
        } = this.props;

        if (typeof users === 'string') {
            const introText = 'There was an error fetching the user list:';
            return <ErrorMessage introText={introText} errorMessage={users} />;
        }

        if (users === null) {
            return <LoadingMask />;
        }

        if (users.length === 0) {
            return <div style={styles.clearBoth}>No results found.</div>;
        }

        return (
            <DataTable
                rows={users}
                columns={columns}
                primaryAction={primaryAction}
                contextMenuActions={contextMenuActions}
                contextMenuIcons={contextMenuIcons}
                isContextActionAllowed={isContextActionAllowed}
            />
        );
    }

    render() {
        return (
            <div style={styles.dataTableWrap}>
                <Heading>User management</Heading>
                {this.renderHeaderBar()}
                {this.renderDataTable()}
                {this.renderPagination()}
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        users: state.list,
        pager: state.pager,
    };
};

export default connect(mapStateToProps, {
    incrementPage,
    decrementPage,
})(List);

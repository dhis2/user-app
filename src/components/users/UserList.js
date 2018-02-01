import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import Pagination from 'd2-ui/lib/pagination/Pagination.component';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import Heading from 'd2-ui/lib/headings/Heading.component';
import 'd2-ui/lib/css/DataTable.css';
import 'd2-ui/lib/css/Pagination.css';
import { getUsers, incrementPage, decrementPage } from '../../actions';
import createUserContextActions from './userContextActions';
import UserFilter from './UserFilter';
import ErrorMessage from '../ErrorMessage';

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

class UserList extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        users: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
        pager: PropTypes.object.isRequired,
        getUsers: PropTypes.func.isRequired,
        incrementPage: PropTypes.func.isRequired,
        decrementPage: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        const { actions, icons, isActionAllowed } = createUserContextActions(props);
        this.contextMenuActions = actions;
        this.contextMenuIcons = icons;
        this.isContextActionAllowed = isActionAllowed;
    }

    componentWillMount() {
        const { getUsers } = this.props;
        getUsers();
    }

    toEditView(user) {
        const { history } = this.props;
        const { id } = user;
        console.log('Go to edit view for this user: ', user);
        history.push(`/users/edit/${id}`);
    }

    renderPagination() {
        const {
            getUsers,
            users,
            incrementPage,
            decrementPage,
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
                incrementPage(page);
                getUsers();
            },
            onPreviousPageClick: () => {
                decrementPage(page);
                getUsers();
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
        return (
            <div className="data-table__filter-bar" style={styles.clearBoth}>
                <div style={styles.headerBarPagination}>{this.renderPagination()}</div>
                <div>
                    <UserFilter />
                </div>
            </div>
        );
    }

    renderDataTable() {
        const { users } = this.props;

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
                columns={['displayName', 'userName']}
                primaryAction={this.toEditView.bind(this)}
                contextMenuActions={this.contextMenuActions}
                contextMenuIcons={this.contextMenuIcons}
                isContextActionAllowed={this.isContextActionAllowed}
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
    getUsers,
    incrementPage,
    decrementPage,
})(UserList);

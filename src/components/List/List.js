import React, { Component } from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { connect } from 'react-redux'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import DataTable from 'd2-ui/lib/data-table/DataTable.component'
import Pagination from 'd2-ui/lib/pagination/Pagination.component'
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component'
import Heading from 'd2-ui/lib/headings/Heading.component'
import 'd2-ui/lib/css/DataTable.css'
import 'd2-ui/lib/css/Pagination.css'
import navigateTo from '../../utils/navigateTo'
import { listSelector, pagerSelector } from '../../selectors'
import {
    getList,
    resetFilter,
    resetPager,
    incrementPage,
    decrementPage,
    showSnackbar,
    hideSnackbar,
} from '../../actions'
import ErrorMessage from '../ErrorMessage'
import './booleanValueRenderer'

const styles = {
    dataTableWrap: {
        flex: 1,
    },
    clearBoth: {
        clear: 'both',
    },
    filterBar: {
        display: 'table',
        marginBottom: '1rem',
        width: '100%',
    },
    headerBarPagination: {
        float: 'right',
        marginTop: '14px',
    },
    headerBarFilterWrap: {
        display: 'table',
        marginRight: '230px',
    },
    pagination: {
        userSelect: 'none',
    },
}

/**
 * Generic component that fetches list data, and displays this in a DataTable with paging and filtering
 */
class List extends Component {
    componentDidMount() {
        const {
            items,
            getList,
            resetFilter,
            resetPager,
            entityType,
            listType,
        } = this.props

        // Only fetch when there is no suitable list available
        if (items === null || listType !== entityType) {
            // If list type is defined but doesn't match current entity
            // this means the user has switched section so pager and filter must be reset
            if (listType !== entityType) {
                resetFilter()
                resetPager()
            }
            getList(entityType)
        }
    }

    executeEditIfAllowed = model => {
        const {
            isContextActionAllowed,
            primaryAction,
            showSnackbar,
            hideSnackbar,
        } = this.props
        if (isContextActionAllowed(model, 'edit')) {
            primaryAction(model)
        } else {
            showSnackbar({
                message: `${i18n.t('You are not allowed to edit')} ${
                    model.displayName
                }`,
                action: i18n.t('Confirm'),
                autoHideDuration: null,
                onActionClick: hideSnackbar,
            })
        }
    }

    getPagerConfig(pager) {
        if (!pager) {
            return {
                page: null,
                pageCount: null,
                total: null,
                currentlyShown: null,
            }
        }
        return pager
    }

    renderPagination() {
        const { pager, items, incrementPage, decrementPage } = this.props
        const { page, pageCount, total, currentlyShown } = this.getPagerConfig(
            pager
        )
        const shouldHide =
            !items || items.length === 0 || typeof items === 'string'
        const style = shouldHide
            ? { ...styles.pagination, visibility: 'hidden' }
            : styles.pagination
        const paginationProps = {
            hasNextPage: () =>
                page && items && items.length && page < pageCount,
            hasPreviousPage: () => page && items && items.length && page > 1,
            onNextPageClick: () => {
                incrementPage(pager)
            },
            onPreviousPageClick: () => {
                decrementPage(pager)
            },
            total,
            currentlyShown,
            style,
        }

        return (
            <div style={style}>
                <Pagination {...paginationProps} />
            </div>
        )
    }

    renderHeaderBar() {
        const { FilterComponent, entityType } = this.props
        return (
            <div className="data-table__filter-bar" style={styles.filterBar}>
                <div style={styles.headerBarPagination}>
                    {this.renderPagination()}
                </div>
                <div style={styles.headerBarFilterWrap}>
                    <FilterComponent entityType={entityType} />
                </div>
            </div>
        )
    }

    renderDataTable() {
        const {
            items,
            columns,
            contextMenuActions,
            contextMenuIcons,
            isContextActionAllowed,
        } = this.props

        if (typeof items === 'string') {
            const introText = i18n.t('There was an error fetching the list')
            return <ErrorMessage introText={introText} errorMessage={items} />
        }

        if (items === null) {
            return <LoadingMask />
        }

        if (items.length === 0) {
            return <div style={styles.clearBoth}>No results found.</div>
        }
        return (
            <DataTable
                rows={items}
                columns={columns}
                primaryAction={this.executeEditIfAllowed}
                contextMenuActions={contextMenuActions}
                contextMenuIcons={contextMenuIcons}
                isContextActionAllowed={isContextActionAllowed}
            />
        )
    }

    render() {
        const { sectionName, newItemPath, className } = this.props
        return (
            <div style={styles.dataTableWrap} className={className}>
                <Heading>{sectionName}</Heading>
                {this.renderHeaderBar()}
                {this.renderDataTable()}
                {this.renderPagination()}
                <FloatingActionButton
                    className="entity-list__add-new-entity"
                    onClick={() => navigateTo(newItemPath)}
                >
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        )
    }
}

List.propTypes = {
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    pager: PropTypes.object,
    sectionName: PropTypes.string.isRequired,
    getList: PropTypes.func.isRequired,
    incrementPage: PropTypes.func.isRequired,
    decrementPage: PropTypes.func.isRequired,
    resetPager: PropTypes.func.isRequired,
    resetFilter: PropTypes.func.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    hideSnackbar: PropTypes.func.isRequired,
    entityType: PropTypes.string.isRequired,
    newItemPath: PropTypes.string.isRequired,
    listType: PropTypes.string,
    FilterComponent: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(String).isRequired,
    primaryAction: PropTypes.func.isRequired,
    contextMenuActions: PropTypes.object.isRequired,
    contextMenuIcons: PropTypes.object.isRequired,
    isContextActionAllowed: PropTypes.func.isRequired,
    className: PropTypes.string,
}

List.defaultProps = {
    className: 'paged-filterable-data-table',
}

const mapStateToProps = state => {
    return {
        listType: state.list.type,
        items: listSelector(state.list.items, state.currentUser.userGroups),
        pager: pagerSelector(state.pager),
    }
}

export default connect(
    mapStateToProps,
    {
        getList,
        resetFilter,
        resetPager,
        incrementPage,
        decrementPage,
        showSnackbar,
        hideSnackbar,
    }
)(List)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { connect } from 'react-redux'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import DataTable from '@dhis2/d2-ui-table'
import { LoadingMask, Heading } from '@dhis2/d2-ui-core'
import navigateTo from '../../utils/navigateTo'
import { listSelector } from '../../selectors'
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
import '@dhis2/d2-ui-core/css/Table.css'
import '@dhis2/d2-ui-core/css/Pagination.css'
import Pagination from '../Pagination.js'

const styles = {
    dataTableWrap: {
        flex: 1,
        marginBottom: '4rem',
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

    renderHeaderBar(pagination) {
        const { filterComponent: FilterComponent, entityType } = this.props
        return (
            <div className="data-table__filter-bar" style={styles.filterBar}>
                <div style={styles.headerBarPagination}>{pagination}</div>
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
        const {
            sectionName,
            newItemPath,
            className,
            pager,
            incrementPage,
            decrementPage,
        } = this.props

        const pagination = (
            <Pagination
                decrementPage={decrementPage}
                incrementPage={incrementPage}
                pager={pager || undefined}
            />
        )

        return (
            <div style={styles.dataTableWrap} className={className}>
                <Heading>{sectionName}</Heading>
                {this.renderHeaderBar(pagination)}
                {this.renderDataTable()}
                {pagination}
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
    columns: PropTypes.arrayOf(String).isRequired,
    contextMenuActions: PropTypes.object.isRequired,
    contextMenuIcons: PropTypes.object.isRequired,
    decrementPage: PropTypes.func.isRequired,
    entityType: PropTypes.string.isRequired,
    filterComponent: PropTypes.func.isRequired,
    getList: PropTypes.func.isRequired,
    hideSnackbar: PropTypes.func.isRequired,
    incrementPage: PropTypes.func.isRequired,
    isContextActionAllowed: PropTypes.func.isRequired,
    newItemPath: PropTypes.string.isRequired,
    primaryAction: PropTypes.func.isRequired,
    resetFilter: PropTypes.func.isRequired,
    resetPager: PropTypes.func.isRequired,
    sectionName: PropTypes.string.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    className: PropTypes.string,
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    listType: PropTypes.string,
    pager: PropTypes.object,
}

List.defaultProps = {
    className: 'paged-filterable-data-table',
}

const mapStateToProps = state => {
    return {
        listType: state.list.type,
        items: listSelector(state.list.items, state.currentUser.userGroupIds),
        pager: state.pager,
    }
}

export default connect(mapStateToProps, {
    getList,
    resetFilter,
    resetPager,
    incrementPage,
    decrementPage,
    showSnackbar,
    hideSnackbar,
})(List)

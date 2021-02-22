import React from 'react'
import PropTypes from 'prop-types'
import { Pagination as OrginalPagination } from '@dhis2/d2-ui-core'
import '@dhis2/d2-ui-core/css/Pagination.css'

const styles = {
    pagination: {
        userSelect: 'none',
    },
}

const getCurrentlyShown = pager => {
    if (!pager) {
        return null
    }
    const { total, pageCount, page } = pager
    const pageSize = pager.query ? pager.query.pageSize : pager.pageSize
    const pageCalculationValue =
        total - (total - (pageCount - (pageCount - page)) * pageSize)
    const startItem = 1 + pageCalculationValue - pageSize
    const endItem = pageCalculationValue

    return `${startItem} - ${endItem > total ? total : endItem}`
}

export default function Pagination({ pager, incrementPage, decrementPage }) {
    const { page, pageCount, total } = pager
    const currentlyShown = getCurrentlyShown(pager)
    const shouldHide = total === 0
    const style = shouldHide
        ? { ...styles.pagination, visibility: 'hidden' }
        : styles.pagination

    return (
        <div style={style}>
            <OrginalPagination
                hasNextPage={() => page && total && page < pageCount}
                hasPreviousPage={() => page && total && page > 1}
                onNextPageClick={() => {
                    incrementPage(pager)
                }}
                onPreviousPageClick={() => {
                    decrementPage(pager)
                }}
                total={total}
                currentlyShown={currentlyShown}
                style={style}
            />
        </div>
    )
}

Pagination.defaultProps = {
    pager: {
        page: 1,
        pageCount: 1,
        total: 0,
    },
}

Pagination.propTypes = {
    decrementPage: PropTypes.func,
    incrementPage: PropTypes.func,
    pager: PropTypes.shape({
        page: PropTypes.number,
        pageCount: PropTypes.number,
        total: PropTypes.number,
    }),
}

import React, { memo, useMemo, useCallback } from 'react'
import { Pagination as Pages } from 'react-bootstrap'
import PropTypes from 'prop-types'

const OFFSET_UPSET_DISTANCE = 3

/**
 * @typedef {Object} PaginationProps
 * @property {number} currentPage
 * @property {boolean} hasNext
 * @property {number} limit
 * @property {() => number} onClick
 * @property {number} total
 */

 /**
  * @type {React.FunctionComponent<PaginationProps>}
  */
const Pagination = ({ currentPage, hasNext, limit, onClick, total }) => {
  const onClickPageCallback = useCallback(
    page => {
      onClick(page)
    },
    [onClick]
  )

  const computedPagination = useMemo(() => {
    const range = Math.ceil(total / limit)

    const pages = Array(range)
      .fill(null)
      .map((_, index) => index + 1)

    const offset = pages.filter(
      page =>
        page >= Math.max(1, currentPage - OFFSET_UPSET_DISTANCE) &&
        page <= Math.min(pages.length, currentPage + OFFSET_UPSET_DISTANCE)
    )
    return offset.map(page => (
      <Pages.Item
        active={page === currentPage}
        className="hovered"
        key={page}
        onClick={() => onClickPageCallback(page)}
      >
        {page}
      </Pages.Item>
    ))
  }, [total, currentPage, onClickPageCallback, limit])

  return (
    <Pages size="sm">
      {currentPage > 1 && (
        <Pages.First onClick={() => onClickPageCallback(currentPage - 1)} />
      )}
      {computedPagination}
      {hasNext && (
        <Pages.Last onClick={() => onClickPageCallback(currentPage + 1)} />
      )}
    </Pages>
  )
}

Pagination.propTypes = {
  total: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  hasNext: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired
}

export default memo(Pagination)

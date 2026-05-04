import React, { memo, useMemo, useCallback } from 'react'
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
      <li
        key={page}
        className={`page-item${page === currentPage ? ' active' : ''}`}
      >
        <button
          className="page-link tw:px-3 tw:py-1 tw:rounded tw:border tw:border-gray-300 hover:tw:bg-[#58CC02] hover:tw:text-white"
          onClick={() => onClickPageCallback(page)}
        >
          {page}
        </button>
      </li>
    ))
  }, [total, currentPage, onClickPageCallback, limit])

  return (
    <nav aria-label="Pagination">
      <ul className="pagination tw:flex tw:gap-1 tw:list-none tw:p-0">
        {currentPage > 1 && (
          <li className="page-item">
            <button
              className="page-link tw:px-3 tw:py-1 tw:rounded tw:border tw:border-gray-300 hover:tw:bg-[#58CC02] hover:tw:text-white"
              onClick={() => onClickPageCallback(currentPage - 1)}
            >
              &laquo;
            </button>
          </li>
        )}
        {computedPagination}
        {hasNext && (
          <li className="page-item">
            <button
              className="page-link tw:px-3 tw:py-1 tw:rounded tw:border tw:border-gray-300 hover:tw:bg-[#58CC02] hover:tw:text-white"
              onClick={() => onClickPageCallback(currentPage + 1)}
            >
              &raquo;
            </button>
          </li>
        )}
      </ul>
    </nav>
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

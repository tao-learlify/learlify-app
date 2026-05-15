import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import {
  CaretRight,
  CheckCircle,
  ClipboardText,
  Clock,
  Eye,
  Hourglass
} from '@phosphor-icons/react'

import useEvaluations from 'hooks/useEvaluations'

import Pagination from 'components/Pagination'

import styles from './evaluations.module.scss'
import { STATUS } from 'modules/evaluations'
import PATH from 'utils/path'

function getStatusMeta(status, t) {
  switch (status) {
    case STATUS.EVALUATED:
      return {
        className: styles.statusEvaluated,
        icon: <CheckCircle size={16} weight="fill" aria-hidden="true" />,
        label: t('EVALUATIONS.STATUS.EVALUATED', { defaultValue: 'Evaluated' })
      }

    case STATUS.TAKEN:
      return {
        className: styles.statusTaken,
        icon: <Clock size={16} weight="fill" aria-hidden="true" />,
        label: t('EVALUATIONS.STATUS.TAKEN', { defaultValue: 'On revision' })
      }

    case STATUS.PENDING:
      return {
        className: styles.statusPending,
        icon: <Hourglass size={16} weight="fill" aria-hidden="true" />,
        label: t('EVALUATIONS.STATUS.PENDING', { defaultValue: 'Pending' })
      }

    default:
      return {
        className: styles.statusPending,
        icon: <Hourglass size={16} weight="fill" aria-hidden="true" />,
        label:
          status || t('EVALUATIONS.STATUS.PENDING', { defaultValue: 'Pending' })
      }
  }
}

function EvaluationSkeletonRows({ labels }) {
  return Array.from({ length: 3 }).map((_, index) => (
    <tr key={index} className={styles.skeletonRow}>
      <td data-label={labels.category}>
        <span className={styles.skeletonLine} />
      </td>
      <td data-label={labels.date}>
        <span className={styles.skeletonLine} />
      </td>
      <td data-label={labels.status}>
        <span className={styles.skeletonPill} />
      </td>
      <td data-label={labels.options}>
        <span className={styles.skeletonAction} />
      </td>
    </tr>
  ))
}

/**
 * @type {React.FunctionComponent<{ onRenderPage: () => number, latest: boolean, show: boolean, className: string }>}
 */
const Evaluations = ({ onRenderPage, latest, show, className }) => {
  const { t } = useTranslation()
  const evaluations = useEvaluations({ latest })
  const history = useHistory()

  const rows = evaluations.data || []
  const loading = evaluations.loading && rows.length === 0
  const headingId = latest ? 'latest-evaluations-title' : 'evaluations-title'
  const labels = {
    category: t('COMPONENTS.EVALUATIONS.rows.category'),
    date: t('COMPONENTS.EVALUATIONS.rows.date'),
    status: t('COMPONENTS.EVALUATIONS.rows.status'),
    options: t('COMPONENTS.EVALUATIONS.rows.options')
  }

  const handlePreviewEvaluation = useCallback(
    ({ id }) => {
      latest
        ? history.push({
            pathname: `${PATH.EVALUATION}/${id}`,
            search: '?latest=true'
          })
        : history.push({
            pathname: `${PATH.EVALUATION}/${id}`
          })
    },
    [history, latest]
  )

  const handleStats = () => {
    history.push(PATH.STATS)
  }

  return (
    <section
      className={clsx(styles.container, latest && styles.compact, className)}
      aria-labelledby={headingId}
    >
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>
            {t('COMPONENTS.EVALUATIONS.subtitle')}
          </span>
          <h3 id={headingId} className={styles.title}>
            {latest
              ? t('COMPONENTS.EVALUATIONS.subtitle')
              : t('COMPONENTS.EVALUATIONS.title')}
          </h3>
        </div>
        {evaluations.loading && (
          <span className={styles.loadingPill}>
            {t('COMPONENTS.EVALUATIONS.loading', { defaultValue: 'Updating' })}
          </span>
        )}
      </div>

      <div className={styles.tableWrap}>
        <table
          className={styles.table}
          aria-describedby={
            !loading && rows.length === 0
              ? 'evaluations-empty-state'
              : undefined
          }
        >
          <thead>
            <tr>
              <th scope="col">{labels.category}</th>
              <th scope="col">{labels.date}</th>
              <th scope="col">{labels.status}</th>
              <th scope="col">{labels.options}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <EvaluationSkeletonRows labels={labels} />
            ) : (
              rows.map(evaluation => {
                const categoryName = evaluation.category?.name || 'Aptis'
                const statusMeta = getStatusMeta(evaluation.status, t)

                return (
                  <tr key={evaluation.id} className={styles.row}>
                    <td data-label={labels.category}>
                      <span className={styles.categoryCell}>
                        <span
                          className={styles.categoryIcon}
                          aria-hidden="true"
                        >
                          {categoryName.charAt(0)}
                        </span>
                        <span className={styles.categoryName}>
                          {categoryName}
                        </span>
                      </span>
                    </td>
                    <td data-label={labels.date}>
                      <time
                        className={styles.dateText}
                        dateTime={evaluation.createdAt}
                      >
                        {moment(evaluation.createdAt).fromNow()}
                      </time>
                    </td>
                    <td data-label={labels.status}>
                      <span
                        className={clsx(
                          styles.statusPill,
                          statusMeta.className
                        )}
                      >
                        {statusMeta.icon}
                        {statusMeta.label}
                      </span>
                    </td>
                    <td data-label={labels.options}>
                      <button
                        type="button"
                        className={styles.actionButton}
                        onClick={() => handlePreviewEvaluation(evaluation)}
                        aria-label={t('COMPONENTS.EVALUATIONS.viewLabel', {
                          defaultValue: 'View evaluation for {{category}}',
                          category: categoryName
                        })}
                      >
                        <Eye size={18} weight="bold" aria-hidden="true" />
                        <span>
                          {t('COMPONENTS.EVALUATIONS.view', {
                            defaultValue: 'View'
                          })}
                        </span>
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && rows.length === 0 && (
        <div
          id="evaluations-empty-state"
          className={styles.emptyState}
          role="status"
        >
          <div className={styles.emptyIcon} aria-hidden="true">
            <ClipboardText size={34} weight="fill" />
          </div>
          <div className={styles.emptyCopy}>
            <h4>{t('COMPONENTS.EVALUATIONS.notavailable')}</h4>
            <p>
              {t('COMPONENTS.EVALUATIONS.emptyHint', {
                defaultValue: 'Complete an exam to see your evaluation history.'
              })}
            </p>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        {show && (
          <button
            type="button"
            className={styles.seeAllButton}
            onClick={handleStats}
          >
            {t('EVALUATIONS.seeAll')}
            <CaretRight size={18} weight="bold" aria-hidden="true" />
          </button>
        )}
        {evaluations.pagination && (
          <div className={styles.paginationWrap}>
            <Pagination {...evaluations.pagination} onClick={onRenderPage} />
          </div>
        )}
      </div>
    </section>
  )
}

Evaluations.defaultProps = {
  className: null,
  latest: false,
  onRenderPage: () => {},
  show: false
}

export default Evaluations

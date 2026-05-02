import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'clsx'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { ic_watch_later } from 'react-icons-kit/md/ic_watch_later'
import { ic_done_all } from 'react-icons-kit/md/ic_done_all'
import { ic_visibility } from 'react-icons-kit/md/ic_visibility'

import Icon from 'react-icons-kit'

import useEvaluations from 'hooks/useEvaluations'

import FlexContainer from 'components/FlexContainer'
import Management from 'components/Management'
import TableRow from 'components/TableRow'
import TableHeader from 'components/TableHeader'
import Text from 'components/Text'
import Pagination from 'components/Pagination'

import styles from './evaluations.module.scss'
import { STATUS } from 'modules/evaluations'
import PATH from 'utils/path'
import { ic_chevron_right } from 'react-icons-kit/md/ic_chevron_right'

/**
 * @type {React.FunctionComponent<{ onRenderPage: () => number, latest: boolean }}
 */
const Evaluations = ({ onRenderPage, latest, show }) => {
  const { t } = useTranslation()

  const evaluations = useEvaluations({ latest })

  const history = useHistory()

  /**
   * @description
   * Handles the current status with the icon
   * @param {Evaluation}
   */
  const getStatus = ({ status }) => {
    switch (status) {
      case STATUS.TAKEN:
        return (
          <Icon
            className="text-turquoise hovered"
            icon={ic_watch_later}
            size={24}
          />
        )

      case STATUS.PENDING:
        return (
          <Icon
            className="text-turquoise hovered"
            icon={ic_watch_later}
            size={24}
          />
        )

      case STATUS.EVALUATED:
        return (
          <Icon
            className="text-turquoise hovered"
            icon={ic_done_all}
            size={24}
          />
        )

      default:
        return <React.Fragment />
    }
  }

  /**
   * @param {Evaluation}
   */
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
    <div className={classNames(styles.container)}>
      <Text className="mb-3" dunkin center color="white" tag="h5">
        {latest
          ? t('COMPONENTS.EVALUATIONS.subtitle')
          : t('COMPONENTS.EVALUATIONS.title')}
      </Text>
      <div className={styles.content}>
        <Management
          border={false}
          color="white"
          alternative
          rows={[
            t('COMPONENTS.EVALUATIONS.rows.category'),
            t('COMPONENTS.EVALUATIONS.rows.date'),
            t('COMPONENTS.EVALUATIONS.rows.status'),
            t('COMPONENTS.EVALUATIONS.rows.options')
          ]}
        >
          {evaluations.data.map(evaluation => (
            <TableRow key={evaluation.id}>
              <TableHeader color="white">
                <Text lighter tag="small" color="white">
                  {evaluation.category.name}
                </Text>
              </TableHeader>
              <TableHeader
                color="white"
                value={moment(evaluation.createdAt).fromNow()}
              />
              <TableHeader>{getStatus(evaluation)}</TableHeader>
              <TableHeader>
                <Icon
                  className="text-white"
                  size={24}
                  icon={ic_visibility}
                  onClick={() => handlePreviewEvaluation(evaluation)}
                />
              </TableHeader>
            </TableRow>
          ))}
        </Management>
        {show && (
          <div className={styles.position}> 
            <Text lighter bold center color="white" tag="h5" onClick={handleStats} hovered>
              {t('EVALUATIONS.seeAll')}{' '}
              <Icon size={24} icon={ic_chevron_right} />
            </Text> 
          </div>
        )}
        {evaluations.data.length === 0 && (
          <>
            <br />
            <Text lighter bold center color="white" tag="h5">
              {t('COMPONENTS.EVALUATIONS.notavailable')}
            </Text>
          </>
        )}
        <FlexContainer>
          {evaluations.pagination && (
            <Pagination {...evaluations.pagination} onClick={onRenderPage} />
          )}
        </FlexContainer>
      </div>
    </div>
  )
}


export default Evaluations

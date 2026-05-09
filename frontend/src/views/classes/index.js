import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Icon from 'react-icons-kit'
import { group } from 'react-icons-kit/fa/group'

import { withVerification } from 'hocs'

import useAppTour from 'hooks/useAppTour'
import useClasses from 'hooks/useClasses'
import useHttpClient from 'hooks/useHttpClient'
import useModels from 'hooks/useModels'
import usePackages from 'hooks/usePackages'

import Template from 'components/Template'
import TourIndicator from 'components/TourIndicator'
import TourTarget from 'components/TourTarget'

import path from 'utils/path'
import config from './config'

import { fetchClassRoomsThunk } from 'store/@thunks/classes'
import { classesTourProvider } from 'providers/tour'
import { createNavigationPath } from 'modules/url'

import { img } from 'assets/compat'

import { getClassTicket } from 'utils/packages'
import moment from 'moment'

import styles from './classes.module.scss'


const Classes = () => {
  const { tour, loading } = useAppTour({ draft: 'classes' })

  const { t } = useTranslation()

  const dispatch = useDispatch()

  const { model } = useModels()

  const classes = useClasses()

  const history = useHttpClient(config.historyHttpRequest)

  const packages = usePackages()

  const getActiveWithClass = () => packages.data.find(getClassTicket)

  useEffect(() => {
    dispatch(fetchClassRoomsThunk())
  }, [dispatch])

  const renderClassText = React.useCallback(
    /**
     * @param {{}} value
     */
    value => {
      if (value.schedule && value.schedule.startDate) {
        return (
          <>
            {moment(value.schedule.startDate).format('dddd')}{' '}
            {moment(value.schedule.startDate).format('DD, hh:mm a')} -{' '}
            {moment(value.schedule.endDate).format('hh:mma')}
          </>
        )
      }
    },
    []
  )

  return (
    <>
      <Template
        view
        withLoader={
          packages.loading || classes.loading || history.loading || loading
        }
        withSocket={false}
      >
        <div className={styles.wrapper}>
          <div className={styles.title}>{t('CLASSES.title')}</div>
          <div className={styles.content}>
            <div className={styles.descReservations}>
              <div className={styles.boxedDesc}>
                <div className={styles.boxedTitle}>{t('CLASSES.counter')}</div>
                <div className={`${styles.boxedText} text-center`}>
                  {t('CLASSES.available')}:{' '}
                  {getActiveWithClass() ? getActiveWithClass().classes : '0'}
                </div>
                <Link to={path.PAYMENTS}>
                  <div className={styles.boxedButton}>{t('CLASSES.purchase')}</div>
                </Link>
                <br />
                <div className={styles.boxedTitle}>{t('CLASSES.history')}</div>
                {Array.isArray(history.data) && history.data.length > 0 ? (
                  history.data.map(classHistory => (
                    <div key={classHistory.id} className="container mx-auto px-4">
                      <div className={`${styles.boxedText} font-weight-bold`}>
                        {renderClassText(classHistory)} (
                        {classHistory.schedule.teacher.firstName}){' '}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.boxedText}>{t('CLASSES.unavailableHistory')}</div>
                )}
              </div>
              <div className={styles.boxedReservations}>
                <TourTarget tour="2">
                  <div className={styles.boxedBehind}>
                    <div className={styles.boxedTitle}>{t('CLASSES.subscriptions')}</div>
                    {classes.data.length > 0 ? (
                      classes.data.map(classRoom => (
                        <div key={classRoom.id} className="container mx-auto px-4">
                          <div className={`${styles.boxedText} text-small`}>
                            <img
                              className="mr-1"
                              width={20}
                              height={20}
                              src={img['check-mark']}
                              alt="confirmed"
                            />
                            {renderClassText(classRoom)}
                            {classRoom.schedule.streaming || (
                              <Icon className="ml-2" icon={group} />
                            )}
                          </div>
                          {classRoom.schedule.streaming && (
                            <Link
                              className="ml-3 badge bg-success badge-pill rounded border"
                              to={createNavigationPath(path.MEETINGS, {
                                token: classRoom.name
                              })}
                            >
                              <div className={styles.boxedText}>
                                {t('CLASSES.activeMeeting')}
                              </div>
                            </Link>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className={styles.boxedText}>
                        {/* {t('CLASSES.unavailableSubscriptions')} */}
                      </div>
                    )}
                    {/*
                    <TourTarget tour="1">
                      <Link to={path.AGREEMENT}>
                        <BoxedButton color>
                          {t('CLASSES.schedules')}
                        </BoxedButton>
                      </Link>
                    </TourTarget>
                    */}
                    {/*
                      Temporary solution of the booking classes problem
                    */}
                    <div className={styles.boxedText}>
                        {t('CLASSES.unavailableSchedules')}
                    </div>
                    <br />
                  </div>
                </TourTarget>
              </div>
            </div>

            <div className={styles.description}>
              <div className={styles.descTitle}>
                {t('CLASSES.DESCRIPTION.title')}
              </div>
              <div className={styles.keyPoint}>
                <img className={styles.dotImg} alt="icon1" src={img['1icon']} />
                {t('CLASSES.DESCRIPTION.confirm')}
              </div>
              {model && (
                <div className={styles.keyPoint}>
                  <img className={styles.dotImg} alt="icon2" src={img['2icon']} />
                  {t('CLASSES.DESCRIPTION.teacher', { model: model.name })}
                </div>
              )}
              <div className={styles.keyPoint}>
                <img className={styles.dotImg} alt="icon3" src={img['3icon']} />
                {t('CLASSES.DESCRIPTION.customize')}
              </div>
              <div className={styles.keyPoint}>
                <img className={styles.dotImg} alt="icon4" src={img['4icon']} />
                {t('CLASSES.DESCRIPTION.prepare')}
              </div>
              <div className={styles.keyPoint}>
                <img className={styles.dotImg} alt="icon5" src={img['5icon']} />
                {t('CLASSES.DESCRIPTION.guide')}
              </div>
              <div className={styles.keyPoint}>
                <img className={styles.dotImg} alt="icon6" src={img['6icon']} />
                {t('CLASSES.DESCRIPTION.payments')}
              </div>
              <div className={styles.keyPoint}>
                <img className={styles.dotImg} alt="icon7" src={img['7icon']} />
                {t('CLASSES.DESCRIPTION.review')}
              </div>
              <div className={styles.priceText}>{t('CLASSES.DESCRIPTION.minutes')}</div>
              <div className={styles.classText}>
                13 EUR
                <img alt="tarjeta" src={img.tarjeta} width={150} />{' '}
                <img alt="gato" src={img.gato} width={120} />
              </div>
            </div>
          </div>
        </div>
      </Template>
      {tour.classes || loading || (
        <TourIndicator indications={classesTourProvider} />
      )}
    </>
  )
}

export default withVerification(Classes)

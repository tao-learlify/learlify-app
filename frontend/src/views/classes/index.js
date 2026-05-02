import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Icon from 'react-icons-kit'
import { group } from 'react-icons-kit/fa/group'

import {
  BoxedBehind,
  BoxedButton,
  BoxedDescription,
  BoxedReservations,
  BoxedText,
  BoxedTitle,
  ClassText,
  Description,
  DescriptionReservations,
  DescriptionTitle,
  Img,
  KeyPoint,
  PriceText,
  TitleContainer,
  WrapperClasses,
  WrapperContent
} from 'styled'

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

import { img } from 'assets/img'

import { getClassTicket } from 'utils/packages'
import moment from 'moment'
  

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
        <WrapperClasses>
          <TitleContainer>{t('CLASSES.title')}</TitleContainer>
          <WrapperContent>
            <DescriptionReservations>
              <BoxedDescription>
                <BoxedTitle>{t('CLASSES.counter')}</BoxedTitle>
                <BoxedText className="text-center">
                  {t('CLASSES.available')}:{' '}
                  {getActiveWithClass() ? getActiveWithClass().classes : '0'}
                </BoxedText>
                <Link to={path.PAYMENTS}>
                  <BoxedButton>{t('CLASSES.purchase')}</BoxedButton>
                </Link>
                <br />
                <BoxedTitle>{t('CLASSES.history')}</BoxedTitle>
                {Array.isArray(history.data) && history.data.length > 0 ? (
                  history.data.map(classHistory => (
                    <Container key={classHistory.id}>
                      <BoxedText className="font-weight-bold">
                        {renderClassText(classHistory)} (
                        {classHistory.schedule.teacher.firstName}){' '}
                      </BoxedText>
                    </Container>
                  ))
                ) : (
                  <BoxedText>{t('CLASSES.unavailableHistory')}</BoxedText>
                )}
              </BoxedDescription>
              <BoxedReservations>
                <TourTarget tour="2">
                  <BoxedBehind>
                    <BoxedTitle>{t('CLASSES.subscriptions')}</BoxedTitle>
                    {classes.data.length > 0 ? (
                      classes.data.map(classRoom => (
                        <Container key={classRoom.id}>
                          <BoxedText className="text-small">
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
                          </BoxedText>
                          {classRoom.schedule.streaming && (
                            <Link
                              className="ml-3 badge bg-success badge-pill rounded border"
                              to={createNavigationPath(path.MEETINGS, {
                                token: classRoom.name
                              })}
                            >
                              <BoxedText>
                                {t('CLASSES.activeMeeting')}
                              </BoxedText>
                            </Link>
                          )}
                        </Container>
                      ))
                    ) : ( 
                      
                      <BoxedText>
                        {/* {t('CLASSES.unavailableSubscriptions')} */}
                      </BoxedText>
                      
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
                    <BoxedText>
                        {t('CLASSES.unavailableSchedules')}
                    </BoxedText>
                    <br />
                  </BoxedBehind>
                </TourTarget>
              </BoxedReservations>
            </DescriptionReservations>

            <Description>
              <DescriptionTitle>
                {t('CLASSES.DESCRIPTION.title')}
              </DescriptionTitle>
              <KeyPoint>
                <Img alt="icon1" src={img['1icon']} />
                {t('CLASSES.DESCRIPTION.confirm')}
              </KeyPoint>
              {model && (
                <KeyPoint>
                  <Img alt="icon2" src={img['2icon']} />
                  {t('CLASSES.DESCRIPTION.teacher', { model: model.name })}
                </KeyPoint>
              )}
              <KeyPoint>
                <Img alt="icon3" src={img['3icon']} />
                {t('CLASSES.DESCRIPTION.customize')}
              </KeyPoint>
              <KeyPoint>
                <Img alt="icon4" src={img['4icon']} />
                {t('CLASSES.DESCRIPTION.prepare')}
              </KeyPoint>
              <KeyPoint>
                <Img alt="icon5" src={img['5icon']} />
                {t('CLASSES.DESCRIPTION.guide')}
              </KeyPoint>
              <KeyPoint>
                <Img alt="icon6" src={img['6icon']} />
                {t('CLASSES.DESCRIPTION.payments')}
              </KeyPoint>
              <KeyPoint>
                <Img alt="icon7" src={img['7icon']} />
                {t('CLASSES.DESCRIPTION.review')}
              </KeyPoint>
              <PriceText>{t('CLASSES.DESCRIPTION.minutes')}</PriceText>
              <ClassText>
                13 EUR
                <img alt="tarjeta" src={img.tarjeta} width={150} />{' '}
                <img alt="gato" src={img.gato} width={120} />
              </ClassText>
            </Description>
          </WrapperContent>
        </WrapperClasses>
      </Template>
      {tour.classes || loading || (
        <TourIndicator indications={classesTourProvider} />
      )}
    </>
  )
}

export default withVerification(Classes)

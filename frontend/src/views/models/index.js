/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { unwrapResult } from '@reduxjs/toolkit'
import { ReactSVG } from 'react-svg'
import 'assets/scss/view.scss'


import useMedia from 'hooks/useMedia'
import useQuery from 'hooks/useQuery'
import useSVG from 'hooks/useSVG'
import useLocalStorage from 'hooks/useLocalStorage'

import Template from 'components/Template'
import Text from 'components/Text'

import {
  BodyContainer,
  ContainerModels,
  ImageContainer,
  Hover,
  LogoModels,
  LogoContainer,
  ModelContainer,
  StyledCard,
  TextContainerModels,
  Title
} from 'styled'

import { fetchModelsThunk, patchModelThunk } from 'store/@thunks/models'
import { modelSelector } from 'store/@selectors/models'
import { selectModel } from 'store/@reducers/models'

import like from 'modules/words'

import Aptis from 'assets/illustrations/decorative/aptis.svg'
import B1B2 from 'assets/illustrations/brand/logo.svg'
import IELTS from 'assets/illustrations/decorative/go.svg'

import FetchError from 'views/errors/FetchError'
import PATH from 'utils/path'

import { withVerification as WV } from 'hocs'
import { svg } from 'assets/compat'

const Models = () => {
  const ls = useLocalStorage()

  const isResponsive = useMedia('(max-width: 767px)', true)

  const dispatch = useDispatch()

  const history = useHistory()

  const { query } = useQuery()

  const { models } = useSelector(modelSelector)

  const svgCallback = useSVG({
    classList: 'svg-class-name',
    attributes: [['style', isResponsive ? 'width: 100%' : 'width: 420px']]
  })

  const { t } = useTranslation()

  useEffect(() => {
    const stream = dispatch(fetchModelsThunk())

    return () => {
      stream.abort()
    }
  }, [dispatch])

  useEffect(() => {
    if (query && models.data.length > 0) {
      const selected = models.data.find(model => like([model.name], query))

      dispatch(selectModel(selected))

      dispatch(patchModelThunk(selected.name))
        .then(unwrapResult)
        .then(({ response }) => {
          ls.setItem(response.token)

          history.push(PATH.DASHBOARD)
        })
        
    }
  }, [query, models.data])

  const handleClickModelSelection = useCallback(
    /**
     * @param {Model} model
     */
    model => {
      dispatch(selectModel(model))

      dispatch(patchModelThunk(model.name))
        .then(unwrapResult)
        .then(({ response }) => ls.setItem(response.token))

      history.push({
        pathname: PATH.DASHBOARD
      })
    },
    [dispatch, history, models.data, query]
  )

  if (models.error) {
    return <FetchError />
  }

  return (
    <Template withLoader={models.loading} view>
      {models.error ? (
        <></>
      ) : (
        <div className="view-container">
          <div className="ml-2">
            <Text dunkin tag="h2">
              {t('MODELS.title')}
            </Text>
            <Text dunkin tag="h3">
              {t('MODELS.subtitle')}
            </Text>
          </div>
          <ContainerModels>
            <ModelContainer>
              {models.data.map(model => (
                <Hover
                  key={model.id}
                  onClick={() => handleClickModelSelection(model)}
                >
                  <BodyContainer>
                    <StyledCard className="shadow-lg">
                      <Title backgroundColor={model.color}>
                        <Text dunkin tag="h5">
                          {model.name}
                        </Text>
                      </Title>
                      <TextContainerModels>
                        <Text tag="span">{t(`MODELS.${model.name}`)}</Text>
                      </TextContainerModels>
                    </StyledCard>
                  </BodyContainer>
                </Hover>
              ))}
            </ModelContainer>
            <ImageContainer>
              <ReactSVG beforeInjection={svgCallback} src={svg.model} />
            </ImageContainer>
          </ContainerModels>
        </div>
      )}
      <LogoContainer>
        <LogoModels src={Aptis} />
        <LogoModels display="true" isMobile={isResponsive} src={B1B2} />
        <LogoModels src={IELTS} />
      </LogoContainer>
    </Template>
  )
}

export default WV(Models)

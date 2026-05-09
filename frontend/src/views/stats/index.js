import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'

import useModels from 'hooks/useModels'
import useStats from 'hooks/useStats'
import usePage from 'hooks/usePage'


import Template from 'components/Template'
import Evaluations from 'components/Evaluations'
import Stats from 'components/Stats'

import { fetchEvaluationsThunk, fetchLatestEvaluationsThunk } from 'store/@thunks/evaluations'
import Text from 'components/Text'
import { img } from 'assets/compat'

const StatsView = () => {
  const dispatch = useDispatch()

  const { t } = useTranslation()
    
  const EP = usePage()

  const LP = usePage()

  const { fetchStats, loading } = useStats()

  const { model } = useModels()


  useEffect(() => {
    if (model) {
      dispatch(fetchEvaluationsThunk({
        page: EP.page,
        model: model.name,
        own: false
      }))
    }
  }, [dispatch, EP.page, model])


  useEffect(() => {
    if (model) {
      dispatch(fetchLatestEvaluationsThunk({
        page: LP.page
      }))
    }
  }, [dispatch, LP.page, model])


  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return (
    <Template
      view
      withLoader={loading}
    >
      <div className="tw:text-center tw:mb-4">
        <Text center color="blue" dunkin tag="h4">
          {t('STATS.title')} <img alt="stats" src={img.review} width={35} />
        </Text>
        <hr />
      </div>
      <div className="tw:flex tw:flex-wrap tw:-mx-3">
        <div className="tw:w-full lg:tw:w-1/2 tw:px-3 tw:mb-4">
          <Evaluations onRenderPage={EP.handleSet} />
        </div>
        <div className="tw:w-full lg:tw:w-1/2 tw:px-3 tw:mb-4">
          <Stats show={false} />
        </div>
        <div className="tw:w-full lg:tw:w-1/2 tw:px-3">
          <Evaluations onRenderPage={LP.handleSet} latest />
        </div>
        <div className="tw:w-full lg:tw:w-1/2 tw:px-3">
          {/* <Stats categories show={false} /> */}
        </div>
      </div>
    </Template>
  )
}

export default StatsView

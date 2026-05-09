import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import Text from './Text'
import Display from './Display'

import { img } from 'assets/compat'
import { Animated } from 'react-animated-css'

const CompletedUnit = () => {
  const { t } = useTranslation()

  return (
    <Animated animationIn="fadeInUp">
      <div className="tw:flex tw:flex-wrap">
        <div className="tw:w-full md:tw:w-10/12 tw:px-4">
          <Text dunkin color="blue" tag="h2">
            {t('COMPONENTS.completedUnit.placeholder.congrats')}
          </Text>
          <Text lighter color="dark" tag="h4">
            {t('COMPONENTS.completedUnit.placeholder.effort')}
          </Text>
          <Text lighter color="muted" tag="h5">
            {t('COMPONENTS.completedUnit.placeholder.results')}
          </Text>
          <div className="tw:flex tw:flex-wrap">
            <div className="tw:w-full md:tw:w-8/12 tw:px-4">
              <Display>
                <Text bold lighter color="secondary" tag="p">
                  {t('COMPONENTS.completedUnit.placeholder.machine')}
                  <img lazy="true" src={img.student} alt="student" />
                </Text>
              </Display>
            </div>
          </div>
        </div>
      </div>
    </Animated>
  )
}

export default memo(CompletedUnit)

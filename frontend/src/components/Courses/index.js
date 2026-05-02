import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import classNames from 'clsx'

import useSVG from 'hooks/useSVG'
import useMedia from 'hooks/useMedia'
import useModels from 'hooks/useModels'

import Text from 'components/Text'

import Panda from 'assets/svg/courses.svg'
import styles from './index.module.scss'

import { Button } from 'styled'
import { BLUE } from 'assets/colors'

import PATH from 'utils/path'

const Courses = () => {
  const { t } = useTranslation()

  const { model } = useModels()

  const isResponsive = useMedia('(max-width: 767px)', true)

  const svgCallback = useSVG({
    attributes: [
      ['width', isResponsive ? '120px' : '280px'],
      ['height', isResponsive ? '200px' : '300px']
    ]
  })

  const history = useHistory()

  const handleClick = useCallback(
    route => {
      history.push(route)
    },
    [history]
  )

  return (
    <div className={classNames(styles.container, styles.background, 'border')}>
      <div about="content">
        <div about="panda">
          <ReactSVG beforeInjection={svgCallback} src={Panda} />
        </div>
        <div about="info">
          <Text className={styles.title} color="white" shadow tag="h1">
            {t('COMPONENTS.COURSES.name')}
          </Text>
          {model && (
            <Text className={styles.subTitle} color="white" shadow tag="h4">
              {t('COMPONENTS.COURSES.interactive', { model: model.name })}
            </Text>
          )}
          <div className={styles.button}>
            <Button
              className={styles.btnLeft}
              background={BLUE}
              onClick={() => handleClick(PATH.COURSES)}
            >
              <Text bold tag="span">
                {t('COMPONENTS.COURSES.start')}
              </Text>
            </Button>

            <Button
              background="transparent"
              className={classNames(styles.btnRight, 'border border-white')}
              onClick={() => handleClick(PATH.DEMO)}
            >
              <Text bold tag="span">
                Demo
              </Text>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses

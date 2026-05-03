import React, { memo } from 'react'
import classNames from 'clsx'
import { Trans } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import useMedia from 'hooks/useMedia'

import Text from 'components/Text'

import { img } from 'assets/compat'
import { Button } from 'components/ui'
import { BLUE, TURQUOISE, WHITE } from 'assets/colors'

import styles from './index.module.scss'
import PATH from 'utils/path'

const Classes = () => {
  const history = useHistory()

  const isResponsive = useMedia('(max-width: 767px)', true)

  const handleClickReserve = () => {
    history.push(PATH.AGREEMENT)
  }

  return (
    <div className={classNames(styles.flex, styles.background, 'border')}>
      <div className={classNames(isResponsive && 'text-left', styles.padding)}>
        <div style={{ marginTop: 25, marginBottom: 10 }}>
          <Text className={styles.title} tag="h4" color="white">
            <Trans i18nKey="DASHBOARD.classes.online" />
          </Text>
          <Text
            className={classNames('m-0', styles.subtitle)}
            color="white"
            tag="h4"
          >
            <Trans i18nKey="DASHBOARD.classes.classes" />
          </Text>
        </div>
        <Text
          className={classNames('font-weight-light lead m-0', styles.light)}
          color="white"
          tag="h4"
        >
          <Trans i18nKey="DASHBOARD.classes.individuals" />
        </Text>
        <Text
          className={classNames('m-0', styles.bold)}
          color="white"
          bold
          tag="h4"
        >
          <Trans i18nKey="DASHBOARD.classes.experts" />
        </Text>
        <div className={styles.button}>
          <Button
            background={WHITE}
            className={styles.btnLeft}
            color={BLUE}
            onClick={handleClickReserve}
          >
            <Trans i18nKey="DASHBOARD.classes.consult" />
          </Button>
          <Button
            background={TURQUOISE}
            className={styles.btnRight}
            color={WHITE}
            onClick={handleClickReserve}
          >
            <Trans i18nKey="DASHBOARD.classes.reserve" />
          </Button>
        </div>
      </div>
      <div className={styles.boxTeacher}>
        <img
          alt="teacher"
          className={classNames('img-fluid', styles.img)}
          src={img.Josh}
          width={isResponsive ? 170 : 200}
        />
      </div>
    </div>
  )
}

export default memo(Classes)

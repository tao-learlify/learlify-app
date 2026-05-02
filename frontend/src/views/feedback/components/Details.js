import React, { useMemo } from 'react'
import Confetti from 'react-confetti'
import { Doughnut as Chart } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

import useFeedback from 'hooks/useFeedback'
import useModels from 'hooks/useModels'
import useWindowSize from 'hooks/useWindowSize'

import Text from 'components/Text'
import Flex from 'components/FlexContainer'

import { BLUE, TURQUOISE } from 'assets/colors'
import { APTIS, IELTS } from 'constant/models'

import styles from 'views/dashboard/config/styles'

/**
 * @description
 * Details of stats for Grammar & Vocabulary, Listening, Reading.
 * @returns {React.Component}
 */
const Details = () => {
  const [height, width] = useWindowSize()

  const { t } = useTranslation()

  const { model } = useModels()
  
  const feedback = useFeedback()


  const getTitle = () => {
    if (model) {
      switch (model.name) {
        case APTIS:
          return 'MARKING'

        case IELTS:
          return 'BANDSCORE'

        default:
          return null
      }
    }
  }

  const getScore = () => {
    if (model) {
      switch (model.name) {
        case APTIS:
          return (
            <Text lighter color="muted" tag="h4">
              {t('FEEDBACK.score', { score: feedback.data.stats.marking })}
            </Text>
          )

        case IELTS:
          return (
            <Text lighter color="muted" tag="h4">
              {t('FEEDBACK.score', { score: feedback.data.stats.bandScore })}
            </Text>
          )

        default:
          return null
      }
    }
  }

  const chart = useMemo(() => {
    return {
      labels: [t('FEEDBACK.graphics.total'), t('FEEDBACK.graphics.points')],
      datasets: [
        {
          label: 'Feedback',
          data: [feedback.data.stats.total, feedback.data.progress.score],
          backgroundColor: [TURQUOISE, BLUE],
          hoverBackground: [BLUE, BLUE],
          borderWidth: 1
        }
      ]
    }
  }, [t, feedback])

  return (
    <React.Fragment>
      <div className={styles.chart}>
        <Chart data={chart} />
      </div>
      <br />
      <Flex>
        <Text bold color="turquoise" tag="h5">
          <Text className={styles.text} color="blue" tag="span">
            {feedback.data.progress.score}

          </Text>
          <Text className={styles.text} color="dark" tag="span">
            /
          </Text>
          {feedback.data.stats.total}
        </Text>
      </Flex>
      <Text center dunkin color="blue" tag="h5">
        {getTitle()}
      </Text>
      <Flex>{getScore()}</Flex>
      <Confetti width={width / 1} height={height / 1} />
    </React.Fragment>
  )
}

export default Details

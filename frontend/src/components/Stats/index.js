import React, { useMemo } from 'react'
import clone from 'clone'
import classNames from 'clsx'
import { useHistory } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { ic_chevron_right } from 'react-icons-kit/md/ic_chevron_right'
import { Line } from 'react-chartjs-2'

import useCategories from 'hooks/useCategories'
import useStats from 'hooks/useStats'
import useModels from 'hooks/useModels'


import Tabs from 'components/Tabs'



import Icon from 'react-icons-kit'
import Text from 'components/Text'

import styles from './index.module.scss'
import PATH from 'utils/path'

import { APTIS, IELTS } from 'constant/models'
import { ellipsis } from 'utils/functions'


/**
 * @typedef {Object} StatsProps
 * @property {boolean} show
 * @property {boolean} categories
 */

const Stats = ({ show, categories: displayTabs }) => {
  const categories = useCategories()

  const stats = useStats()

  const history = useHistory()

  const { model } = useModels()

  const { t } = useTranslation()

  /**
   * @typedef {Object} ChartOptions
   * @property {import ('react-chartjs-2').ChartOptions} graphics
   *
   * @returns {ChartOptions}
   */
  const data = useMemo(() => {
    if (stats.data.chart) {
      const context = clone(stats.data.chart)

      Object.assign(context.datasets[0], {
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderCapStyle: 'butt',
        borderColor: 'rgba(75,192,192,1)',
        lineTension: 0.1,
        spanGaps: 1
      })

      context.labels[0] = `${t('DASHBOARD.stats.exam')} ${context.labels[0]}`

      return {
        yLabels: stats.data.labels,
        graphics: context,
        options: {
          scales: {
            yAxes: [
              {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return stats.data.labels[value]
                  }
                }
              }
            ]
          }
        }
      }
    }

    return {
      graphics: {
        labels: [],
        datasets: []
      },
      options: {
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    }
  }, [stats.data, t])

  const getCurrentStatsTile = () => {
    switch (model.name) {
      case APTIS:
        return 'Marking'

      case IELTS:
        return 'Bandscore'

      default:
        return 'General'
    }
  }

  const handleViewAll = () => {
    history.push({
      pathname: PATH.STATS,
      state: {
        fetch: false
      }
    })
  }


  const renderTabsContent = useMemo(() => {
    const data = {
      labels: [],
      datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    return categories.data.map((category, index) => ({
      title: ellipsis(category.name, 0, 10),
      component: <Line options={data} />,
      eventKey: index.toString()
    }))
  }, [categories.data])

  return (
    <div className={classNames(styles.border, 'border')}>
      {displayTabs ? (
        <Tabs content={renderTabsContent} />
      ) : (
        <>
          <div className={styles.text}>
            {model && (
              <Text center bold tag="h3">
                {getCurrentStatsTile()}
              </Text>
            )}
          </div>
          <div className={classNames(styles.container, styles.chartsize)}>
            <Line data={data.graphics} options={data.options} />
          </div>
        </>
      )}
      {show && (
        <div className={styles.text}>
          <Text hovered bold tag="h5" onClick={handleViewAll}>
            <Trans i18nKey="DASHBOARD.stats.see" />{' '}
            <Icon size={24} icon={ic_chevron_right} />
          </Text>
        </div>
      )}
    </div>
  )
}

Stats.defaultProps = {
  show: true
}

export default Stats

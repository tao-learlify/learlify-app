import React, { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Line } from 'react-chartjs-2'
import {
  ArrowUp,
  ChartBar,
  CheckCircle,
  Exam,
  Medal,
  Sparkle,
  Target,
  Trophy
} from '@phosphor-icons/react'

import useModels from 'hooks/useModels'
import useStats from 'hooks/useStats'
import usePage from 'hooks/usePage'
import useAuthProvider from 'hooks/useAuthProvider'

import Template from 'components/Template'
import { AppShell } from 'components/layout/AppShell'
import { SidebarNav } from 'components/layout/SidebarNav'
import { Card } from 'components/ui'
import Evaluations from 'components/Evaluations'

import { fetchEvaluationsThunk } from 'store/@thunks/evaluations'

import styles from './stats.module.scss'

const CEFR_NAMES = {
  C1: 'Advanced',
  B2: 'Upper Intermediate',
  B1: 'Intermediate',
  A2: 'Elementary',
  A1: 'Beginner'
}

const CAT_META = {
  'Grammar & Vocabulary': { icon: 'Aa', hex: '#7C3AED' },
  Listening: { icon: 'Li', hex: '#1CB0F6' },
  Reading: { icon: 'Re', hex: '#58A700' },
  Writing: { icon: 'Wr', hex: '#F59E0B' },
  Speaking: { icon: 'Sp', hex: '#EA2B2B' },
  Overall: { icon: 'Ov', hex: '#58CC02' }
}

const CHART_COLORS = [
  '#58CC02',
  '#1CB0F6',
  '#FFC800',
  '#7C3AED',
  '#F59E0B',
  '#EA2B2B'
]

const EMPTY_SUMMARY = {
  examsTaken: 0,
  latestLevel: 'N/A',
  bestLevel: 'N/A'
}

function isEmptyLevel(value) {
  return value == null || value === '' || value === 'N/A'
}

function joinClasses(...classNames) {
  return classNames.filter(Boolean).join(' ')
}

function SkeletonLine({ className }) {
  return <span className={joinClasses(styles.skeletonLine, className)} />
}

function StatsHeader({
  t,
  firstName,
  loading,
  hasData,
  cefr,
  cefrLabel,
  bestLevel
}) {
  const subtitle = firstName
    ? t('STATS.subtitle', {
        defaultValue: 'Track your learning journey, {{name}}',
        name: firstName
      })
    : t('STATS.subtitleGeneric', {
        defaultValue: 'Track your learning journey'
      })

  return (
    <header className={styles.header}>
      <div className={styles.headerText}>
        <span className={styles.headerEyebrow}>
          <Sparkle size={16} weight="fill" aria-hidden="true" />
          {t('STATS.headerEyebrow', { defaultValue: 'Learning progress' })}
        </span>
        <h1 className={styles.title}>
          {t('STATS.title', { defaultValue: 'Stats & Evaluations' })}
        </h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <aside
        className={styles.headerAccent}
        aria-label={t('STATS.currentLevel', { defaultValue: 'Current level' })}
      >
        <div className={styles.headerAccentIcon} aria-hidden="true">
          <Medal size={28} weight="fill" />
        </div>
        <div className={styles.headerAccentText}>
          <span className={styles.headerAccentLabel}>
            {hasData
              ? t('STATS.currentLevel', { defaultValue: 'Current level' })
              : t('STATS.firstMilestone', { defaultValue: 'First milestone' })}
          </span>
          {loading ? (
            <SkeletonLine className={styles.headerAccentSkeleton} />
          ) : (
            <span className={styles.headerAccentValue}>
              {hasData ? cefr : 'N/A'}
            </span>
          )}
          <span className={styles.headerAccentHint}>
            {hasData
              ? cefrLabel
              : t('STATS.completeFirstExam', {
                  defaultValue: 'Complete your first exam'
                })}
          </span>
        </div>
        {hasData && !isEmptyLevel(bestLevel) && bestLevel !== cefr && (
          <span className={styles.headerBestBadge}>
            <ArrowUp size={14} weight="bold" aria-hidden="true" />
            {t('STATS.bestShort', {
              defaultValue: 'Best: {{level}}',
              level: bestLevel
            })}
          </span>
        )}
      </aside>
    </header>
  )
}

function StatsKpiCard({ icon, label, value, helper, tone, loading }) {
  const displayValue = isEmptyLevel(value) ? 'N/A' : value

  return (
    <article className={joinClasses(styles.kpiCard, styles[`kpi${tone}`])}>
      <div className={styles.kpiTopRow}>
        <span className={styles.kpiIcon} aria-hidden="true">
          {icon}
        </span>
        <span className={styles.kpiAccentDot} aria-hidden="true" />
      </div>
      {loading ? (
        <>
          <SkeletonLine className={styles.kpiValueSkeleton} />
          <SkeletonLine className={styles.kpiLabelSkeleton} />
          <SkeletonLine className={styles.kpiHelperSkeleton} />
        </>
      ) : (
        <>
          <strong
            className={joinClasses(
              styles.kpiValue,
              isEmptyLevel(value) && styles.kpiValueEmpty
            )}
          >
            {displayValue}
          </strong>
          <span className={styles.kpiLabel}>{label}</span>
          <span className={styles.kpiHelper}>{helper}</span>
        </>
      )}
    </article>
  )
}

function StatsKpiGrid({ t, summary, loading }) {
  const latestIsEmpty = isEmptyLevel(summary.latestLevel)
  const bestIsEmpty = isEmptyLevel(summary.bestLevel)

  const cards = [
    {
      key: 'examsTaken',
      label: t('STATS.examsTaken', { defaultValue: 'Exams taken' }),
      value: summary.examsTaken,
      helper:
        Number(summary.examsTaken) > 0
          ? t('STATS.examsTakenHelpActive', {
              defaultValue: 'Completed Aptis attempts'
            })
          : t('STATS.examsTakenHelpEmpty', {
              defaultValue: 'Your first result will appear here'
            }),
      icon: <Exam size={26} weight="fill" />,
      tone: 'Green'
    },
    {
      key: 'latestLevel',
      label: t('STATS.latestLevel', { defaultValue: 'Latest level' }),
      value: summary.latestLevel,
      helper: latestIsEmpty
        ? t('STATS.completeFirstExam', {
            defaultValue: 'Complete your first exam'
          })
        : t('STATS.latestLevelHelpActive', {
            defaultValue: 'Most recent exam result'
          }),
      icon: <ChartBar size={26} weight="fill" />,
      tone: 'Blue'
    },
    {
      key: 'bestLevel',
      label: t('STATS.bestLevel', { defaultValue: 'Best level' }),
      value: summary.bestLevel,
      helper: bestIsEmpty
        ? t('STATS.completeFirstExam', {
            defaultValue: 'Complete your first exam'
          })
        : t('STATS.bestLevelHelpActive', {
            defaultValue: 'Your strongest result so far'
          }),
      icon: <Trophy size={26} weight="fill" />,
      tone: 'Gold'
    }
  ]

  return (
    <div className={styles.statsGrid}>
      {cards.map(card => (
        <StatsKpiCard key={card.key} {...card} loading={loading} />
      ))}
    </div>
  )
}

function ProgressSkeleton() {
  return (
    <div className={styles.progressSkeleton} aria-hidden="true">
      <div className={styles.progressSkeletonChart}>
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className={styles.breakdownSkeleton}>
        <SkeletonLine />
        <SkeletonLine />
        <SkeletonLine />
      </div>
    </div>
  )
}

function ProgressEmptyState({ t }) {
  return (
    <div className={styles.emptyChart} role="status">
      <div className={styles.emptyIllustration} aria-hidden="true">
        <Target size={34} weight="fill" />
        <span className={styles.emptySparkOne} />
        <span className={styles.emptySparkTwo} />
      </div>
      <div className={styles.emptyTextGroup}>
        <h3>
          {t('STATS.noDataTitle', {
            defaultValue: 'Your progress graph is ready'
          })}
        </h3>
        <p>
          {t('STATS.noData', {
            defaultValue: 'Complete an exam to see your progress.'
          })}
        </p>
      </div>
    </div>
  )
}

function SkillBreakdown({ t, categoryBreakdown }) {
  if (categoryBreakdown.length === 0) return null

  return (
    <div className={styles.breakdown}>
      <h3 className={styles.breakdownTitle}>
        <Sparkle size={18} weight="fill" aria-hidden="true" />
        {t('STATS.latestBreakdown', { defaultValue: 'Latest per skill' })}
      </h3>
      <div className={styles.breakdownList}>
        {categoryBreakdown.map(cat => (
          <div
            key={cat.label}
            className={styles.breakdownItem}
            style={{ '--skill-color': cat.color }}
          >
            <span className={styles.breakdownIcon}>{cat.icon}</span>
            <span className={styles.breakdownLabel}>{cat.label}</span>
            <span className={styles.breakdownLevel}>{cat.level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProgressOverTimeCard({
  t,
  loading,
  hasChartData,
  chartData,
  chartOptions,
  categoryBreakdown
}) {
  return (
    <Card elevated className={styles.progressCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleGroup}>
          <span className={styles.sectionIcon} aria-hidden="true">
            <ChartBar size={24} weight="fill" />
          </span>
          <div>
            <h2 className={styles.sectionTitle}>
              {t('STATS.progressOverTime', {
                defaultValue: 'Progress over time'
              })}
            </h2>
            <p className={styles.sectionSubtitle}>
              {t('STATS.progressSubtitle', {
                defaultValue:
                  'See how your Aptis level changes after each exam.'
              })}
            </p>
          </div>
        </div>
        <span className={styles.sectionBadge}>
          <CheckCircle size={16} weight="fill" aria-hidden="true" />
          {t('STATS.cefrTimeline', { defaultValue: 'CEFR timeline' })}
        </span>
      </div>

      {loading ? (
        <ProgressSkeleton />
      ) : hasChartData ? (
        <>
          <div className={styles.chartWrap}>
            <Line data={chartData} options={chartOptions} />
          </div>
          <SkillBreakdown t={t} categoryBreakdown={categoryBreakdown} />
        </>
      ) : (
        <ProgressEmptyState t={t} />
      )}
    </Card>
  )
}

const StatsView = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const user = useAuthProvider()
  const EP = usePage()
  const { fetchStats, loading, data: statsData } = useStats()
  const { model } = useModels()
  const firstName = user?.profile?.firstName

  useEffect(() => {
    if (model) {
      dispatch(
        fetchEvaluationsThunk({
          page: EP.page,
          model: model.name,
          own: false
        })
      )
    }
  }, [dispatch, EP.page, model])

  useEffect(() => fetchStats(), [fetchStats])

  const summary = statsData?.summary || EMPTY_SUMMARY
  const cefr = statsData?.cefr || 'N/A'
  const cefrLabel =
    statsData?.cefrLabel ||
    CEFR_NAMES[cefr] ||
    t('STATS.noDataYet', { defaultValue: 'No data yet' })
  const hasData = Number(summary.examsTaken) > 0
  const showStatsSkeleton = loading && !statsData?.summary

  const { chartData, chartOptions, hasChartData } = useMemo(() => {
    const datasets = statsData?.chart?.datasets || []
    const examLabels = statsData?.chart?.labels || []
    const labelMap = statsData?.labels || {}

    const numericDatasets = datasets.map((dataset, index) => {
      const color =
        dataset.label === 'Overall'
          ? CHART_COLORS[0]
          : CHART_COLORS[(index + 1) % CHART_COLORS.length]

      return {
        ...dataset,
        data: (dataset.data || []).map(value =>
          value != null ? Number(value) : undefined
        ),
        fill: false,
        borderColor: color,
        backgroundColor: color,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: color,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#FFFFFF',
        pointRadius: dataset.label === 'Overall' ? 4 : 3,
        pointHoverRadius: 6,
        borderWidth: dataset.label === 'Overall' ? 3 : 2,
        lineTension: 0.35,
        spanGaps: true
      }
    })

    const labelEntries = Object.entries(labelMap).map(([key, value]) => [
      Number(key),
      value
    ])
    labelEntries.sort((first, second) => first[0] - second[0])

    const data = {
      labels: examLabels,
      datasets: numericDatasets
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: numericDatasets.length > 1,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 18,
          fontColor: '#777777',
          fontFamily: 'Varela Round',
          fontSize: 12
        }
      },
      tooltips: {
        backgroundColor: 'rgba(75, 75, 75, 0.96)',
        titleFontFamily: 'Varela Round',
        bodyFontFamily: 'Varela Round',
        cornerRadius: 12,
        xPadding: 12,
        yPadding: 10,
        callbacks: {
          label: (tooltipItem, dataArg) => {
            const dataset = dataArg.datasets[tooltipItem.datasetIndex]
            const labelKey = tooltipItem.yLabel
            if (labelKey == null) return `${dataset.label}: N/A`
            const cefrTag = labelMap[labelKey] || labelKey
            return `${dataset.label}: ${cefrTag}`
          }
        }
      },
      scales: {
        yAxes: [
          {
            type: 'linear',
            ticks: {
              min: labelEntries.length > 0 ? labelEntries[0][0] : 0,
              max:
                labelEntries.length > 0
                  ? labelEntries[labelEntries.length - 1][0]
                  : 8,
              stepSize:
                labelEntries.length > 1
                  ? labelEntries[1][0] - labelEntries[0][0]
                  : 1,
              callback: value => labelMap[value] || '',
              fontColor: '#777777',
              fontFamily: 'Varela Round',
              fontSize: 12,
              padding: 8
            },
            gridLines: {
              color: 'rgba(75, 75, 75, 0.08)',
              zeroLineColor: 'rgba(75, 75, 75, 0.08)',
              drawBorder: false
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              fontColor: '#777777',
              fontFamily: 'Varela Round',
              fontSize: 12,
              maxRotation: 0,
              autoSkipPadding: 18
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }
        ]
      }
    }

    return {
      chartData: data,
      chartOptions: options,
      hasChartData: numericDatasets.some(dataset =>
        dataset.data.some(value => value != null && !Number.isNaN(value))
      )
    }
  }, [statsData])

  const categoryBreakdown = useMemo(() => {
    const datasets = statsData?.chart?.datasets || []
    const labelMap = statsData?.labels || {}

    return datasets
      .filter(dataset => dataset.label !== 'Overall')
      .map(dataset => {
        const values = [...(dataset.data || [])].filter(value => value != null)
        const lastValue = values.pop()
        const meta = CAT_META[dataset.label] || { icon: 'Sk', hex: '#777777' }

        return {
          label: dataset.label,
          icon: meta.icon,
          color: meta.hex,
          level: lastValue != null ? labelMap[lastValue] || 'N/A' : 'N/A'
        }
      })
      .filter(category => category.level !== 'N/A')
  }, [statsData])

  return (
    <Template withNavbar={false} withLoader={false} withVideos>
      <AppShell hasSidebar sidebar={<SidebarNav />}>
        <main className={styles.page}>
          <StatsHeader
            t={t}
            firstName={firstName}
            loading={showStatsSkeleton}
            hasData={hasData}
            cefr={cefr}
            cefrLabel={cefrLabel}
            bestLevel={summary.bestLevel}
          />

          <StatsKpiGrid t={t} summary={summary} loading={showStatsSkeleton} />

          <ProgressOverTimeCard
            t={t}
            loading={showStatsSkeleton}
            hasChartData={hasChartData}
            chartData={chartData}
            chartOptions={chartOptions}
            categoryBreakdown={categoryBreakdown}
          />

          <section
            className={styles.historySection}
            aria-labelledby="exam-history-title"
          >
            <div className={styles.historyHeader}>
              <div>
                <h2 id="exam-history-title" className={styles.historyTitle}>
                  {t('STATS.examHistory', { defaultValue: 'Exam history' })}
                </h2>
                <p className={styles.historySubtitle}>
                  {t('STATS.examHistorySubtitle', {
                    defaultValue:
                      'Review your evaluation feedback as it arrives.'
                  })}
                </p>
              </div>
            </div>
            <Evaluations onRenderPage={EP.handleSet} />
          </section>
        </main>
      </AppShell>
    </Template>
  )
}

export default StatsView

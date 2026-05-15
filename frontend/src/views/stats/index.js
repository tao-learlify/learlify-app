import React, { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Line } from 'react-chartjs-2'
import {
  ChartBar,
  Exam,
  Trophy,
  Medal,
  Sparkle,
  ArrowUp,
} from '@phosphor-icons/react'

import useModels from 'hooks/useModels'
import useStats from 'hooks/useStats'
import usePage from 'hooks/usePage'
import useAuthProvider from 'hooks/useAuthProvider'

import Template from 'components/Template'
import { AppShell } from 'components/layout/AppShell'
import { SidebarNav } from 'components/layout/SidebarNav'
import { StatCard, Card } from 'components/ui'
import Evaluations from 'components/Evaluations'

import { fetchEvaluationsThunk } from 'store/@thunks/evaluations'

import styles from './stats.module.scss'

/* ── CEFR display names ────────────────────────────────────────────────────── */
const CEFR_NAMES = {
  C1: 'Advanced',
  B2: 'Upper Intermediate',
  B1: 'Intermediate',
  A2: 'Elementary',
  A1: 'Beginner',
}

/* ── Category icon & colour mapping ────────────────────────────────────────── */
const CAT_META = {
  'Grammar & Vocabulary': { icon: '📝', hex: '#6366f1' },
  Listening:              { icon: '🎧', hex: '#3b82f6' },
  Reading:                { icon: '📖', hex: '#10b981' },
  Writing:                { icon: '✍️', hex: '#f59e0b' },
  Speaking:               { icon: '🎙️', hex: '#ef4444' },
  Overall:                { icon: '⭐', hex: '#8b5cf6' },
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
      dispatch(fetchEvaluationsThunk({
        page: EP.page,
        model: model.name,
        own: false,
      }))
    }
  }, [dispatch, EP.page, model])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  /* ── Derived data ────────────────────────────────────────────────────────── */
  const cefr    = statsData?.cefr || 'N/A'
  const cefrLabel = statsData?.cefrLabel || 'No data yet'
  const summary = statsData?.summary || { examsTaken: 0, latestLevel: 'N/A', bestLevel: 'N/A' }

  /* ── Build chart config ──────────────────────────────────────────────────── */
  const { chartData, chartOptions } = useMemo(() => {
    const datasets = statsData?.chart?.datasets || []
    const examLabels = statsData?.chart?.labels || []
    const labelMap = statsData?.labels || {}

    // Convert "0"|"2"|"4"|"6"|"8" strings → numbers, keep undefined as-is
    const numericDatasets = datasets.map(ds => ({
      ...ds,
      data: (ds.data || []).map((v) => (v != null ? Number(v) : undefined)),
    }))

    // Build Y-axis tick labels from labelMap
    const labelEntries = Object.entries(labelMap).map(
      ([k, v]) => [Number(k), v]
    )
    labelEntries.sort((a, b) => a[0] - b[0])

    const data = {
      labels: examLabels,
      datasets: numericDatasets,
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: { size: 12 },
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const labelKey = ctx.raw
              if (labelKey == null) return `${ctx.dataset.label}: —`
              const cefrTag = labelMap[labelKey] || labelKey
              return `${ctx.dataset.label}: ${cefrTag}`
            },
          },
        },
      },
      scales: {
        y: {
          type: 'linear',
          min: labelEntries.length > 0 ? labelEntries[0][0] : 0,
          max: labelEntries.length > 0 ? labelEntries[labelEntries.length - 1][0] : 8,
          ticks: {
            stepSize: labelEntries.length > 1 ? labelEntries[1][0] - labelEntries[0][0] : 1,
            callback: (value) => labelMap[value] || '',
            font: { size: 11, weight: '600' },
          },
          grid: { color: 'rgba(0,0,0,0.06)' },
        },
        x: {
          grid: { display: false },
        },
      },
    }

    return { chartData: data, chartOptions: options }
  }, [statsData])

  /* ── Per-category latest scores for the breakdown card ───────────────────── */
  const categoryBreakdown = useMemo(() => {
    const datasets = statsData?.chart?.datasets || []
    const labelMap = statsData?.labels || {}
    return datasets
      .filter(ds => ds.label !== 'Overall')
      .map(ds => {
        const lastVal = [...(ds.data || [])].filter(Boolean).pop()
        const meta = CAT_META[ds.label] || { icon: '📋', hex: '#6b7280' }
        return {
          label: ds.label,
          icon: meta.icon,
          color: meta.hex,
          level: lastVal != null ? labelMap[lastVal] || '—' : '—',
        }
      })
      .filter(c => c.level !== '—')
  }, [statsData])

  const hasData = summary.examsTaken > 0

  return (
    <Template withNavbar={false} withLoader={loading} withVideos>
      <AppShell hasSidebar sidebar={<SidebarNav />}>
        <div className={styles.page}>
          {/* ── Header ──────────────────────────────────────────────────── */}
          <header className={styles.header}>
            <div className={styles.headerText}>
              <h1 className={styles.title}>
                {t('STATS.title', { defaultValue: 'Stats & Progress' })}
              </h1>
              <p className={styles.subtitle}>
                {firstName
                  ? t('STATS.subtitle', { defaultValue: 'Track your learning journey, {{name}}', name: firstName })
                  : t('STATS.subtitleGeneric', { defaultValue: 'Track your learning journey' })}
              </p>
            </div>
          </header>

          {/* ── CEFR Level badge ────────────────────────────────────────── */}
          {hasData && (
            <div className={styles.cefrBanner}>
              <div className={styles.cefrBadge}>
                <Medal size={32} weight="fill" className={styles.cefrIcon} />
                <span className={styles.cefrLevel}>{cefr}</span>
              </div>
              <div className={styles.cefrText}>
                <span className={styles.cefrName}>{CEFR_NAMES[cefr] || cefr}</span>
                <span className={styles.cefrHint}>Your current English level</span>
              </div>
              {summary.bestLevel !== 'N/A' && summary.bestLevel !== cefr && (
                <div className={styles.cefrBest}>
                  <ArrowUp size={16} weight="bold" />
                  <span>Best: {summary.bestLevel}</span>
                </div>
              )}
            </div>
          )}

          {/* ── Summary cards ───────────────────────────────────────────── */}
          <div className={styles.statsGrid}>
            <StatCard
              label={t('STATS.examsTaken', { defaultValue: 'Exams taken' })}
              metric={summary.examsTaken}
              icon={<Exam size={28} weight="fill" />}
              variant="accent"
            />
            <StatCard
              label={t('STATS.latestLevel', { defaultValue: 'Latest level' })}
              metric={summary.latestLevel}
              icon={<ChartBar size={28} weight="fill" />}
              variant="default"
            />
            <StatCard
              label={t('STATS.bestLevel', { defaultValue: 'Best level' })}
              metric={summary.bestLevel}
              icon={<Trophy size={28} weight="fill" />}
              variant="success"
            />
          </div>

          {/* ── Progress chart ──────────────────────────────────────────── */}
          <Card elevated padding="md" className={styles.fullWidth}>
            <div className={styles.cardHeader}>
              <ChartBar size={24} weight="fill" className={styles.cardHeaderIcon} />
              <h2 className={styles.cardHeaderTitle}>
                {t('STATS.progressOverTime', { defaultValue: 'Progress over time' })}
              </h2>
            </div>
            {hasData ? (
              <>
                <div className={styles.chartWrap}>
                  <Line data={chartData} options={chartOptions} />
                </div>

                {/* Per-category breakdown */}
                {categoryBreakdown.length > 0 && (
                  <div className={styles.breakdown}>
                    <h5 className={styles.breakdownTitle}>
                      <Sparkle size={18} weight="fill" />
                      {t('STATS.latestBreakdown', { defaultValue: 'Latest per skill' })}
                    </h5>
                    <div className={styles.breakdownList}>
                      {categoryBreakdown.map(cat => (
                        <div key={cat.label} className={styles.breakdownItem}>
                          <span className={styles.breakdownIcon}>{cat.icon}</span>
                          <span className={styles.breakdownLabel}>{cat.label}</span>
                          <span
                            className={styles.breakdownLevel}
                            style={{ color: cat.color }}
                          >
                            {cat.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyChart}>
                <ChartBar size={48} weight="thin" />
                <p>{t('STATS.noData', { defaultValue: 'Complete an exam to see your progress' })}</p>
              </div>
            )}
          </Card>

          {/* ── Evaluations table ────────────────────────────────────────── */}
          <div className={styles.tableSection}>
            <h3 className={styles.tableSectionTitle}>
              {t('STATS.examHistory', { defaultValue: 'Exam history' })}
            </h3>
            <div className={styles.domainBlock}>
              <Evaluations onRenderPage={EP.handleSet} />
            </div>
          </div>
        </div>
      </AppShell>
    </Template>
  )
}

export default StatsView

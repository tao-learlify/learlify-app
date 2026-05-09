/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAuthProvider from 'hooks/useAuthProvider'
import useCategories from 'hooks/useCategories'
import useEvaluations from 'hooks/useEvaluations'
import useExams from 'hooks/useExams'
import useStats from 'hooks/useStats'
import useModels from 'hooks/useModels'
import useOffers from 'hooks/useOffers'
import usePage from 'hooks/usePage'
import useLearningPathWithSchema from 'hooks/useLearningPathWithSchema'

/* ── Infrastructure shell (NetworkStatus + Videos + loader — keep) ───────────── */
import Template from 'components/Template'

/* ── New DS layout ───────────────────────────────────────────────────────────── */
import { AppShell } from 'components/layout/AppShell'
import { SidebarNav } from 'components/layout/SidebarNav'

/* ── New DS product components ───────────────────────────────────────────────── */
import WelcomeHeader from './components/WelcomeHeader'

import { fetchEvaluationsThunk } from 'store/@thunks/evaluations'

import { buildUnitPath } from 'utils/courseParams'
import styles from './dashboard.module.scss'
import { LearningPath, ProgressGraph, ExamQueue } from 'components/ui'

const UserView = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const categories = useCategories()
  const { fetchExams, ...exams } = useExams()
  const { fetchStats, ...stats } = useStats()
  const { fetchOffers, ...offers } = useOffers()
  const { fetchEvaluations, ...evaluations } = useEvaluations()
  const { page } = usePage()
  const { model } = useModels()
  const user = useAuthProvider()

  const {
    units: pathUnits,
    courseTitle: pathCourseTitle,
    courseId: pathCourseId,
    loading: pathLoading
  } = useLearningPathWithSchema(exams.data)

  useEffect(fetchOffers, [fetchOffers])
  useEffect(fetchExams, [fetchExams])
  useEffect(fetchStats, [fetchStats])

  useEffect(() => {
    if (model) {
      dispatch(
        fetchEvaluationsThunk({
          own: false,
          page,
          model: model.name
        })
      )
    }
  }, [page, model])

  const firstName = user?.profile?.firstName
  const streak = user?.profile?.streak ?? stats?.data?.streak

  // ── DEBUG ────────────────────────────────────────────────────────────────
  console.group('[Dashboard] render')
  console.log('model:', model)
  console.log('user.profile:', user?.profile)
  console.log('stats  :', { loading: stats.loading, data: stats.data })
  console.log('exams  :', { loading: exams.loading, data: exams.data?.length })
  console.log('offers :', {
    loading: offers.loading,
    data: offers.data?.length
  })
  console.log('evals  :', { loading: evaluations.loading })
  console.log('cats   :', { loading: categories.loading })
  console.log('path   :', { loading: pathLoading, units: pathUnits?.length })
  console.groupEnd()
  // ────────────────────────────────────────────────────────────────────────

  return (
    /*
     * Template is kept ONLY for:
     *   - NetworkStatus (online/offline event dispatch)
     *   - withVideos (video panel at bottom)
     *   - withLoader (full-page GooSpinner — only shown when ALL data loads)
     *
     * withNavbar=false → kills the blue Bootstrap navbar entirely.
     * AppShell + SidebarNav replace it with the new DS shell.
     */
    <Template
      withNavbar={false}
      withLoader={
        stats.loading || exams.loading || evaluations.loading || offers.loading
      }
      withVideos
    >
      <AppShell hasSidebar sidebar={<SidebarNav />}>
        <div className={styles.page}>
          {/* ── 1. Dashboard header: greeting + stat pills ────────── */}
          <WelcomeHeader
            firstName={firstName}
            streak={streak}
            totalXP={user?.profile?.xp}
            className={styles.welcomeHeader}
          />

          {/* ── 2. Main 2-column layout ───────────────────────────── */}
          <section className={styles.mainSection}>
            <div className={styles.mainGrid}>
              {/* ── LEFT — sidebar: exam queue ───────────────────────── */}
              <div className={styles.mainRight}>
                <ExamQueue
                  onStart={exam => history.push(`/exam/${exam.examId}`)}
                  onUnlock={_exam => history.push('/plans')}
                />
                <ProgressGraph className={styles.pathProgressGraph} />
              </div>

              {/* ── RIGHT — journey column: path + level progress ────── */}
              <div className={styles.mainLeft}>
                <LearningPath
                  showHeader={false}
                  courseTitle={pathCourseTitle}
                  units={pathUnits}
                  loading={pathLoading}
                  streak={streak ?? 7}
                  totalXP={user?.profile?.xp ?? 420}
                  onUnitClick={unit =>
                    history.push(
                      buildUnitPath(
                        pathCourseId ?? 1,
                        unit.unitOrder ?? unit.id
                      )
                    )
                  }
                  onLockedUnitClick={() => history.push('/plans')}
                />
              </div>
            </div>
          </section>
        </div>
      </AppShell>
    </Template>
  )
}

export default UserView

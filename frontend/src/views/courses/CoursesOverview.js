/**
 * CoursesOverview
 * 
 * Main course navigation view showing all units with progress
 * Combines:
 *   - useLearningPathWithSchema hook (enriched progress + schema data)
 *   - CourseUnitsGrid component (visual grid display)
 *   - Header with course info
 */

import React from 'react'
import { useHistory } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'

import useLearningPathWithSchema from 'hooks/useLearningPathWithSchema'
import useExams from 'hooks/useExams'
import useAuthProvider from 'hooks/useAuthProvider'
import Template from 'components/Template'
import FallbackMode from 'components/FallbackMode'
import CourseUnitsGrid from 'components/CourseUnitsGrid'

import styles from './CoursesOverview.module.scss'

const CoursesOverview = () => {
  const history = useHistory()
  const user = useAuthProvider()
  const { data: exams } = useExams()

  const {
    units = [],
    courseTitle,
    courseId,
    totalSections,
    completedSections,
    loading,
    error
  } = useLearningPathWithSchema(exams)

  // Use defaults if no data
  const displayTotalSections = totalSections || 15
  const displayCourseTitle = courseTitle || 'English Path'
  const displayCourseId = courseId || 1
  const displayCompletedSections = completedSections || 0
  const progressPercent = displayTotalSections > 0 ? Math.round((displayCompletedSections / displayTotalSections) * 100) : 0

  console.log('CoursesOverview:', {
    unitsCount: units.length,
    courseTitle: displayCourseTitle,
    loading,
    error,
    totalSections: displayTotalSections,
    completedSections: displayCompletedSections
  })

  if (error) {
    return (
      <Template withNavbar>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Error Loading Courses</h2>
            <p>Unable to load course data. Please try again later.</p>
            <button onClick={() => history.goBack()} className={styles.backButton}>
              ← Go Back
            </button>
          </div>
        </div>
      </Template>
    )
  }

  return (
    <Template withNavbar withLoader={loading}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <button
              onClick={() => history.push('/dashboard')}
              className={styles.backBtn}
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={20} weight="bold" />
            </button>

            <div className={styles.titleGroup}>
              <h1 className={styles.pageTitle}>{displayCourseTitle}</h1>
              <p className={styles.subtitle}>
                {displayCompletedSections} of {displayTotalSections} units completed
              </p>
            </div>

            {user && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.profile?.firstName}</span>
                <span className={styles.xpBadge}>
                  {user.profile?.xp || 0} XP
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={styles.progressLabel}>{progressPercent}%</span>
          </div>
        </header>

        {/* Main Content */}
        {units.length > 0 ? (
          <CourseUnitsGrid units={units} courseId={displayCourseId} />
        ) : !loading ? (
          <FallbackMode
            title="No Units Available"
            description="Course units are not available yet. Please check back later."
            action={{
              label: 'Back to Dashboard',
              onClick: () => history.push('/dashboard')
            }}
          />
        ) : null}
      </div>
    </Template>
  )
}

export default CoursesOverview

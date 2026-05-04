/**
 * CoursesOverview
 * 
 * Main course navigation view showing all units with progress
 * Combines:
 *   - useLearningPathWithSchema hook (enriched progress + schema data)
 *   - CourseUnitsGrid component (visual grid display)
 *   - Header with course info
 */

import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ArrowLeft, X } from '@phosphor-icons/react'

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
    error
  } = useLearningPathWithSchema(exams)

  // Use defaults if no data
  const displayTotalSections = totalSections || 15
  const displayCourseTitle = courseTitle || 'English Path'
  const displayCourseId = courseId || 1
  const displayCompletedSections = completedSections || 0
  const progressPercent = displayTotalSections > 0 ? Math.round((displayCompletedSections / displayTotalSections) * 100) : 0

  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const handleLockedUnitClick = () => {
    setShowUpgradeModal(true)
  }

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
          <CourseUnitsGrid units={units} courseId={displayCourseId} onLockedUnitClick={handleLockedUnitClick} />
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

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center tw:bg-black/50">
          <div className="tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:max-w-lg tw:w-full tw:mx-4 tw:p-8 tw:relative">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="tw:absolute tw:top-4 tw:right-4 tw:p-2 tw:rounded-full hover:tw:bg-gray-100 tw:cursor-pointer"
            >
              <X size={20} weight="bold" />
            </button>

            <div className="tw:text-center tw:mb-6">
              <span className="tw:text-4xl tw:mb-2 tw:block">🔒</span>
              <h2 className="tw:text-2xl tw:font-extrabold tw:text-gray-900">
                Upgrade to Access This Unit
              </h2>
              <p className="tw:text-gray-500 tw:mt-2">
                Subscribe to unlock all 15 units and get unlimited access to all course content, exams, and progress tracking.
              </p>
            </div>

            <div className="tw:space-y-3 tw:mb-6">
              {[
                { name: 'Go', price: '€15', desc: 'Basic access to all units' },
                { name: 'Silver', price: '€24', desc: 'Full course + exams + reviews' },
                { name: 'Gold', price: '€29', desc: 'All features + speaking/writing feedback' },
              ].map((plan) => (
                <div key={plan.name} className="tw:flex tw:items-center tw:justify-between tw:p-4 tw:rounded-xl tw:border tw:border-gray-200 hover:tw:border-[#58CC02] hover:tw:shadow-md tw:transition-all tw:cursor-pointer" onClick={() => { setShowUpgradeModal(false); history.push('/plans') }}>
                  <div>
                    <h3 className="tw:font-bold tw:text-gray-900">{plan.name}</h3>
                    <p className="tw:text-sm tw:text-gray-500">{plan.desc}</p>
                  </div>
                  <span className="tw:text-xl tw:font-extrabold tw:text-[#58CC02]">{plan.price}<span className="tw:text-sm tw:font-normal">/mo</span></span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setShowUpgradeModal(false); history.push('/plans') }}
              className="tw:w-full tw:py-3 tw:px-6 tw:rounded-xl tw:bg-[#58CC02] tw:text-white tw:font-bold tw:text-lg hover:tw:bg-[#46A302] tw:transition-colors tw:cursor-pointer"
            >
              View All Plans
            </button>

            <p className="tw:text-center tw:text-xs tw:text-gray-400 tw:mt-4">
              Cancel anytime. No commitment required.
            </p>
          </div>
        </div>
      )}
    </Template>
  )
}

export default CoursesOverview

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
import usePricing from 'hooks/usePricing'
import Template from 'components/Template'
import FallbackMode from 'components/FallbackMode'
import CourseUnitsGrid from 'components/CourseUnitsGrid'
import BillingCycleToggle from 'views/plans/components/BillingCycleToggle'
import PricingPlanCard from 'views/plans/components/PricingPlanCard'
import PricingLegalNotice from 'views/plans/components/PricingLegalNotice'

import styles from './CoursesOverview.module.scss'

const CoursesOverview = () => {
  const history = useHistory()
  const user = useAuthProvider()
  const { data: exams } = useExams()
  const pricing = usePricing({ preload: true })

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

      {/* Upgrade Modal — same experience as /plans, without FAQ */}
      {showUpgradeModal && (
        <div className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-start tw:justify-center tw:pt-20 tw:bg-black/50 tw:overflow-y-auto" onClick={() => setShowUpgradeModal(false)}>
          <div className="tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:max-w-5xl tw:w-full tw:mx-4 tw:p-8 tw:relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="tw:absolute tw:top-4 tw:right-4 tw:p-2 tw:rounded-full hover:tw:bg-gray-100 tw:cursor-pointer tw:z-10"
            >
              <X size={20} weight="bold" />
            </button>

            {/* Pricing Hero */}
            <div className="tw:text-center tw:mb-8">
              <h1 className="tw:text-3xl tw:font-extrabold tw:text-gray-900">
                Unlock All Course Content
              </h1>
              <p className="tw:text-gray-500 tw:mt-2 tw:max-w-xl tw:mx-auto">
                Choose the plan that fits your learning goals. Get unlimited access to all 15 units, exams, and personalised feedback.
              </p>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="tw:flex tw:justify-center tw:mb-8">
              <BillingCycleToggle
                selected={pricing.selectedBillingCycle}
                onChange={pricing.setBillingCycle}
              />
            </div>

            {/* Pricing Plan Cards */}
            <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-3 tw:gap-6 tw:mb-8">
              {[...pricing.data]
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .slice(0, 3)
                .map(plan => (
                  <PricingPlanCard
                    key={plan.code || plan.id}
                    plan={plan}
                    selectedCycle={pricing.selectedBillingCycle}
                    popular={plan.code === 'aptis_pro'}
                    onSelect={() => { setShowUpgradeModal(false); history.push('/plans') }}
                  />
                ))}
            </div>

            {/* Legal Notice */}
            <PricingLegalNotice />

            {/* View all link */}
            <div className="tw:text-center">
              <button
                onClick={() => { setShowUpgradeModal(false); history.push('/plans') }}
                className="tw:text-[#58CC02] tw-font-bold hover:tw:underline tw:cursor-pointer"
              >
                View all plans and details →
              </button>
            </div>
          </div>
        </div>
      )}
    </Template>
  )
}

export default CoursesOverview

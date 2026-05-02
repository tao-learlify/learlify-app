/**
 * @param {AppState} store
 * @returns {number | null}
 */
export function selectorFromUseHttpError(store) {
  return {
    statusCode: store.http.statusCode,
    message: store.http.message
  }
}

/**
 * @param {AppState} store
 */
export function selectorFromUsePlans(store) {
  return {
    loading: store.plans.loadingPlans,
    plans: store.plans.plans
  }
}

export function selectorFromUseSchedule(store) {
  return {
    staged: store.classes.staged,
    loading: store.schedule.loading,
    schedules: store.schedule.commits
  }
}

/**
 * @param {AppState} store
 */
export function selectorFromUseRoles(store) {
  return {
    loading: store.roles.loading.roles,
    roles: store.roles.roles
  }
}

/**
 * @param {AppState} store
 */
export function selectorFromUseExams(store) {
  return {
    loading: store.exam.loadingExams,
    exams: store.exam.exams
  }
}

/**
 * @param {AppState} store
 */
export function selectorFromUsePackages(store) {
  return {
    loading: store.packages.loadingPackages,
    packages: store.packages.packages
  }
}

export function selectorFromUseServiceError(store) {
  return {
    error: store.errors.serviceError
  }
}

export function selectorFromUseStripe(store) {
  return {
    package: {
      done: store.packages.done,
      loading: store.packages.loadingPayment
    },
    gift: {
      done: store.gifts.success,
      loading: store.gifts.loading
    }
  }
}

/**
 * @param {AppState} store
 * @returns {{ isLoggedIn: boolean, profile: User, verification: boolean }}
 */
export function selectorFromUseAuth(store) {
  return {
    isLoggedIn: store.auth.isLoggedIn,
    profile: store.auth.userProfile,
    verification: store.auth.verification,
    demo: store.auth.demo
  }
}

/**
 * @param {AppState} store
 * @returns {import("store/reducers/notifications").NotificationState}
 */
export function selectorFromUseNotification(store) {
  return {
    event: store.notifications.event,
    message: store.notifications.message,
    notified: store.notifications.notified,
    type: store.notifications.type
  }
}


/**
 * @param {AppState} store
 * @returns {import ('store/reducers/classes').ClassesState} 
 */
export function selectorFromUseClasses (store) {
  return {
    loading: store.classes.loading,
    classRooms: store.classes.classRooms
  }
}

/**
 * @param {AppState} store 
 */
export function selectorFromUseCourses (store) {
  return {
    loading: store.courses.loading.courses,
    courses: store.courses.list
  }
}

/**
 * @param {AppState} store 
 */
export function selectorFromUseSession (store) {
  return store.session
}
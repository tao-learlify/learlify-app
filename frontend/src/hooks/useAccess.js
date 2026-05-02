const accesses = {
  EXAMS: 'EXAMS',
  COURSES: 'COURSES',
  EVALAUTIONS: 'EVALUATIONS',
  CLASSES: 'CLASSES'
}

function useAccess () {
  /**
   * @param {Plan}
   * @param {string []} features 
   * @returns 
   */
  const haveAccess  = ({ access }, features = []) => {
    if (access) {
      const controls = access.find(access => features.includes(access.feature))

      return controls ? controls : null
    }
    return null
  }

  return {
    accesses,
    haveAccess
  }
}

export default useAccess
import * as TYPE from './types'

/**
 * @param {User} teacher
 * @returns {import('store/actions/action').ActionCreator}
 */
function setTeacher(teacher) {
  return {
    type: TYPE.TEACHER_CHANGE,
    payload: teacher
  }
}

/**
 * @param {Language} language
 * @returns {import('store/actions/action').ActionCreator}
 */
function setLang(language) {
  return {
    type: TYPE.LANGUAGE_CHANGE,
    payload: language
  }
}

/**
 * @param {{}} meeting
 * @returns {import('store/actions/action').ActionCreator}
 */
function setMeeting(meeting) {
  return {
    type: TYPE.MEETING_CHANGE,
    payload: meeting
  }
}

export { setLang, setMeeting, setTeacher }

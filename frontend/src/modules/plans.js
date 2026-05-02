import PLANS from 'utils/plans'

const courses = [
  PLANS.APTIS,
  PLANS.DIAMOND,
  PLANS.GRANDMASTER,
  PLANS.MASTER,
]

const exams = [
  PLANS.GO,
  PLANS.GOLD,
  PLANS.GRANDMASTER,
  PLANS.MASTER,
  PLANS.PLATINUM,
  PLANS.RUBY,
  PLANS.SILVER
]

const classes = [
  PLANS.DIAMOND,
  PLANS.GRANDMASTER,
  PLANS.MASTER,
  PLANS.GREEN,
  PLANS.BLUE
]

export const getMembershipSubscriptionsNames = () => {
  return {
    classes,
    courses,
    exams
  }
}
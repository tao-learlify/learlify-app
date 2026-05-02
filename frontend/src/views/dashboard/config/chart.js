/**
 * @type {string}
 */
export const yAxisID = 'graph-axis'

/**
 * @typedef {object} yLabels
 */
export const yLabels = {
  8: 'C1',
  6: 'B2',
  4: 'B1',
  2: 'A2',
  0: 'A1'
}

const chartDashboard = Object.freeze({
  yLabels: {...yLabels},
  chartOptions: {
    global: {
      animation: true,
    }
  },  
  general: {
    label: 'Estadística general',
    fill: true,
    lineTension: 0.1,
    backgroundColor: 'rgba(75,192,192,0.4)',
    borderColor: 'rgba(75,192,192,1)',
    borderCapStyle: 'butt',
    spanGaps: 1,
    yAxisID,
  },
  asCategory: {
    fill: true,
    lineTension: 0.01,
    backgroundColor: 'rgba(74, 191, 88, 0.4)',
    borderColor: 'rgba(74, 191, 129, 1)',
    spanGaps: 1,
    yAxisID
  }
})

export default chartDashboard
import HtmlParser from 'react-markdown/plugins/html-parser'


export const htmlParser = HtmlParser({
  isValidNode: node => node.type !== 'script'
})


export const answer = new RegExp(/({x})/, 'gi')

export const breakline = new RegExp(/({v})/, 'gi')


export const DRAG_AND_DROP_CONTAINER = 'DRAG_AND_DROP_CONTAINER'


export const TOAST_EXPIRATION = 10000

export const NOTIFICATION = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info'
}


export const GLOBAL_CONTEXT = {
  APTIS: 'Aptis',
  IELTS: 'IELTS'
}

export const MAXIMUM_RESULTS_PAGINATION_API = 10

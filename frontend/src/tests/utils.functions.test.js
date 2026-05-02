import * as util from 'utils/functions'

describe('Unit Testing utils', () => {
  /**
   * @module util.bearerToken
   */
  test('[bearerToken], Returns a bearer token', () => {
    const token = 'xxxxxx'
    expect(util.bearerToken(token)).toBe(`Bearer ${token}`)
  })

  /**
   * @module util.allowedFormat
   */
  test('[allowedFormat], HOF checking the allowed formats', () => {
    expect(util.allowedFormat(['mp3', 'wav'])('aptis.mp3')).toBe(true)
    expect(util.allowedFormat(['jpg', 'tga'])('image.gif')).toBe(false)
  })

  /**
   * @module util.isNull
   */
  test('[isNull], testing if the argument passed is null', () => {
    expect(util.isNull(null)).toBe(true)
    expect(util.isNull({})).toBe(false)
    expect(util.isNull([])).toBe(false)
  })

  /**
   * @module util.isEmpty
   */
  test('[isEmpty] checking that the array is empty or not.', () => {
    expect(util.isEmpty([])).toBe(true)
    expect(util.isEmpty({})).toBe(false)
    expect(util.isEmpty([null, null])).toBe(false)
  })

  /**
   * @module util.getFullName
   */
  test('[getFullName] should return person full name', () => {
    expect(util.getFullName('Anderson', 'Arevalo')).toBe('Anderson Arevalo')
    expect(util.getFullName('Name')).toBe('Name')
    expect(util.getFullName()).toBe('Sin nombre')
  })

  /**
   * @module util.getExtName
   */
  test('[getExtName] should return the extension filename', () => {
    expect(util.getExtName('audio.mp3')).toBe('.mp3')
    expect(util.getExtName('')).toBe('')
  })

  /**
   * @see https://en.wikipedia.org/wiki/Absolute_value
   * Negative values are transform into Math absolute values.
   * @module util.getMaxDuration
   */
  test('[getMaxDuration] should return the JavaScript Seconds', () => {
    expect(util.getMaxDuration(45)).toBe(45000)
    expect(util.getMaxDuration()).toBe(0)
    expect(util.getMaxDuration({})).toBe(0)
    expect(util.getMaxDuration(-1)).toBe(1000)
  })

  /**
   * @module util.sum
   */
  test('[sum] should return a single value', () => {
    const commit = [
      { points: 0 },
      { points: 2 },
      { points: 4 }
    ]
    expect(util.sum(commit, 'points', 0)).toBe(6)
  })
})

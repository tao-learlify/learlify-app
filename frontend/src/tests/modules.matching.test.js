import matchOneOf from 'modules/matching'

describe('Should pass if user input matchs the array of strings', () => {
  test('Should return null if the value is invalid', () => {
    expect(matchOneOf(['Keyword', 'Keywords'], 'key')).toBe(null)
  })
})
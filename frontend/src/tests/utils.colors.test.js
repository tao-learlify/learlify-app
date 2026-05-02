import Colors from 'utils/colors'

/**
 * @type {Map} Colors
 */
describe('Testing Aptis Colors', () => {
  test('Should return orange hexadecmial', () => {
    expect(Colors.get('orange')).toBe('#FFB300')
  })

  test('Should return gray hexadecimal', () => {
    expect(Colors.get('gray')).toBe('#2E353D')
  })

  test('Should return bluelight hexadecimal', () => {
    expect(Colors.get('bluelight')).toBe('#36A2EB')
  })

  test('Should return pink hexadecimal', () => {
    expect(Colors.get('pink')).toBe('#FF6384')
  })

  test('Should return a undefined value if color is red', () => {
    expect(Colors.get('red')).toBe()
  })
})
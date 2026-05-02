import { StatsFunctions } from 'api/stats/stats.functions'
import { Categories } from 'metadata/categories'
import { Models } from 'metadata/models'

it('Should return bandScore', () => {
  /**
   * @description
   * Expecting bandScore to be 0 when value is below the minimum IELTS Reading
   * range (min range starts at [5, 4, 2.5] so value 2 has no matching band).
   */
  expect(
    StatsFunctions.score({
      model: Models.IELTS,
      category: Categories.Reading,
      value: 2
    }).bandScore
  ).toBe(0)
})

it('Should return a bandScore with teacher feedback', () => {
  const wrapper = {
    model: {
      name: Models.IELTS
    },
    category: {
      name: Categories.Speaking
    }
  }

  expect(
    StatsFunctions.updateWithTeacherScore(
      [
        [9, 9, 9, 9],
        [9, 9, 9, 9],
        [9, 9, 9, 9]
      ],
      wrapper
    )
  ).toStrictEqual({
    bandScore: 9,
    marking: 'A1',
    points: 0
  })
})

import React, {
  memo,
  useCallback,
  useMemo,
  useState,
  useContext,
  useEffect
} from 'react'
import styled from 'styled-components'

import Emoji from 'components/Emoji'
import RangeComponent from 'components/Range'

import { EvaluationContext } from 'store/context'

const RangeText = styled.span`
  font-size: 10.5px;
  color: #56bbb3 !important;
`

const Range = ({ index, questions }) => {
  const evaluation = useContext(EvaluationContext)

  const [range, setRange] = useState(0)

  useEffect(() => {
    setRange(0)
  }, [questions])

  const onChange = useCallback(
    ({ target: { value } }) => {
      setRange(value)
      /**
       * @description
       * Updating via context.
       */
      evaluation.onUpdateRange({
        value: parseInt(value),
        index
      })
    },
    [evaluation, index]
  )

  const computedRange = useMemo(() => {
    const indicators = ['Wrong', 'Very Basic', 'Basic', 'Good']
    return indicators[range]
  }, [range])

  const computedEmoji = useMemo(() => {
    const emojies = ['Angry', 'Shocked', 'Happy', 'Awesome']

    return emojies[range]
  }, [range])

  return (
    <React.Fragment>
      <RangeComponent
        className="mt-2 mb-2"
        name="points"
        min={0}
        max={3}
        step={1}
        onChange={onChange}
        value={range}
        disabled={evaluation.evaluated}
      />
      <RangeText>
        {computedRange}
        <div className="float-right">
          <Emoji className="pt-1" name={computedEmoji} />
        </div>
      </RangeText>
    </React.Fragment>
  )
}

export default memo(Range)

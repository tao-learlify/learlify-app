import React, { memo } from 'react'
import { Button } from 'components/ui'
import { heart } from 'react-icons-kit/fa/heart'
import Icon from 'react-icons-kit'

import useForm from 'hooks/useForm'

import Text from './Text'
import Range from './Range'
import ModalDialog from './ModalDialog'
import { over } from 'utils/functions'

/**
 * @typedef {Object} Assessment
 * @property {string} description
 * @property {number} range
 * @property {number} initial
 */

/**
 * @typedef {Object} AssessmentProps
 * @property {Array<Assessment>} values
 * @property {() => void} onCalification
 * @property {() => void} onClose
 */

/**
 * @type {React.FunctionComponent<AssessmentProps>}
 */
const Assessment = ({ enabled, onClose, onCalification, values }) => {
  const keys = values.reduce(
    (prevKey, nextKey) =>
      Object.assign({}, prevKey, { [nextKey.description]: nextKey.initial }),
    {}
  )

  const [form, onChange] = useForm({ ...keys })

  const handleCalification = () => {
    const calification = {
      video: form[values[0].description],
      asssist: form[values[1].description]
    }

    onCalification(calification)
  }

  return (
    <ModalDialog
      textHeader="Califica esta vídeo llamada"
      onCloseRequest={onClose}
      enabled={enabled}
    >
      {values.map(assessment => (
        <React.Fragment key={assessment.description}>
          <br />
          <Text bold tag="h5" color="dark">
            {assessment.description}{' '}
            {over(form[assessment.description], assessment.range, false)}
          </Text>
          <hr />
          <Range
            name={assessment.description}
            max={assessment.range}
            min={0}
            onChange={onChange}
            value={form[assessment.description]}
          />
        </React.Fragment>
      ))}
      <br />
      <hr />
      <Button size="md" variant="dark" onClick={handleCalification}>
        Calificar <Icon className="text-orange" icon={heart} />
      </Button>
    </ModalDialog>
  )
}

Assessment.defaultProps = {
  onCalification: null
}

export default memo(Assessment)

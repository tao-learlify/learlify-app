import React, { memo, useCallback } from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import Dropup from 'components/Dropup'
import DropdownItem from 'components/DropdownItem'

import dynamic from 'modules/exercises'
import { TextInput } from './styles'
import { getLengthWithoutFalsyValues } from 'utils/functions'

/**
 * @typedef {Object} DynamicProps
 * @property {AnswerParam []} answers
 * @property {number} matchLengthInput
 * @property {string} module
 * @property {string} value
 * @property {() => string} onChangeDropdown
 * @property {() => string} onChangeForm
 */

const dropUpClassName = 'btn btn-light border dropdown-style'
/**
 * @type {React.FunctionComponent<DynamicProps>}
 */
const Dynamic = props => {
  const i18next = useTranslation()

  const { answers, onChangeForm, onChangeDropdown, value } = props

  const isValid =
    typeof value === 'string' &&
    getLengthWithoutFalsyValues(value) >= props.matchLengthInput


  const handleEventDropdown = useCallback(
    title => onChangeDropdown(title),
    [onChangeDropdown]
  )

  const handleEventForm = useCallback(
    e => onChangeForm(e.target.value),
    [onChangeForm]
  )

  switch (props.module) {
    case dynamic.MATCHING:
      return (
        <div className={props.className}>
          <TextInput className="text-muted">{props.placeholder}</TextInput>
          <Form.Control
            onChange={handleEventForm}
            placeholder={i18next.t('ALL.MATCH')}
            value={props.value || ''}
            isValid={isValid}
          />
        </div>
      )

    case dynamic.DROPDOWN:
      return (
        <Dropup name={props.value} className={dropUpClassName}>
          {answers.map(answer => (
            <DropdownItem
              key={answer}
              value={answer}
              onClick={() => handleEventDropdown(answer)}
            />
          ))}
        </Dropup>
      )

    default:
      return answers ? (
        <Dropup name={props.value} className={dropUpClassName}>
          {answers.map(answer => (
            <DropdownItem
              key={answer}
              value={answer}
              onClick={() => handleEventDropdown(answer)}
            />
          ))}
        </Dropup>
      ) : (
        <React.Fragment />
      )
  }
}

Dynamic.defaultProps = {
  answers: [],
  onChange: null,
  onClick: null,
  matchLengthInput: 1
}

export default memo(Dynamic)

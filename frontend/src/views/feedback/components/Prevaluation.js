import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { Button } from 'react-bootstrap'
import Confetti from 'react-confetti'

import useFeedback from 'hooks/useFeedback'
import useWindowSize from 'hooks/useWindowSize'

import Flex from 'components/FlexContainer'
import Text from 'components/Text'

import { img } from 'assets/compat'
import PATH from 'utils/path'

/**
 * @typedef {Object} PrevaluationProps
 * @property {'Writing' | 'Speaking'} label
 */

/**
 * @type {React.FunctionComponent<PrevaluationProps>}
 */
const Prevaluation = () => {
  const { t } = useTranslation()

  const history = useHistory()

  const feedback = useFeedback()

  const [height, width] = useWindowSize()

  /**
   * @description
   * Redirects to the current evaluation.
   */
  const handleClickEvaluation = () => {
    history.push(`${PATH.EVALUATION}/${feedback.data.evaluation.id}`)
  }

  return (
    <>
      <Text dunkin center color="blue" tag="h1">
        <img className="mr-3" alt="confetti" src={img.confetti} />
        {t('FEEDBACK.info.completed')}
        <img className="ml-3" alt="confetti" src={img.confetti} />
      </Text>
      <br />
      <Text dunkin center color="blue" tag="h5">
        {t('FEEDBACK.info.pending')}
      </Text>
      <Flex>
        <img className="ml-4" alt="pending" src={img.pending} />
      </Flex>
      <br />
      <Text lighter center color="blue" tah="p">
        {t('FEEDBACK.info.click')}
      </Text>
      <br />
      <Flex>
        <Button onClick={handleClickEvaluation} variant="secondary">
          {t('FEEDBACK.info.see')}
        </Button>
      </Flex>
      <Confetti width={width / 1} height={height / 1} />
    </>
  )
}

export default Prevaluation

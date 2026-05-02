import React from 'react'
import { ImpulseSpinner } from 'react-spinners-kit'

import Flex from 'components/FlexContainer'
import Text from 'components/Text'

/**
 * @typedef {Object} LoadingProps
 * @property {boolean} auto Centers the spinner within his context parent
 * @property {string} message
 */

/**
 * @type {React.FunctionComponent<LoadingProps>}
 */
const Loading = ({ auto, message }) =>
  auto ? (
    <React.Fragment>
      <Flex>
        <ImpulseSpinner frontColor="rgb(251 178 5)" />
      </Flex>
      <br />
      {message && typeof message === 'string' && (
        <Flex>
          <Text color="muted" center tag="small">
            {message}
          </Text>
        </Flex>
      )}
    </React.Fragment>
  ) : (
    <ImpulseSpinner />
  )

export default Loading

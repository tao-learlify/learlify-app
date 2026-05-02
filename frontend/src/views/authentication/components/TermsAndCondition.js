import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import Text from 'components/Text'

const TermsAndConditions = () => {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <Text tag="small" color="muted" center>
        
        <Text className="mx-1" tag="a" href="https://play.b1b2.top/" color="info">
          https://play.b1b2.top/
        </Text>
        academyb1b2@gmail.com
      </Text>
      <br />

        <Trans i18nKey='TERMS.data' />

    </React.Fragment>
  )
}

export default TermsAndConditions

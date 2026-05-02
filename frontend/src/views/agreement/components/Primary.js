import React from 'react'
import { useTranslation } from 'react-i18next'

import { TitleContainer } from './styles'

import useModels from 'hooks/useModels'
import Text from 'components/Text'
import FlexContainer from 'components/FlexContainer'
import { img } from 'assets/img'

const Primary = () => {
  const { model } = useModels()

  const { t } = useTranslation()

  return (
    <>
      {model && (
        <TitleContainer>
          <Text tag="span" color="blue">
              {t('AGREEMENT.PRIMARY.title', { model: model.name })}
          </Text>
        </TitleContainer>
      )}
      <br />
      <FlexContainer>
        <img alt="class" src={img['online-class']} />
      </FlexContainer>
    </>
  )
}

export default Primary

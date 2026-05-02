import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import config from 'views/agreement/config'
import useForm from 'hooks/useForm'

import {
  TitleContainer,
  WrapperRadioGroup,
  RadioGroup,
  KeyPointText,
  WrapperCustomize,
  LabelInput
} from './styles'
import AptisButton from 'views/exams/components/Button'
import useModels from 'hooks/useModels'


const CustomizeClass = ({ loading, levels, handleClassConfirmation }) => {
  const { model } = useModels()

  const { t } = useTranslation()

  const [form, onChange] = useForm({
    about: config.about[model.name][0],
    level: config.levels[model.name][0],
  })

  const onClickConfirmation = () => {
    handleClassConfirmation(form)
  }

  return (
    <>
      <WrapperCustomize>
        <TitleContainer>{t('AGREEMENT.CUSTOMIZE.title')}</TitleContainer>
        <form>
          <WrapperRadioGroup>
            <KeyPointText>{t('AGREEMENT.CUSTOMIZE.level')}</KeyPointText>
            <RadioGroup>
              {config.levels[model.name].map(level => (
                <div key={level}>
                  <input
                    type="radio"
                    id={level}
                    checked={form.level === level}
                    name="level"
                    onChange={onChange}
                    value={level}
                  />
                  <LabelInput className="ml-1">{level}</LabelInput>
                </div>
              ))}
            </RadioGroup>
          </WrapperRadioGroup>
          <WrapperRadioGroup>
            <KeyPointText>{t('AGREEMENT.CUSTOMIZE.about')}</KeyPointText>
            <RadioGroup>
              {config.about[model.name].map(value => (
                <div key={value}>
                  <input
                    type="radio"
                    id={value}
                    checked={form.about === value}
                    name="about"
                    onChange={onChange}
                    value={value}
                  />
                  <LabelInput className="ml-1">{value}</LabelInput>
                </div>
              ))}
            </RadioGroup>
          </WrapperRadioGroup>
        </form>
        <AptisButton disabled={loading} onClick={onClickConfirmation}>
          {t('AGREEMENT.CUSTOMIZE.confirm')}
        </AptisButton>
      </WrapperCustomize>
    </>
  )
}

export default memo(CustomizeClass)

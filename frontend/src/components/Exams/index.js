import React, { useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ReactSVG } from 'react-svg'
import classNames from 'clsx'
import Icon from 'react-icons-kit'

import { lock } from 'react-icons-kit/fa/lock'

import useExams from 'hooks/useExams'
import useMedia from 'hooks/useMedia'
import useSVG from 'hooks/useSVG'
import useToggler from 'hooks/useToggler'
import useModels from 'hooks/useModels'

import Categories from 'components/Categories'
import Text from 'components/Text'
import ModalDialog from 'components/ModalDialog'

import { getItemStyle } from './utils'
import { Hover } from 'styled'

import Arrow from 'assets/svg/flecha.svg'
import styles from './index.module.scss'
import path from 'utils/path'

import { buildQueryString } from 'utils/functions'

const Exams = () => {
  const { model } = useModels()

  const { t } = useTranslation()

  const isMobile = useMedia('(max-width: 768px)', true)

  const exams = useExams()

  const history = useHistory()

  const ref = useRef(null)

  const beforeInjectionCallback = useSVG({
    attributes: [['width', isMobile ? 90 : 60]]
  })

  const [enabled, handleSwitch] = useToggler(false)

  /**
   * Instead of rendering, saving a ref is a good solution.
   */
  const handleSaveRef = exam => {
    if (exam.blocked) {
      return history.push(path.PAYMENTS)
    }

    ref.current = exam

    handleSwitch()
  }

  /**
   * @description
   * Handles the selection of the current exam.
   */
  const handleViewRef = ({ name }) => {
    const { id } = ref.current

    const pathname = buildQueryString(path.EXAMS, [
      ['index', id],
      ['query', name]
    ])

    history.push(pathname)
  }

  const practice = t('COMPONENTS.EXAMS.practice').bold

  return (
    <>
      <div className={classNames(styles.container, 'border')}>
        <div>
          <Text center className={styles.title} color="blue" tag="h1">
            {t('COMPONENTS.EXAMS.title')}
          </Text>
          <Text center className={styles.subtitle} bold color="muted" tag="h5">
            {model && (
              <>
                <Text tag="span">
                  {t('COMPONENTS.EXAMS.description', {
                    model: model.name,
                    practice
                  })}
                </Text>
              </>
            )}
          </Text>
        </div>
        <React.Fragment>
          <ReactSVG
            className="d-none d-md-block d-md-none"
            beforeInjection={beforeInjectionCallback}
            src={Arrow}
          />
        </React.Fragment>
        <div
          className={
            exams.data.length >= GRID_STYLE_REQUIRED ? styles.grid : styles.flex
          }
        >
          {exams.data.map((exam, index) => (
            <Hover
              onClick={() => handleSaveRef({ ...exam, paletteIndex: index })}
              className={classNames(
                exams.data.length >= GRID_STYLE_REQUIRED &&
                  styles[getItemStyle(index)]
              )}
              key={exam.id}
            >
              {exam.imageUrl &&
                (exam.blocked ? (
                  <div className={styles.blocked}>
                    <ReactSVG
                      about="exam"
                      beforeInjection={beforeInjectionCallback}
                      src={exam.imageUrl}
                    />
                    <Icon
                      className={classNames(styles.lock, 'text-dark')}
                      size={30}
                      icon={lock}
                    />
                  </div>
                ) : (
                  <ReactSVG
                    beforeInjection={beforeInjectionCallback}
                    src={exam.imageUrl}
                  />
                ))}
            </Hover>
          ))}
        </div>
      </div>
      <ModalDialog
        size="xs"
        removePadding={true}
        enabled={enabled}
        onCloseRequest={handleSwitch}
      >
        {enabled && (
          <Categories element={ref.current} onClick={handleViewRef} />
        )}
      </ModalDialog>
    </>
  )
}

const GRID_STYLE_REQUIRED = 10

export default Exams

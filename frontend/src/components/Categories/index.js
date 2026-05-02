import React, { useCallback } from 'react'
import { ReactSVG } from 'react-svg'
import classNames from 'clsx'

import useCategories from 'hooks/useCategories'
import useSVG from 'hooks/useSVG'

import styles from './categories.module.scss'
import { getItemStyle } from 'components/Exams/utils'

import { getPaletteByColors } from './utils'
import AsyncComponent from 'components/AsyncComponent'

/**
 * @typedef {Object} CategoriesProps
 * @property {Category} element
 * @property {() => category} onClick
 *
 * @typedef {React.FunctionComponent<CategoriesProps>}
 */
const Categories = ({ element, onClick }) => {
  const imageSVGCallback = useSVG({
    attributes: [['width', 110]]
  })

  const alternSVGCallback = useSVG({
    attributes: [['width', 95]]
  })

  const categories = useCategories()

  const handleClick = useCallback(
    value => {
      onClick && onClick(value)
    },
    [onClick]
  )

  return (
    <>
      <div className={styles.grid}>
        {categories.data.map((category, index) => (
          <div
            className={classNames(
              styles[getItemStyle(index)],
              styles[getPaletteByColors(element, index)],
              styles.flex,
              'hovered'
            )}
            key={category.id}
            onClick={() => handleClick(category)}
          >
            <span>
              <AsyncComponent resource={category.imageUrl}>
                <ReactSVG
                  beforeInjection={imageSVGCallback}
                  src={category.imageUrl}
                />
              </AsyncComponent>
              {category.name}
            </span>
          </div>
        ))}
        <div className={styles.icon}>
          {element && element.alternImageUrl && (
            <AsyncComponent innerNodeClassName="d-flex justify-conent-center" resource={element.alternImageUrl}>
              <ReactSVG
                beforeInjection={alternSVGCallback}
                src={element.alternImageUrl}
              />
            </AsyncComponent>
          )}
        </div>
      </div>
    </>
  )
}

export default Categories

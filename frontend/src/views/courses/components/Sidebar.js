import React, { memo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { ic_dashboard } from 'react-icons-kit/md/ic_dashboard'
import { book } from 'react-icons-kit/fa/book'
import { star } from 'react-icons-kit/fa/star'
import { starO } from 'react-icons-kit/fa/starO'
import { ic_web } from 'react-icons-kit/md/ic_web'
import { ic_voice_chat } from 'react-icons-kit/md/ic_voice_chat'
import { lock } from 'react-icons-kit/fa/lock'

import Icon from 'react-icons-kit'

import { Badge } from '@material-ui/core'

import useAdvance from 'hooks/useAdvance'
import useCategories from 'hooks/useCategories'
import useModels from 'hooks/useModels'

import Text from 'components/Text'
import LinkThrough from 'components/LinkThrough'

import PATH from 'utils/path'

import { svg } from 'assets/compat'
import { splitContextFromSection } from '../utils'

import styles from '../styles.module.scss'
import { APTIS, IELTS } from 'constant/models'

import Background from 'assets/illustrations/brand/logo.svg'
import FlexContainer from 'components/FlexContainer'

/**
 * @typedef {Object} SidebarProps
 * @property {boolean} collapsed
 * @property {boolean} demo
 * @property {string []} units
 * @property {() => number} onClickUnit
 * @property {() => boolean} onLeaveContext
 */

/**
 * @type {React.FunctionComponent<SidebarProps>}
 */
const Sidebar = ({ demo, collapsed, onClickUnit, onLeaveContext, units }) => {
  const advance = useAdvance()

  const models = useModels()

  const history = useHistory()

  const categories = useCategories(true)

  const { t } = useTranslation()

  const handleClickUnit = useCallback(onClickUnit, [onClickUnit])

  const handleClickDashboard = useCallback(
    () => history.push(PATH.DASHBOARD),
    [history]
  )

  const getBlogLink = () => {
    if (models) {
      switch (models.model.name) {
        case IELTS:
          return {
            url: 'https://b1b2.top/es/ieltspost/'
          }

        case APTIS:
          return {
            url: 'https://b1b2.top/es/aptispost/'
          }

        default:
          return {
            url: 'https://b1b2.top/'
          }
      }
    }
  }

  const handleClickOnlineClasses = () => {
    history.push(PATH.CLASSES)
  }

  /**
   *
   * @param {string | number} unit
   */
  const mappedUnitIfCompleted = unit => {
    try {
      const { content } = advance.data[0]

      return content[unit] && content[unit].completed
    } catch {
      return false
    }
  }

  return (
    <ProSidebar
      image={svg.sidebar}
      breakPoint="sm"
      toggled={collapsed}
      onToggle={onLeaveContext}
    >
      <Menu iconShape="circle" popperArrow>
        <FlexContainer>
          <img alt="logo" className="img-fluid" src={Background} width={240} />
        </FlexContainer>
        <hr />
        <MenuItem
          icon={<Icon icon={ic_dashboard} />}
          onClick={handleClickDashboard}
        >
          <Text dunkin tag="span" color="muted">
            Dashboard
          </Text>
        </MenuItem>
        <br />
        {units.length > 0 && (
          <SubMenu
            className="dunkin text-muted"
            title={
              <>
                {t('COURSES.units')}{' '}
                <Badge
                  badgeContent={units.length}
                  className={styles.badge}
                  color="error"
                />
              </>
            }
            icon={<Icon icon={book} />}
          >
            {units.map((unit, index) => (
              <SubMenu
                key={unit}
                className="lighter"
                title={
                  <>
                    {demo ? (
                      <>
                        {t('COURSES.unit', { value: unit })}{' '}
                        <Icon
                          className="float-right"
                          icon={index === 0 ? starO : lock}
                        />
                      </>
                    ) : (
                      <>
                        {t('COURSES.unit', { value: unit })}{' '}
                        <Icon
                          className="float-right"
                          icon={mappedUnitIfCompleted(unit) ? star : starO}
                        />
                      </>
                    )}
                  </>
                }
                icon={<Icon icon={starO} />}
              >
                {demo
                  ? index === 0 &&
                    categories.data.map(category => (
                      <MenuItem
                        key={category.id}
                        icon={<Icon icon={star} />}
                        onClick={() =>
                          handleClickUnit(parseInt(unit) - 1, category.name)
                        }
                      >
                        <Text lighter bold tag="span" color="blue">
                          {splitContextFromSection(category.name)}{' '}
                          <Icon className="float-right" icon={starO} />
                        </Text>
                      </MenuItem>
                    ))
                  : categories.data.map(category => (
                      <MenuItem
                        key={category.id}
                        icon={<Icon icon={star} />}
                        onClick={() =>
                          handleClickUnit(parseInt(unit) - 1, category.name)
                        }
                      >
                        <Text lighter bold tag="span" color="blue">
                          {splitContextFromSection(category.name)}{' '}
                          <Icon className="float-right" icon={starO} />
                        </Text>
                      </MenuItem>
                    ))}
              </SubMenu>
            ))}
          </SubMenu>
        )}
        <br />
        <MenuItem icon={<Icon icon={ic_web} size={22} />}>
          <LinkThrough href={getBlogLink().url}>
            <Text dunkin tag="span" color="muted">
              Blog
            </Text>
          </LinkThrough>
        </MenuItem>
        <br />
        <MenuItem icon={<Icon icon={ic_voice_chat} size={22} />}>
          <Text
            dunkin
            tag="span"
            color="muted"
            onClick={handleClickOnlineClasses}
          >
            {t('COURSES.sidebar.classes')}
          </Text>
        </MenuItem>
        <br />
      </Menu>
    </ProSidebar>
  )
}

Sidebar.defaultProps = {
  units: [],
  onClickUnit: () => null,
  onLeaveContext: () => false
}

export default memo(Sidebar)

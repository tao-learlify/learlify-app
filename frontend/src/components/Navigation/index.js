import React, { useRef } from 'react'
import { Badge, NavDropdown, Nav } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { ic_more_vert } from 'react-icons-kit/md/ic_more_vert'
import { signOut } from 'react-icons-kit/fa/signOut'
import { cog } from 'react-icons-kit/fa/cog'
import { ic_apps } from 'react-icons-kit/md/ic_apps'
import { ic_dashboard } from 'react-icons-kit/md/ic_dashboard'

import { useTranslation } from 'react-i18next'

import Icon from 'react-icons-kit'
import classNames from 'clsx'

import useAuthProvider from 'hooks/useAuthProvider'
import useNotifications from 'hooks/useNotifications'
import useMedia from 'hooks/useMedia'
import useModels from 'hooks/useModels'
import useToggler from 'hooks/useToggler'

import Avatar from 'components/Avatar'
import Notifications from 'components/Notifications'
import Text from 'components/Text'

import {
  AvatarContainer,
  NavbarContainer,
  Navbar,
  NavbarLink,
  IconContainer,
  Logo,
  RouterLink
} from 'styled'

import PATH from 'utils/path'
import { img } from 'assets/img'

import styles from './navigation.module.scss'
import 'assets/css/navbar.css'

const Navigation = () => {
  const { t } = useTranslation()

  const routes = [{ href: PATH.PAYMENTS, name: t('NAVIGATION.payments') }]

  const history = useHistory()

  const user = useAuthProvider()

  const isResponsive = useMedia('(max-width: 767px)', true)

  const { model } = useModels()

  const { unreads } = useNotifications()

  const [notificationsOpen, notificationsToggle] = useToggler()

  const handleClickLogo = () => {
    history.push({
      pathname: PATH.DASHBOARD
    })
  }

  const ref = useRef(
    <IconContainer>
      <Icon className="hovered" icon={ic_more_vert} size={24} />
    </IconContainer>
  )

  return (
    user.isLoggedIn && (
      <NavbarContainer>
        <Navbar>
          {isResponsive ||
            (model && !history.location.pathname.includes(PATH.MODELS) ? (
              <Logo
                color={model.color}
                src={model.logo}
                onClick={handleClickLogo}
              />
            ) : (
              <Logo onClick={handleClickLogo} />
            ))}
          <Nav
            className={classNames(
              isResponsive ? 'mr-auto' : 'ml-auto',
              'align-items-center'
            )}
          >
            {isResponsive || (
              <RouterLink
                className={classNames('nav-link', styles.uppercase)}
                to={PATH.COURSES}
              >
                {t('NAVIGATION.courses')}
              </RouterLink>
            )}
            {isResponsive ||
              routes.map(route => (
                <RouterLink
                  key={route.href}
                  className={classNames('nav-link', styles.uppercase)}
                  to={route.href}
                >
                  {route.name}
                </RouterLink>
              ))}
            <div className="nav-item">
              <NavbarLink>
                <AvatarContainer>
                  <Notifications
                    open={notificationsOpen}
                    onNavigate={notificationsToggle}
                  />
                  <Badge
                    pill
                    style={badgeStyle}
                    variant="danger"
                    onClick={notificationsToggle}
                  >
                    {unreads}
                  </Badge>
                  {user.isLoggedIn && (
                    <Avatar
                      className="hovered"
                      src={
                        user.profile.imageUrl
                          ? user.profile.imageUrl
                          : img.astronaut
                      }
                    />
                  )}
                </AvatarContainer>
              </NavbarLink>
            </div>
            <NavDropdown
              className={classNames('no-arrow', styles.vert)}
              title={ref.current}
            >
              <Link
                className="dropdown-item text-blue text-center"
                to={PATH.SETTINGS}
              >
                <Icon icon={cog} />{' '}
                <Text color="blue" tag="small">
                  {t('COMPONENTS.NAVIGATION.config')}
                </Text>
              </Link>
              <Link
                className="dropdown-item text-blue text-center"
                to={PATH.MODELS}
              >
                <Icon icon={ic_apps} />{' '}
                <Text color="blue" tag="small">
                  {t('COMPONENTS.NAVIGATION.exam')}
                </Text>
              </Link>
              <NavDropdown.Item
                className="text-blue text-center"
                href={PATH.LOGOUT}
              >
                <Icon icon={signOut} />{' '}
                <Text color="blue" tag="small">
                  {t('COMPONENTS.NAVIGATION.logout')}
                </Text>
              </NavDropdown.Item>
            </NavDropdown>
            <Link className={classNames('d-block d-sm-none', styles.dashboard)}>
              <Text dunkin color="white" tag="small">
                DASHBOARD
                <Icon size={15} icon={ic_dashboard} />
              </Text>
            </Link>
          </Nav>
        </Navbar>
      </NavbarContainer>
    )
  )
}

/**
 * @type {React.CSSProperties}
 */
const badgeStyle = {
  left: 15,
  top: 10,
  position: 'relative'
}

export default Navigation

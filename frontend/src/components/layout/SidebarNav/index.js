import React, { memo } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import {
  House,
  Books,
  Trophy,
  CreditCard,
  GearSix,
  Bell,
  Notepad
} from '@phosphor-icons/react'

import useAuthProvider from 'hooks/useAuthProvider'
import useModels from 'hooks/useModels'
import useNotifications from 'hooks/useNotifications'

import { Button } from 'components/ui/Button'

import PATH from 'utils/path'
import brandLogo from 'assets/illustrations/brand/logo.svg'
import { img } from 'assets/compat'

import styles from './SidebarNav.module.scss'

const NAV_ITEMS = [
  {
    key: 'dashboard',
    path: PATH.DASHBOARD,
    Icon: House,
    labelKey: 'NAVIGATION.dashboard'
  },
  {
    key: 'courses',
    path: PATH.COURSES,
    Icon: Books,
    labelKey: 'NAVIGATION.courses'
  },
  {
    key: 'exams',
    path: PATH.EXAMS,
    Icon: Notepad,
    labelKey: 'NAVIGATION.exam'
  },
  {
    key: 'stats',
    path: PATH.STATS,
    Icon: Trophy,
    labelKey: 'NAVIGATION.stats'
  },
  {
    key: 'payments',
    path: PATH.PAYMENTS,
    Icon: CreditCard,
    labelKey: 'NAVIGATION.payments'
  },
  {
    key: 'settings',
    path: PATH.SETTINGS,
    Icon: GearSix,
    labelKey: 'NAVIGATION.settings'
  }
]

/**
 * SidebarNav — DS sidebar navigation for the app shell.
 *
 * Matches code.html structure:
 * - Fixed left sidebar (240px)
 * - Logo/brand at top
 * - Primary nav links with active indicator
 * - User profile card at bottom with upgrade CTA
 *
 * @param {string} [className]
 */
const SidebarNav = memo(function SidebarNav({ className }) {
  const { t } = useTranslation()
  const history = useHistory()
  const user = useAuthProvider()
  const { model } = useModels()
  const { unreads } = useNotifications()

  const avatarSrc = user?.profile?.imageUrl || img?.astronaut

  return (
    <nav
      className={clsx(styles.sidebar, className)}
      aria-label="Main navigation"
    >
      {/* ── Brand ──────────────────────────────────────────────── */}
      <div className={styles.brand}>
        <img src={brandLogo} alt="Learlify" className={styles.brandLogo} />
      </div>

      {/* ── Primary nav links ──────────────────────────────────── */}
      <ul className={styles.navList} role="list">
        {NAV_ITEMS.map(({ key, path, Icon: NavIcon, labelKey }) => (
          <li key={key}>
            <NavLink
              to={path}
              exact={key === 'dashboard'}
              className={styles.navLink}
              activeClassName={styles.navLinkActive}
            >
              <span className={styles.navIconWrap} aria-hidden="true">
                <NavIcon weight="fill" size="var(--icon-lg)" />
              </span>
              <span>{t(labelKey, { defaultValue: key.toUpperCase() })}</span>
              {key === 'stats' && unreads > 0 && (
                <span className={styles.badge} aria-label={`${unreads} unread`}>
                  {unreads}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* ── Notifications link ──────────────────────────────────── */}

      {/* ── Bottom: user profile card ───────────────────────────── */}
      <div className={styles.profileSection}>
        <div className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <img
              src={avatarSrc}
              alt={user?.profile?.firstName ?? 'User'}
              className={styles.avatar}
            />
          </div>
          <p className={styles.profileName}>{user?.profile?.firstName}</p>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            className={styles.upgradeBtn}
            onClick={() => history.push(PATH.PAYMENTS)}
          >
            {t('NAVIGATION.upgrade', { defaultValue: 'UPGRADE TO PRO' })}
          </Button>
        </div>
      </div>
    </nav>
  )
})

export default SidebarNav
export { SidebarNav }

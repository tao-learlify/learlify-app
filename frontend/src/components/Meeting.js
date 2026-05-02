import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated } from 'react-animated-css'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import useAuthProvider from 'hooks/useAuthProvider'
import useMeeting from 'hooks/useMeeting'

import Text from './Text'

import roles from 'utils/roles'

import { createNavigationPath } from 'modules/url'

const Meeting = () => {
  const i18next = useTranslation()

  const user = useAuthProvider()

  const meeting = useMeeting()

  try {
    return meeting === null || (
      <Animated animationIn="fadeInDown">
        <Alert className="text-center" variant="success">
          <Text lighter center color="muted" tag="small">
            {i18next.t('MEETING.partial', {
              user:
                user.profile.role === roles.TEACHER
                  ? i18next.t('MEETING.student')
                  : i18next.t('MEETING.teacher')
            })}
            {meeting && (
               <Link
               to={createNavigationPath('/meetings', {
                 token: meeting.classes.name
               })}
             >
               {i18next.t('MEETING.action')}
             </Link>
            )}
          </Text>
        </Alert>
      </Animated>
    )
  } catch  {
    return (
      <React.Fragment />
    )
  }
}

export default memo(Meeting)

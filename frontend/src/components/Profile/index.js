import React, { memo } from 'react'
import { user as user_alt } from 'react-icons-kit/fa/user'
import { ic_account_circle } from 'react-icons-kit/md/ic_account_circle'
import { ic_verified_user } from 'react-icons-kit/md/ic_verified_user'
import Icon from 'react-icons-kit'

import useAuthProvider from 'hooks/useAuthProvider'

import { Card, CardHeader, CardBody } from 'components/ui'
import Text from 'components/Text'
import { getFullName } from 'utils/functions'

const props = {
  bold: true,
  tag: 'small',
  color: 'muted'
}

function StyledIcon(props) {
  return <Icon {...props} style={{ position: 'relative', bottom: 2.5 }} />
}

const Profile = () => {
  const { profile: user } = useAuthProvider()

  return (
    <Card className="rounded">
      <CardHeader>
        <Text {...props}>
          Perfil <Icon className="text-info" icon={ic_account_circle} />
        </Text>
      </CardHeader>
      <CardBody>
        <div className="tw:flex tw:flex-wrap">
          <div className="tw:w-full md:tw:w-2/12 tw:px-4">
            <img className="border rounded" src={user.imageUrl} alt="profile" />
          </div>
          <div className="tw:w-full md:tw:w-6/12 tw:px-4">
            <div className="tw:flex tw:flex-wrap">
              <div className="tw:w-full md:tw:w-6/12 tw:px-4">
                <Text {...props}>
                  <StyledIcon icon={user_alt} />{' '}
                  {getFullName(user.firstName, user.lastName)}
                </Text>
              </div>
              <div className="tw:w-full md:tw:w-6/12 tw:px-4">
                <Text {...props}>
                  <StyledIcon
                    className="text-success"
                    icon={ic_verified_user}
                  />{' '}
                  Verificado
                </Text>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default memo(Profile)

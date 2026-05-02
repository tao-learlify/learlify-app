import React, { memo } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { user as user_alt } from 'react-icons-kit/fa/user'
import { ic_account_circle } from 'react-icons-kit/md/ic_account_circle'
import { ic_verified_user } from 'react-icons-kit/md/ic_verified_user'
import Icon from 'react-icons-kit'
import styled from 'styled-components'

import useAuthProvider from 'hooks/useAuthProvider'

import Text from 'components/Text'
import { getFullName } from 'utils/functions'

const props = {
  bold: true,
  tag: 'small',
  color: 'muted'
}

const StyledIcon = styled(Icon)`
  position: relative;
  bottom: 2.5px;
`

const Profile = () => {
  const { profile: user } = useAuthProvider()

  return (
    <Card className="rounded">
      <Card.Header>
        <Card.Title>
          <Text {...props}>
            Perfil <Icon className="text-info" icon={ic_account_circle} />
          </Text>
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={2}>
            <img className="border rounded" src={user.imageUrl} alt="profile" />
          </Col>
          <Col md={6}>
            <Row>
              <Col md={6}>
                <Text {...props}>
                  <StyledIcon icon={user_alt} />{' '}
                  {getFullName(user.firstName, user.lastName)}
                </Text>
              </Col>
              <Col md={6}>
                <Text {...props}>
                  <StyledIcon
                    className="text-success"
                    icon={ic_verified_user}
                  />{' '}
                  Verificado
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default memo(Profile)

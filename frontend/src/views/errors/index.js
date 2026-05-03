import React, { PureComponent } from 'react'
import { Container, FormGroup } from 'react-bootstrap'
import { Button } from 'components/ui'

import Animate from 'components/Animate'
import Emoji from 'components/Emoji'
import FlexContainer from 'components/FlexContainer'
import Text from 'components/Text'
import Report from 'components/Report'
import OverlayMessage from 'components/OverlayMessage'

import animations from 'utils/animations'

import PATH from 'utils/path'
import { img } from 'assets/compat'

const wrap = {
  whiteSpace: 'pre-wrap'
}

class ErrorHandler extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null,
      modal: false
    }
  }

  componentDidCatch(error, errorInfo) {
    console.log('err', error)
    console.log('errInfo', errorInfo)

    if (this.props.onCatchError) {
      this.props.onCatchError()
    }

    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleChangeModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }))
  }

  handleRestartApp = () => {
    window.location.reload()
  }

  handleRedirectDashboard = () => {
    this.props.history.push(PATH.DASHBOARD)
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <Animate type={animations.ZOOM_ENTRANCE.ZOOM_IN}>
          {import.meta.env.DEV ? (
            <>
              <Text center color="danger" tag="h2">
                AptisGo Critical Error
              </Text>
              <details style={wrap}>
                <Text tag="p" color="muted">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack.toString()}
                </Text>
              </details>
            </>
          ) : (
            <React.Fragment>
              <Text center color="muted" tag="h3">
                Lo sentimos, tienes un problema de incompatibilidad
              </Text>
              <Container>
                <FlexContainer>
                  <img src={img.settings} alt="critical-error" />
                </FlexContainer>
                <Container>
                  <br />
                  <Text center bold tag="p" color="muted">
                    Contacta con nosotros para que podamos ayudarte, haz click
                    en la bandera
                  </Text>
                  <br />
                  <FlexContainer>
                    <OverlayMessage message="Enviar Reporte">
                      <Emoji
                        className="hovered"
                        name="Flag"
                        height={40}
                        width={30}
                        onClick={this.handleChangeModal}
                      />
                    </OverlayMessage>
                  </FlexContainer>
                  <br />
                  <FlexContainer>
                    <FormGroup>
                      <Button
                        onClick={this.handleRedirectDashboard}
                        className="m-1"
                        variant="secondary"
                      >
                        Ir al dashboard
                      </Button>
                      <Button
                        onClick={this.handleRestartApp}
                        className="m-1"
                        variant="secondary"
                      >
                        Reiniciar
                      </Button>
                    </FormGroup>
                  </FlexContainer>
                </Container>
              </Container>
            </React.Fragment>
          )}
          <Report
            context={
              import.meta.env.PROD
                ? 'AptisGo Critical Error'
                : 'AptisGo Testing Error'
            }
            enabled={this.state.modal}
            onClose={this.handleChangeModal}
            onSuccess={this.handleChangeModal}
          />
        </Animate>
      )
    }
    return this.props.children
  }
}

export default ErrorHandler

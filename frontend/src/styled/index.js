import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'
import {
  Card,
  Container,
  Navbar as NavbarBootstrap,
  Button as StyledButton,
  Nav
} from 'react-bootstrap'

import { BLUE, YELLOW, WHITE, TURQUOISE } from 'assets/colors'

import { motion } from 'framer-motion'

import bubble from 'assets/illustrations/decorative/dialog.svg'
import logo from 'assets/illustrations/brand/logo.svg'


export const TextContainer = styled.div`
  margin-top: 25px;
  margin-bottom: 10px;
`

export const Button = styled(StyledButton)`
  color: ${({ color }) => color};
  border-color: ${({ background, border }) => background || border};
  background-color: ${({ background }) => background};
  border-radius: 20px;
  &:hover {
    border-color: ${({ hoverBackgroundColor }) => hoverBackgroundColor};
  }
`

/**
 * @description
 * Navigation
 */
export const Navbar = styled(NavbarBootstrap)`
  background-color: ${BLUE};
  border-radius: 50px;
`

export const RouterLink = styled(Link)`
  color: ${WHITE} !important;
  &:hover {
    color: ${YELLOW} !important;
    text-decoration: none;
    transition: ease-in-out;
    transition-duration: 0.7s;
  }
`

export const NavbarLink = styled(Nav.Link)`
  color: ${WHITE} !important;
  text-decoration: none;
  padding: 0 1.5rem !important;
  margin-right: ${({ last }) => last && '35px'};
  text-transform: uppercase;
`

export const NavbarContainer = styled(Container)`
  padding: 0;
`

export const Logo = styled(Navbar.Brand)`
  width: 67px;
  height: 67px;
  background-color: ${({ color }) => color || TURQUOISE};
  border-radius: 50px;
  position: ${({ normal }) => normal ? 'inherit' : 'absolute'};
  left: -4px;
  background-image: ${({ src }) => `url(${src || logo})`};
  background-size: 70px;
  background-repeat: no-repeat;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
`

export const SocialMedia = styled.div`
  display: flex;
  flex-direction: column;
`

export const SocialMediaIconContainer = styled.div`
  background-color: ${WHITE};
  border-radius: 50px;
  width: 24px;
  height: 24px;
  text-align: center;
  margin-bottom: ${({ first }) => first && '3px'};
`

export const AvatarContainer = styled.div`
  margin-right: 25px;
`

export const IconContainer = styled.span`
  margin-left: 2.5px;
  color: ${WHITE};
`

/**
 * @description
 * Schedules, classes, meetings
 */

export const WrapperClasses = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  @media (min-width: 701px) {
    padding: 10px 40px;
  }
`

export const TitleContainer = styled.div`
  display: flex;
  font-family: Dunkin;
  justify-content: center;
  align-items: center;
  color: rgb(60, 60, 60);
  font-size: 5vw;
  @media (min-width: 601px) {
    font-size: 42px;
  }
`

export const DescriptionTitle = styled.div`
  font-family: 'Roboto';
  display: flex;
  justify-content: left;
  align-items: center;
  color: rgb(60, 60, 60);
  font-size: 5vw;
  padding-bottom: 10px;
  @media (min-width: 501px) {
    font-size: 30px;
  }
  margin-top: 32px;
  font-weight: 900;
  width: 100%;
`

export const WrapperContent = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
`

export const Description = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 20px;
  ${({ padding }) =>
    padding &&
    css`
      padding: 20px 20px;
    `};
`
export const DescriptionReservations = styled.div`
  justify-content: center;
  background-color: #008bc1;
  border-radius: 80px;
  margin-top: 20px;
  padding-bottom: 30px;
`

export const BoxedReservations = styled.div`
  align-items: center;
  justify-content: center;
  background-color: #005082;
  border-radius: 80px;
  margin-bottom: -50px;
  width: 400px;
`
export const BoxedBehind = styled.div`
  justify-content: center;
  border-radius: 60px;
  padding: 20px 20px;
`

export const BoxedDescription = styled.div`
  justify-content: center;
  border-radius: 60px;
  padding: 10px 30px;
`

export const ConainerImages = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 15px;
  width: 100%;
`

export const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
`

export const Img = styled.img`
  width: 30px;
`

export const KeyPoint = styled.div`
  font-family: 'Roboto';
  display: flex;
  justify-content: center;
  font-size: 4vw;
  @media (min-width: 501px) {
    font-size: 22px;
  }
  font-weight: 100;
`

export const PriceText = styled.div`
  display: flex;
  align-items: left;
  color: rgb(60, 60, 60);
  font-size: 4vw;
  @media (min-width: 501px) {
    font-size: 32px;
  }
  margin-top: 10px;

  width: 100%;
`
export const ClassText = styled.div`
  display: flex;
  align-items: left;
  color: rgb(60, 60, 60);
  font-size: 4vw;
  margin-top: -15px;
  @media (min-width: 501px) {
    font-size: 42px;
  }
  font-weight: bold;
  width: 100%;
`

export const BoxedTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-family: Dunkin;
  font-size: 6vw;
  padding-bottom: 10px;
  @media (min-width: 501px) {
    font-size: 22px;
  }
  width: 100%;
`

export const BoxedText = styled.div`
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-family: Monserrat-Light;
  @media (min-width: 501px) {
    font-size: 18px;
  }
  font-size: 4vw;
`
export const BoxedButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 4vw;
  font-weight: 700;
  border-radius: 34px;
  background-color: #005082;
  color: #ffffff;
  padding: 10px;
  @media (min-width: 601px) {
    font-size: 18px;
  }
  &:hover {
    background-color: #989898;
    border-color: #989898;
  }
  ${({ color }) =>
    color &&
    css`
      background-color: #18a2b8;
    `};
`

/**
 * @description
 * Models feature
 */

export const TitleSpace = styled.div`
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: bold;
`

export const ContainerModels = styled.div`
  padding-top: 60px;
  background-image: url(${bubble});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  display: flex;
  justify-content: center;
`

export const ModelContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
`

export const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  position: relative;
  top: -40px;
  left: 50px;
`

export const StyledCard = styled(Card)`
  border: none;
  border-radius: 20px;
  width: 250px;
`

export const Title = styled.div`
  text-align: center;
  padding: 16px 12px;
  border-radius: 50px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: #ffffff;
  font-weight: bold;
  position: absolute;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  top: -30px;
  font-size: 24px;
  text-transform: uppercase;
  font-weight: bold;
`

export const BodyContainer = styled.div`
  margin-bottom: 55px;
  &:focus {
    outline: none;
  }
`

export const TextContainerModels = styled(Card.Body)`
  padding-top: 50px;
  font-weight: bold;
  font-size: 15px;
  text-transform: uppercase;
`

export const LogoModels = styled.img`
  margin: ${({ display, isMobile }) =>
    display && isMobile ? 0 : '0 40px 0 40px'};
`

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Hover = styled(motion.button)`
  border: none;
  background: transparent;
  &:focus {
    outline: none;
  }
`

Hover.defaultProps = {
  whileHover: { scale: 1.1 },
  whileTrap: { scale: 0.9 }
}


export const MarginBetweenElement = styled.div`
  margin-left: 10px;
  margin-right: 10px;
`
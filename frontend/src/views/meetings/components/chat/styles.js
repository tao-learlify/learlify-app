import styled from 'styled-components'
import colors from 'colors'

export const ChatContainer = styled.div`
  @keyframes showIn {
    from {
      opacity: 0;
      right: -300px;
    }
    to {
      opacity: 1;
      right: 0;
    }
  }
  font-size: 12px;
  height: calc(100% - 80px);
  width: calc(40% - 80px);
  max-width: 320px;
  position: fixed;
  right: 0px;
  bottom: 0;
  background: ${colors.DARKBLUE};
  box-shadow: 2px 0px 10px #a1a1a1;
  animation: showIn 0.2s ease-in forwards;
  @media (max-width: 880px) {
    max-width: 300px;
  }
  @media (max-width: 772px) {
    @keyframes showIn {
      from {
        opacity: 0;
        bottom: -300px;
      }
      to {
        opacity: 1;
        bottom: 0;
      }
    }
    width: 100%;
    max-width: 100%;
    padding-bottom: 30px;
    animation: showIn 0.2s ease-in forwards;
  }
`

export const Header = styled.header`
  background: #333;
  color: #fff;
  cursor: pointer;
  padding: 11px 0px 5px 22px;
`

export const ChatBody = styled.div`
  z-index: 1;
  background: ${colors.DARKBLUE};
  height: 80%;
  display: flex;
  flex-direction: column;
`

export const ChatScreen = styled.div`
  padding: 8px 24px;
  overflow-y: scroll;
  height: 100%;
  align-items: center;
  ::-webkit-scrollbar {
    width: 8px;
  }
`

export const MessageContainer = styled.div`
  margin: 16px 0;
`

export const ChatAvatar = styled.img`
  border-radius: 50%;
  float: left;
`

export const Content = styled.div`
  margin-left: 56px;
`

export const TextDate = styled.span`
  float: right;
  font-size: 9.5px;
  color: ${colors.PRIMARY}
`

export const ChatMessage = styled.p`
  margin: 0;
  margin-bottom: 5px;
  font-size: 11px;
`

export const ChatAction = styled.p`
  font-size: 10px;
  font-style: italic;
  margin: 0 0 0 80px;
`

export const ChatFormContainer = styled.div`
  padding: 0 24px;
  background-color: ${colors.DARKBLUE};
  & .input-group {
    width: 100%;
    & > label {
      margin: unset;
    }
  }
`

export const ChatDivisor = styled.hr`
  margin-top: 4px;
  background: #e9e9e9;
  border: 0;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  height: 1px;
  margin: 0;
  min-height: 1px;
`

export const InputDivisor = styled.span`
  margin-left: 5px;
  margin-right: 5px;
`

export const Close = styled.span`
  color: #fff;
  display: block;
  float: right;
  font-size: 10px;
  height: 16px;
  line-height: 16px;
  margin: 2px 0 0 0;
  text-align: center;
  width: 16px;
`

export const UnreadMessages = styled.span`
  background: #e62727;
  border: 1px solid #fff;
  border-radius: 50%;
  display: none;
  font-size: 12px;
  font-weight: bold;
  height: 28px;
  left: 0;
  line-height: 28px;
  margin: -15px 0 0 -15px;
  position: absolute;
  text-align: center;
  top: 0;
  width: 28px;
`

export const FileUpload = styled.div`
  margin-top: 7.5px;
  margin-bottom: 7.5px;
  display: flex;
  justify-content: center;
`

export const FileDownload = styled.a``

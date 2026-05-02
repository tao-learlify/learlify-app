import styled, { css } from 'styled-components'
import colors from 'colors'

export const ButtonsControlContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
`

export const ButtonControl = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: unset;
    border: none;
    &:focus {
        outline:none;
    }
`

export const ButtonFigure = styled.figure`
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 0;
    position: relative;
    ${({ settings }) => settings && css`
        flex-direction: row;
        & > i { margin-right: 5px; }
    `};
`

export const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 30%;
    background: ${colors.ORANGE};
    color: white;
    ${({ state }) => !state && css`
        background: #f26b4d;`};
`

export const IconContainerName = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 30%;
    background: #f26b4d;
`

export const ButtonFigCaption = styled.figcaption`
    font-size: 12px;
    line-height: 14px;
    font-weight: 400;
    width: 100%;
    text-align: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    margin-top: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 48px;
    ${({ settings }) => settings && css`
        margin-top: unset;
        text-overflow: unset;
        overflow: unset;
        max-width: unset;
        line-height: 40px;
    `};
`

export const VideoContainer = styled.div`
    position: relative;
    background-color: black;
    border-radius: 10px;
    margin: 5px;
`

export const Video = styled.video`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    border-radius: 10px;
    max-height: 418px;
    min-height: 418px;
    ${({ isSharing }) => isSharing || css`
        transform: scaleX(-1);
    `}
    ${({ priorizeScreenShare }) => priorizeScreenShare && css ``}
`

export const VideoSlash = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: #ebebeb;
    font-size: 3vw;
    border-radius: 10px;
    position: relative;
`

export const VideoChatOptionsContainer = styled.div`
    position: relative;
`
export const VideoChatOptions = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    height: auto;
`

export const NameText = styled.div` 
    display: flex; 
    left: 0;
    bottom: 4px;
    padding: 4px 0;
    position: absolute;
    margin: 0 4px;
    background-color: rgba(0,0,0,0.56);
    color: #fff;
    border-radius: 10px;
    font-size: 14px;
    line-height: 22px;
    overflow: hidden;
    padding: 0 4px;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    width: fit-content;
    padding: 5px;
    align-items: center;
`

export const SettingsIconContainer = styled.div` 
    display: flex; 
    right: 0;
    top: 0;
    padding: 4px 0;
    position: absolute;
    margin: 4px;
    background-color: rgba(0,0,0,0.56);
    color: #fff;
    border-radius: 10px;
    font-size: 14px;
    line-height: 22px;
    overflow: hidden;
    padding: 0 4px;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    width: fit-content;
    padding: 5px;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
`

export const SettingsContainer = styled.div` 
    display: flex; 
    right: 0;
    top: 3px;
    padding: 4px 0;
    position: absolute;
    margin: 4px;
    background-color: white;
    border-radius: 10px;
    font-size: 14px;
    line-height: 22px;
    overflow: hidden;
    padding: 0 4px;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    width: fit-content;
    padding: 5px;
    align-items: flex-start;
    flex-direction: column;
`


export const UnreadMessage = styled.div`
    color: white;
    padding: 5px 5px;
    font-size: 10px;
    position: absolute;
    top: 0;
    right: 0;
`
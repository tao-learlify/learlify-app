import styled from 'styled-components'

export const ParticipantContainer = styled.div`
    flex: 1;
`

export const ClassRoomWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    flex-direction: column;
    @media(min-width: 640px) {
        flex-direction: row;
    }
`

export const UsersContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    width: 100%;
`

export const WaitingUser = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    color: gray;
    font-size: 1.7vw;
    border-radius: 10px;
    @media screen and (max-width: 620px){
        font-size: 4vw;
    }
`

export const ImageContainer = styled.div`
    margin-bottom: 15px;
`
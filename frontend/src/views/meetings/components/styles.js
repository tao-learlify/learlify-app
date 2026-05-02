import styled from 'styled-components'

export const MeetingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 20px;
    width: 100%;
    height: 100%;
    @media (min-width: 701px) {
        padding: 10px 40px;
    }
`
export const Container = styled.div`
    display: flex; width: 100%; 
    height: 100%; 
    align-items: center;
    justify-content: center;
`

export const ChatContainer = styled.div`
    width: calc(20% - 150px);
    max-width: 150px;
    min-width: 130px;
    height: 100%;
    @media (max-width: 1520px) {
        max-width: 310px;
        min-width: 280px;
    }
    @media (max-width: 1160px) {
        max-width: 320px;
        min-width: 290px;
    }
    @media (max-width: 940px) {
        max-width: 280px;
        min-width: 250px;
    }
    @media (max-width: 840px) {
        max-width: 210px;
        min-width: 205px;
    }
    @media (max-width: 772px) {
        max-width: 100%;
        min-width: 100%;
        position:fixed;
        bottom: 0;
    }
`
import styled from 'styled-components';

export const ScheduleContainer = styled.div`
    display: flex;
`

export const ProgressBarContainer = styled.div`
    display: flex;
    padding: 20px 20px;
    @media (min-width: 701px) {
        padding: 20px 40px;
    }
`

export const StreamingContainer = styled.div`
    padding: 10px 20px;
    @media (min-width: 701px) {
        padding: 10px 40px;
    }
`

export const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 20px;
    @media (min-width: 701px) {
        padding: 20px 40px;
    }
`

export const ButtonContainer = styled.div`
    margin-top: 20px;
    padding-top: 20px;
`

export const Button = styled.div`
    display: flex;
    width: fit-content;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 2.3vw;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 700;
    border-radius: 16px;
    border: 2px solid#afafaf;
    background-color: #e5e5e5;
    color: #afafaf;
    padding: 10px;
    @media (min-width: 601px) {
        font-size: 18px;
    }

    &:hover {
        background-color: #989898;
        border-color: #989898;
    }
`

export const Title = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(60, 60, 60);
    font-size: 4vw;
    font-weight: bold;
    @media (min-width: 601px) {
        font-size: 24px;
    }
`
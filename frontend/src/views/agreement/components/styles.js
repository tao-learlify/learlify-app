import styled from 'styled-components'

export const TitleContainer = styled.div`
  display: flex;
  font-family: Dunkin;
  justify-content: center;
  align-items: center;
  
  color: rgb(60, 60, 60);
  font-size: 5vw;
  padding-bottom: 30px;
   @media (min-width: 601px) {
    font-size: 30px;
  }
`

export const TextInfo = styled.div`
  color: rgb(60, 60, 60);
  font-size: 3.5vw;
  text-align: justify;
  font-family: Monserrat-Light;
  padding: 30px 0 20px 0;
   @media (min-width: 601px) {
    font-size: 18px;
  }
`

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const KeyPointContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`

export const KeyPoint = styled.div`
  display: flex;
  align-items: center;
`

export const KeyPointText = styled.div`
  font-size: 3.8vw;
  color: rgb(60, 60, 60);
  font-family: Monserrat-Light;
  @media (min-width: 601px) {
    font-size: 24px;
  }
`

export const KeyPointTextInfo = styled.span`
  color: #17a2b8;
  font-family: Monserrat-Light;
`

export const Check = styled.img`
  width: 3vw;
  margin-right: 5px;
  @media (min-width: 601px) {
    width: 15px;
  }
`

export const DescriptionTitle = styled.h4`
  color: rgb(60, 60, 60);
  font-size: 3.2vw;
  font-family: Monserrat-Light;
  text-align: justify;
  padding-bottom: 10px;
   @media (min-width: 601px) {
    font-size: 20px;
  }
`

export const DescriptionText = styled.div`
  color: #6c757d;
  font-size: 3vw;
  text-align: justify;
  font-family: Monserrat-Light;
   @media (min-width: 601px) {
    font-size: 18px;
  }
`

export const EmojiContainer = styled.div`
  display: flex;
  align-items: center;
  padding-top: 20px;
  flex-direction: column;
  justify-content: center;
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

export const WrapperRadioGroup = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 20px;
`
export const RadioGroup = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
  margin-top: 10px;
`

export const WrapperCustomize = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
    @media (min-width: 701px) {
        padding: 10px 40px;
    }
`

export const LabelInput = styled.small`
  color: #6c757d;
  font-size: 3vw;
  text-align: justify;
  position: relative;
  bottom: 1px;
   @media (min-width: 601px) {
    font-size: 18px;
  }
`
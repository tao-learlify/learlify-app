import React from 'react'
import clsx from 'clsx'

export function TitleContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:font-[Dunkin] tw:justify-center tw:items-center tw:text-[#3c3c3c] tw:text-[5vw] tw:pb-8 md:tw:text-3xl', className)} {...rest}>{children}</div>
}
export function TextInfo({ children, className, ...rest }) {
  return <div className={clsx('tw:text-[#3c3c3c] tw:text-[3.5vw] tw:text-justify tw:font-[Monserrat-Light] tw:py-8 tw:px-0 md:tw:text-lg', className)} {...rest}>{children}</div>
}
export function ImageContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:justify-center tw:items-center', className)} {...rest}>{children}</div>
}
export function KeyPointContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:justify-evenly tw:flex-wrap', className)} {...rest}>{children}</div>
}
export function KeyPoint({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:items-center', className)} {...rest}>{children}</div>
}
export function KeyPointText({ children, className, ...rest }) {
  return <div className={clsx('tw:text-[3.8vw] tw:text-[#3c3c3c] tw:font-[Monserrat-Light] md:tw:text-2xl', className)} {...rest}>{children}</div>
}
export function KeyPointTextInfo({ children, className, ...rest }) {
  return <span className={clsx('tw:text-[#17a2b8] tw:font-[Monserrat-Light]', className)} {...rest}>{children}</span>
}
export function Check({ className, ...rest }) {
  return <img className={clsx('tw:w-[3vw] tw:mr-1.5 md:tw:w-4', className)} {...rest} />
}
export function DescriptionTitle({ children, className, ...rest }) {
  return <h4 className={clsx('tw:text-[#3c3c3c] tw:text-[3.2vw] tw:font-[Monserrat-Light] tw:text-justify tw:pb-2.5 md:tw:text-xl', className)} {...rest}>{children}</h4>
}
export function DescriptionText({ children, className, ...rest }) {
  return <div className={clsx('tw:text-[#6c757d] tw:text-[3vw] tw:text-justify tw:font-[Monserrat-Light] md:tw:text-lg', className)} {...rest}>{children}</div>
}
export function EmojiContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:items-center tw:pt-5 tw:flex-col tw:justify-center', className)} {...rest}>{children}</div>
}
export function Button({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:w-fit tw:justify-center tw:items-center tw:cursor-pointer tw:uppercase tw:tracking-[0.8px] tw:font-bold tw:rounded-2xl tw:border-2 tw:border-[#afafaf] tw:bg-[#e5e5e5] tw:text-[#afafaf] tw:px-2.5 tw:py-2.5 tw:text-[2.3vw] md:tw:text-lg hover:tw:bg-[#989898] hover:tw:border-[#989898]', className)} {...rest}>{children}</div>
}
export function WrapperRadioGroup({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:items-start tw:flex-col tw:justify-center tw:mb-5', className)} {...rest}>{children}</div>
}
export function RadioGroup({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:items-start tw:flex-col tw:justify-center tw:ml-2.5 tw:mt-2.5', className)} {...rest}>{children}</div>
}
export function WrapperCustomize({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:flex-col tw:justify-center tw:items-center tw:px-5 tw:py-2.5 md:tw:px-10 md:tw:py-2.5', className)} {...rest}>{children}</div>
}
export function LabelInput({ children, className, ...rest }) {
  return <small className={clsx('tw:text-[#6c757d] tw:text-[3vw] tw:text-justify tw:relative tw:-bottom-px md:tw:text-lg', className)} {...rest}>{children}</small>
}

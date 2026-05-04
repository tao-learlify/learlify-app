import React from 'react'
import clsx from 'clsx'

export function ButtonsControlContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:items-center tw:justify-center tw:mt-[10px]', className)} {...rest}>{children}</div>
}

export function ButtonControl({ children, className, ...rest }) {
  return <button className={clsx('tw:flex tw:flex-col tw:items-center tw:justify-center tw:bg-transparent tw:border-none focus:tw:outline-none', className)} {...rest}>{children}</button>
}

export function ButtonFigure({ children, className, settings, ...rest }) {
  return (
    <figure className={clsx('tw:flex tw:flex-col tw:items-center tw:m-0 tw:relative', settings && 'tw:flex-row', className)} {...rest}>
      {children}
    </figure>
  )
}

export function IconContainer({ children, className, state, ...rest }) {
  return (
    <div
      className={clsx(
        'tw:flex tw:items-center tw:justify-center tw:w-12 tw:h-12 tw:rounded-[30%] tw:text-white',
        state ? 'tw:bg-[#FF9800]' : 'tw:bg-[#f26b4d]',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function IconContainerName({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:items-center tw:justify-center tw:w-6 tw:h-6 tw:rounded-[30%] tw:bg-[#f26b4d]', className)} {...rest}>{children}</div>
}

export function ButtonFigCaption({ children, className, settings, ...rest }) {
  return (
    <figcaption className={clsx(
      'tw:text-xs tw:leading-[14px] tw:font-normal tw:w-full tw:text-center tw:select-none tw:mt-2 tw:whitespace-nowrap tw:overflow-hidden tw:text-ellipsis tw:max-w-[48px]',
      settings && 'tw:mt-0 tw:text-ellipsis-[unset] tw:overflow-visible tw:max-w-none tw:leading-10',
      className
    )} {...rest}>{children}</figcaption>
  )
}

export function VideoContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:relative tw:bg-black tw:rounded-[10px] tw:m-[5px]', className)} {...rest}>{children}</div>
}

export function Video({ children, className, isSharing, priorizeScreenShare, ...rest }) {
  return (
    <video
      className={clsx(
        'tw:flex tw:items-center tw:flex-col tw:w-full tw:rounded-[10px] tw:max-h-[418px] tw:min-h-[418px]',
        !isSharing && 'tw:scale-x-[-1]',
        className
      )}
      {...rest}
    >
      {children}
    </video>
  )
}

export function VideoSlash({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:items-center tw:justify-center tw:h-full tw:w-full tw:bg-[#ebebeb] tw:text-[3vw] tw:rounded-[10px] tw:relative', className)} {...rest}>{children}</div>
}

export function VideoChatOptionsContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:relative', className)} {...rest}>{children}</div>
}

export function VideoChatOptions({ children, className, ...rest }) {
  return <div className={clsx('tw:absolute tw:left-0 tw:right-0 tw:h-auto', className)} {...rest}>{children}</div>
}

export function NameText({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:left-0 tw:bottom-1 tw:py-1 tw:absolute tw:mx-1 tw:bg-black/56 tw:text-white tw:rounded-[10px] tw:text-sm tw:leading-[22px] tw:overflow-hidden tw:text-ellipsis tw:whitespace-nowrap tw:select-none tw:w-fit tw:px-[5px] tw:items-center', className)} {...rest}>{children}</div>
}

export function SettingsIconContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:right-0 tw:top-0 tw:py-1 tw:absolute tw:m-1 tw:bg-black/56 tw:text-white tw:rounded-[10px] tw:text-sm tw:leading-[22px] tw:overflow-hidden tw:text-ellipsis tw:whitespace-nowrap tw:select-none tw:w-fit tw:px-[5px] tw:items-center tw:justify-end tw:cursor-pointer', className)} {...rest}>{children}</div>
}

export function SettingsContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:right-0 tw:top-[3px] tw:py-1 tw:absolute tw:m-1 tw:bg-white tw:rounded-[10px] tw:text-sm tw:leading-[22px] tw:overflow-hidden tw:select-none tw:w-fit tw:px-[5px] tw:items-start tw:flex-col', className)} {...rest}>{children}</div>
}

export function UnreadMessage({ children, className, ...rest }) {
  return <div className={clsx('tw:text-white tw:px-[5px] tw:text-[10px] tw:absolute tw:top-0 tw:right-0', className)} {...rest}>{children}</div>
}

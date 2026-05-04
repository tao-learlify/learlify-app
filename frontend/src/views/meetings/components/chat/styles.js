import React from 'react'
import clsx from 'clsx'

export function ChatContainer({ children, className, ...rest }) {
  return (
    <div
      className={clsx(
        'tw:text-xs tw:h-[calc(100%-80px)] tw:w-[calc(40%-80px)] tw:max-w-[320px] tw:fixed tw:right-0 tw:bottom-0 tw:bg-[#2C3E50] tw:shadow-lg tw:animate-[showInChat_0.2s_ease-in_forwards]',
        'max-md:tw:max-w-[300px] max-sm:tw:w-full max-sm:tw:max-w-full max-sm:tw:pb-[30px]',
        className
      )}
      {...rest}
    >
      <style>{`
        @keyframes showInChat { from { opacity:0; right:-300px } to { opacity:1; right:0 } }
        @media (max-width:772px) { @keyframes showInChat { from { opacity:0; bottom:-300px } to { opacity:1; bottom:0 } } }
      `}</style>
      {children}
    </div>
  )
}

export function Header({ children, className, ...rest }) {
  return <header className={clsx('tw:bg-[#333] tw:text-white tw:cursor-pointer tw:px-[22px] tw:py-[11px] tw:pt-[11px]', className)} {...rest}>{children}</header>
}

export function ChatBody({ children, className, ...rest }) {
  return <div className={clsx('tw:z-[1] tw:bg-[#2C3E50] tw:h-4/5 tw:flex tw:flex-col', className)} {...rest}>{children}</div>
}

export function ChatScreen({ children, className, ...rest }) {
  return <div className={clsx('tw:px-6 tw:py-2 tw:overflow-y-scroll tw:h-full tw:items-center', className)} {...rest}>{children}</div>
}

export function MessageContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:my-4', className)} {...rest}>{children}</div>
}

export function ChatAvatar({ className, ...rest }) {
  return <img className={clsx('tw:rounded-full tw:float-left', className)} {...rest} />
}

export function Content({ children, className, ...rest }) {
  return <div className={clsx('tw:ml-14', className)} {...rest}>{children}</div>
}

export function TextDate({ children, className, ...rest }) {
  return <span className={clsx('tw:float-right tw:text-[9.5px] tw:text-[#58CC02]', className)} {...rest}>{children}</span>
}

export function ChatMessage({ children, className, ...rest }) {
  return <p className={clsx('tw:m-0 tw:mb-[5px] tw:text-[11px]', className)} {...rest}>{children}</p>
}

export function ChatAction({ children, className, ...rest }) {
  return <p className={clsx('tw:text-[10px] tw:italic tw:m-0 tw:ml-20', className)} {...rest}>{children}</p>
}

export function ChatFormContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:px-6 tw:bg-[#2C3E50]', className)} {...rest}>{children}</div>
}

export function ChatDivisor({ className, ...rest }) {
  return <hr className={clsx('tw:mt-1 tw:bg-[#e9e9e9] tw:border-0 tw:h-px tw:m-0', className)} {...rest} />
}

export function InputDivisor({ className, ...rest }) {
  return <span className={clsx('tw:mx-[5px]', className)} {...rest} />
}

export function Close({ children, className, ...rest }) {
  return <span className={clsx('tw:text-white tw:block tw:float-right tw:text-[10px] tw:h-4 tw:leading-4 tw:mt-0.5 tw:text-center tw:w-4', className)} {...rest}>{children}</span>
}

export function UnreadMessages({ children, className, ...rest }) {
  return <span className={clsx('tw:bg-[#e62727] tw:border tw:border-white tw:rounded-full tw:hidden tw:text-xs tw:font-bold tw:h-7 tw:leading-7 tw:absolute tw:text-center tw:top-0 tw:w-7 tw:left-0 tw:-mt-[15px] tw:-ml-[15px]', className)} {...rest}>{children}</span>
}

export function FileUpload({ children, className, ...rest }) {
  return <div className={clsx('tw:mt-[7.5px] tw:mb-[7.5px] tw:flex tw:justify-center', className)} {...rest}>{children}</div>
}

export function FileDownload(props) {
  return <a {...props} />
}

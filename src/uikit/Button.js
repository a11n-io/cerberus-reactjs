import React from 'react'
import { clsx } from 'clsx'

export default function Button(props) {
  const { children, outline, accent, className, ...rest } = props

  const classNames = clsx(
    {
      btn: true,
      'btn-default': !outline,
      'btn-outline': outline,
      'btn-accent': accent
    },
    className
  )

  return (
    <>
      <button className={classNames} {...rest}>
        {children}
      </button>
    </>
  )
}

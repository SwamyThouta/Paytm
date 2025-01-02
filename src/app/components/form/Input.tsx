
'use client'
import React from 'react'
import { ChangeEvent, LegacyRef, KeyboardEventHandler } from "react";

interface Props {
  id?: string,
  placeholder?: string,
  name?: string,
  value?: string,
  inputRef?: LegacyRef<HTMLInputElement>;
  type?: string,
  className?: string,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: KeyboardEventHandler<HTMLInputElement>;
  focus?: boolean,
  maxLength?: number
  defaultValue?: string
  disable?:boolean
}

export default function Input({
  placeholder,
  value,
  name,
  type,
  className,
  inputRef,
  onChange,
  onKeyPress,
  focus,
  maxLength,
  defaultValue,
  disable
}: Props) {
  return (

    <input
      name={name}
      type={type}
      multiple
      ref={inputRef}
      defaultValue={defaultValue}
      className={className}
      autoFocus={focus}
      placeholder={placeholder} onChange={onChange} onKeyPress ={onKeyPress}
      maxLength={maxLength} disabled={disable} />
      

  )
}
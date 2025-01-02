import React, { ChangeEvent, LegacyRef } from "react";

interface Props {
  placeholder: string;
  id: string;
  name?: string;
  ref?: LegacyRef<HTMLInputElement>;
  inputValue?: string;
  focus?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  autocomplete: boolean;
  className: string;
}

export default function TextInput({
  id,
  placeholder,
  name,
  ref,
  inputValue,
  focus,
  onChange,
  autocomplete,
  className,
}: Props) {
  return (
    <>
      <input
        defaultValue={inputValue || ""}
        ref={ref}
        onChange={onChange}
        name={name}
        type="text"
        id={id}
        autoFocus={focus}
        autoComplete={autocomplete ? "on" : "off"}
        className={"border border-[#c0a07c]  bg-inherit" + (className || "")}
        placeholder={placeholder}
      />
    </>
  );
}

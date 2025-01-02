import React, { ChangeEvent } from "react";

interface Props {
  placeholder: string;
  id: string;
  name?: string;
  inputValue?: string;
  className: string;
  focus?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  autocomplete: boolean;
  // options?: { [key: string]: string | number }[];
}

export default function Search({ placeholder, id, name, onChange }: Props) {
  return (
    <>
      <div className="bg-gray-800">
        <input
          type="search"
          name={name}
          id={id}
          className="bg-gray-800 text-white placeholder-gray-400 py-2 px-4 rounded-md w-80  "
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
    </>
  );
}

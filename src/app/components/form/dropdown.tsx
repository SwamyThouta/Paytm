import React, { ChangeEvent } from "react";

interface SelectOptionProps {
  options: string[];
  selectedValue: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  className: string;
}

export default function SelectOption({
  options,
  selectedValue,
  onChange,
  className,
}: SelectOptionProps) {
  return (
    <div>
      <select
        value={selectedValue}
        onChange={onChange}
        className={
          "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" +
          (className || "")
        }
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
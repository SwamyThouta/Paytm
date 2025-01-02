// import React from "react";

// interface Props {
//     type?: "button" | "submit";
//     disabled?: boolean;
//     className?: string;
//     onClick?: () => void;
//     title: string;
//     icon?: JSX.Element;
// }

// export default function Button({
//     type,
//     disabled,
//     className,
//     onClick,
//     title,
//     icon,
// }: Props) {
//     return (
//         <>
//             <button type={type}
//                 disabled={disabled || false}
//                 onClick={onClick} className={"group relative inline-block overflow-hidden rounded  text-white border-double " + (className || "")}>
//                 <span className="absolute left-0 top-0 mb-0 flex h-full w-0 translate-x-0 transform bg-indigo-600 bg-opacity-0 border-1 border-blue-600 opacity-90 transition-all duration-300 ease-out group-hover:w-full"></span>
//                 <span className="relative group-hover:text-white"> {icon ? icon : ''} {title}</span>
//             </button>
//         </>
//     );
// }
import React from 'react';

interface Props {
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  onClick?: (item: any) => void;
  title: string;
  id: string;
  // Allow any React node for the icon
  icon?: React.ReactNode;
  // Added iconPosition prop (optional)
  iconPosition?: 'before' | 'after'; // Default: 'before'
}

export default function Button({
  type,
  disabled,
  className,
  onClick,
  title,
  id,
  icon,
  iconPosition = 'before', // Default position
}: Props) {
  return (
    <button
      type={type}
      id={id}
      disabled={disabled || false}
      onClick={onClick}
      className={
        // Use spread operator to combine class names and apply iconPosition class
        `${className || ''} ${iconPosition === 'before' ? 'icon-before' : 'icon-after'}`
      }
    >
      {/* Conditionally render the icon based on iconPosition */}
      {iconPosition === 'before' && icon && (
        <span className="icon">{icon}</span>
      )}
      {title}
      {iconPosition === 'after' && icon && (
        <span className="icon">{icon}</span>
      )}
    </button>
  );
}

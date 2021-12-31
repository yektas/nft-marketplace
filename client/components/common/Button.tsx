import React from "react";
import { classNames } from "../../utils";

interface Props {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
  type?: "primary" | "secondary";
  className?: string;
  props?: any;
}

const defaultClasses =
  " flex items-center justify-center w-full py-4 leading-none rounded-full px-7 font-semibold transition";

const Button = React.forwardRef(({ children, className, type, onClick, ...props }: Props) => {
  const primary = "hover:bg-pink-500 text-white  bg-primary";
  const secondary =
    "text-gray-400 border-2 border-gray-600 shadow-xs shadow-background bg-background hover:border-gray-300 hover:text-gray-300";

  let variantClasses = primary;
  if (type && type == "secondary") {
    variantClasses = secondary;
  }
  return (
    <button {...props} onClick={onClick} className={classNames(defaultClasses, variantClasses)}>
      {children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;

import React from "react";

interface Props {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
  className?: string;
}

const defaultClasses =
  " flex items-center justify-center w-full py-4 leading-none rounded-full shadow-sm shadow-background bg-primary px-7";

const Button = ({ children, className, onClick }: Props) => {
  const finalclassNames = className ? className + defaultClasses : defaultClasses;
  return (
    <button onClick={onClick} className={finalclassNames}>
      <span className="font-semibold text-white transition duration-200 ">{children}</span>
    </button>
  );
};

export default Button;

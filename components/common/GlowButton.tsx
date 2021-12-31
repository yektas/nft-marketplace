import React from "react";

interface Props {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
}

export const GlowButton = ({ children, onClick }: Props) => {
  return (
    <div className="flex items-center py-8">
      <div className="relative group">
        <div className="absolute transition duration-200 rounded-full opacity-60 -inset-0.5 bg-gradient-to-tl from-indigo-500 via-purple-500 to-pink-500 blur group-hover:opacity-100 group-hover:duration-200 animate-tilt"></div>
        <button
          onClick={onClick}
          className="relative flex items-center py-4 leading-none rounded-full bg-gradient-to-tl from-indigo-500 via-purple-500 to-pink-500 px-7"
        >
          <span className="font-medium text-gray-100 transition duration-200 group-hover:text-white">
            {children}
          </span>
        </button>
      </div>
    </div>
  );
};

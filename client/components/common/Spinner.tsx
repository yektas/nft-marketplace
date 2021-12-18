import * as React from "react";
import GridLoader from "react-spinners/GridLoader";

export default function Spinner() {
  const color = "rgb(121, 62, 249)";
  return (
    <div className="fixed top-0 left-0 z-50 block w-full h-full bg-gray-900 opacity-80 ">
      <div className="flex items-center justify-center h-full">
        <GridLoader color={color} loading={true} size={35} />
      </div>
    </div>
  );
}

import * as React from "react";
import GridLoader from "react-spinners/GridLoader";

export default function Spinner() {
  const color = "#DB2777";
  return (
    <div className="fixed top-0 left-0 z-50 block w-full h-full bg-background opacity-90 ">
      <div className="flex items-center justify-center h-full">
        <GridLoader color={color} loading={true} size={35} />
      </div>
    </div>
  );
}

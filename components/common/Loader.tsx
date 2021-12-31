import React from "react";
import Lottie from "react-lottie";
import * as loaderData2 from "../../animations/loading2.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loaderData2,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

interface Props {}

export const Loader = (props: Props) => {
  return (
    <div>
      <Lottie options={defaultOptions} />
    </div>
  );
};

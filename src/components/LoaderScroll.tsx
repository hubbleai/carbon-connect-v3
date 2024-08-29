import React from 'react';

import { ColorRing } from "react-loader-spinner";

const LoaderScroll = ({ height = 50, width = 50 }) => {
  return (
    <div className="cc-flex cc-justify-center cc-items-center cc-h-auto  ">
    <ColorRing
      visible={true}
      height={height}
      width={width}
      ariaLabel="color-ring-loading"
      wrapperStyle={{}}
      wrapperClass="color-ring-wrapper"
      colors={["#0BABFB", "#0BABFB", "#0BABFB", "#0BABFB", "#0BABFB"]}
    />
  </div>
  )
}

export default LoaderScroll
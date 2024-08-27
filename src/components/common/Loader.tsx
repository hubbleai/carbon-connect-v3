import React from "react";
import { ColorRing } from "react-loader-spinner";

const Loader = ({ height = 50, width = 50 }) => {
  return (
    <div className="cc-flex cc-justify-center cc-items-center cc-h-auto cc-absolute cc-left-1/2 cc-top-2/4 -cc-translate-x-1/2 -cc-translate-y-1/2">
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
  );
};

export default Loader;

import React, { useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type PropsInfo ={
  selectedFiles:number[]
  selectFilesMessage:number[]
}

const Sync = ({selectedFiles , selectFilesMessage}:PropsInfo) => {
  const [uploadProgress, setUploadProgres] = useState<number>(73);
  return (
    <div className="cc-p-[16px]">
      <div className="cc-rounded-[12px] md:!cc-border-0  cc-border cc-border-[#ECECED] cc-h-[591px] cc-flex cc-flex-col cc-justify-center cc-items-center cc-gap-[12px]">
        <div className="cc-w-[56px] cc-h-[56px] ">
          <CircularProgressbarWithChildren
            value={uploadProgress}
            styles={buildStyles({
              textSize: "23px",
              pathColor: `#0BABFB, ${uploadProgress / 100})`,
              textColor: "#8C8A94",
              trailColor: "#d6d6d6",
              backgroundColor: "#3e98c7",
            })}
          >
            <div className=" cc-text-[14px] cc-text-[#8C8A94] cc-font-medium cc-absolute cc-top-2/4 cc-left-1/2 cc-translate-x-[-50%] cc-translate-y-[-50%]">{`${Math.round(
              uploadProgress
            )}%`}</div>
          </CircularProgressbarWithChildren>
        </div>
        <p className="cc-text-base cc-font-semibold">
        Syncing{" "}
              {selectedFiles.length > 0 && `${selectedFiles.length} Channel`}{" "}
            
              {selectFilesMessage.length > 0 &&
                `${
                  selectFilesMessage.length > 0 && selectedFiles.length > 0
                    ? "&"
                    : ""
                } ${selectFilesMessage.length} Messages`}...
        </p>
      </div>
    </div>
  );
};

export default Sync;

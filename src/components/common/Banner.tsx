import React, { useEffect } from "react";
import { images } from "@assets/index";

export type BannerState = {
  message: string | null;
  ctaText?: string | null;
  type?: "WARN" | "SUCCESS" | "ERROR" | null;
  additionalInfo?: string | null;
  persist?: boolean;
};

const BG_COLORS = {
  ERROR: "#FEF2F2",
  SUCCESS: "#E3FFEE",
  WARN: "#FFFDDC",
};

const BG_COLORS_DARK = {
  ERROR: "#301C1C",
  SUCCESS: "#11301F",
  WARN: "#2C2614",
};

const ICONS = {
  ERROR: images.warningTick,
  SUCCESS: images.coreTick,
  WARN: images.infoClear,
};

const ctaClasses = {
  ERROR: "cc-text-[#F03D3D] cc-border-[#FF7373] hover:cc-text-[#BA1B1B]",
  SUCCESS: "cc-text-[#0ED065] cc-border-[#2AE77F] hover:cc-text-[#058F43]",
  WARN: "cc-text-[#FCBF04] cc-border-[#FFDE1E] hover:cc-text-[#B96904]",
};

const Banner = ({
  bannerState,
  setBannerState,
}: {
  bannerState: BannerState;
  setBannerState: React.Dispatch<React.SetStateAction<BannerState>>;
}) => {
  useEffect(() => {
    if (!bannerState.persist) {
      const interval = setInterval(
        () => setBannerState({ message: null, type: null, ctaText: null }),
        5000
      );
      return () => clearInterval(interval);
    }
  }, [bannerState]);

  const bgColor = BG_COLORS[bannerState.type || "SUCCESS"];
  const bgColorDark = BG_COLORS_DARK[bannerState.type || "SUCCESS"];
  const icon = ICONS[bannerState.type || "SUCCESS"];

  return bannerState.message ? (
    <div
      className={`cc-flex cc-justify-between cc-items-center cc-bg-[${bgColor}] dark:cc-bg-[${bgColorDark}] cc-p-[8px_24px_8px_16px] md:cc-p-[4px_24px_4px_24px]`}
    >
      <div className="cc-flex cc-items-center">
        <img src={icon} alt="" className="cc-mr-[10px]" />
        <div>
          <span className="cc-text-[14px] cc-leading-[24px] cc-font-bold cc-text-[#000000] dark:cc-text-dark-text-white cc-mr-[10px]">
            {bannerState.message}
          </span>
          <span className="md:cc-block cc-text-[14px] cc-leading-[24px] cc-font-medium cc-text-[#0000007A] dark:cc-text-dark-text-gray">
            {bannerState.additionalInfo}
          </span>
        </div>
      </div>
      <div className="cc-flex cc-items-center">
        <img src={images.verticleSeperate} alt="" />
        <p
          onClick={() =>
            setBannerState({
              ctaText: null,
              message: null,
              type: null,
            })
          }
          className={`cc-text-[14px] cc-leading-[24px] cc-font-semibold cc-ml-[10px] cc-border-b-[2px] cc-cursor-pointer ${
            ctaClasses[bannerState.type || "SUCCESS"]
          }`}
        >
          {bannerState.ctaText || "Got It"}
        </p>
      </div>
    </div>
  ) : null;
};

export default Banner;

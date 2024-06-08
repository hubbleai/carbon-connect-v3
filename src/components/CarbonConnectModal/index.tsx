import React, { ReactNode, useEffect, useState } from "react";
import { images } from "../../assets/index";
import ReactPortal from "../../utils/ReactPortal";
import { emptyFunction } from "../../utils/helper-functions";
import { Button } from "../Buttons";
// import { toast } from "react-toastify";

export interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  showSecondaryButton?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  onCloseModal?: () => void;
  children?: ReactNode;
  customClassName?: string;
  wrapperId?: string;
  showCross?: boolean;
  showButtons?: boolean;
  primaryButtonDisabled?: boolean;
}

function CarbonConnectModal({
  isOpen = false,
  onPrimaryButtonClick = emptyFunction,
  onSecondaryButtonClick = emptyFunction,
  onCloseModal = emptyFunction,
  customClassName = "",
  wrapperId = "react-portal-carbonconnect-modal-container",
}: ModalProps) {
  useEffect(() => {
    if (
      isOpen &&
      typeof window !== "undefined" &&
      typeof document !== "undefined"
    )
      document.body.classList.add("hasModal");
    return () => {
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        document.body.classList.remove("hasModal");
      }
    };
  }, [isOpen]);

  const handleCloseModal = () => {
    onCloseModal();
  };

  const handlePrimaryButtonClick = () => {
    onPrimaryButtonClick();
  };

  const handleSecondaryButtonClick = () => {
    onSecondaryButtonClick();
    handleCloseModal();
  };

  return (
    <ReactPortal wrapperId={wrapperId}>
      <div
        className="cc-fixed cc-inset-0 cc-flex cc-items-center cc-justify-center cc-bg-black cc-bg-opacity-20 cc-z-30"
        style={{ display: isOpen ? "flex" : "none" }}
      >
        <div
          className={`cc-bg-white cc-py-8 cc-rounded-2xl cc-border cc-border-color-black-7 cc-shadow-modal cc-max-h-[80vh] cc-w-[415px] ${customClassName}`}
        >
          <div className="cc-px-8 cc-pb-8 cc-border-b cc-border-color-black-7">
            <div className="cc-mb-6">
              <img
                src={images.logoCarbon}
                alt="Rubber logo"
                className="cc-h-12 cc-w-21"
              />
            </div>
            <h2 className="cc-font-medium cc-mb-6 cc-text-2xl cc-tracking-tight">
              <span className="cc-font-bold">Rubber</span> uses{" "}
              <span className="cc-font-bold">Carbon</span> to connect your data
            </h2>
            <div className="cc-flex cc-flex-col cc-gap-y-5 cc-py-2">
              <div className="cc-flex cc-items-start">
                <span className="cc-h-10 cc-w-10 cc-mr-4 cc-flex cc-shrink-0 cc-items-center cc-justify-center cc-bg-gray-50 cc-rounded-lg">
                  <img src={images.lock} alt="Lock" className="cc-h-6 cc-w-6" />
                </span>
                <div>
                  <p className="cc-font-semibold cc-text-lg ">Private</p>
                  <p className="cc-text-low_em cc-text-base cc-font-semibold">
                    Your credentials will never be made available to Rubber
                  </p>
                </div>
              </div>
              <div className="cc-flex cc-items-start">
                <span className="cc-h-10 cc-w-10 cc-mr-4 cc-flex cc-shrink-0 cc-items-center cc-justify-center cc-bg-gray-50 cc-rounded-lg">
                  <img
                    src={images.shield}
                    alt="Shield"
                    className="cc-h-6 cc-w-6"
                  />
                </span>
                <div>
                  <p className="cc-font-semibold cc-text-lg">Secure</p>
                  <p className="cc-text-low_em cc-font-semibold cc-text-base">
                    By connecting with Carbon, your data is securely shared with
                    Rubber and 3rd parties like OpenAI.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="cc-px-8 cc-pt-6 cc-flex cc-flex-col cc-gap-y-5">
            <div className="">
              <label className="cc-flex">
                <span className="cc-ml-2 cc-text-sm cc-font-semibold cc-text-high_em">
                  By continuing, you agree to Carbon’s{" "}
                  <a href="/terms" className="cc-font-semibold cc-text-info_em">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="cc-font-semibold cc-text-info_em"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            </div>
            <div>
              <Button
                label="Connect"
                widthSize="full"
                onClick={() => handlePrimaryButtonClick()}
              />
            </div>
            <div>
              <Button
                label="Go back"
                widthSize="full"
                type={"outline"}
                onClick={() => handleSecondaryButtonClick()}
              />
            </div>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
}

export default CarbonConnectModal;

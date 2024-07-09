import React, { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import carbonLogo from "@assets/carbon.svg";
import LockIcon from "@assets/svgIcons/lock.svg";
import Shield from "@assets/svgIcons/shield.svg";

import { Button } from "@components/common/design-system/Button";
import { useCarbon } from "../../context/CarbonContext";
import { ActiveStep } from "../../typing/shared";

import { useTheme } from "next-themes";
import Loader from "../common/Loader";
export interface ModalProps {
  onPrimaryButtonClick?: (step: ActiveStep) => void;

  setCarbonActive: Dispatch<SetStateAction<boolean>>;
}

function ConnectScreen({
  onPrimaryButtonClick = () => {},
  setCarbonActive,
}: ModalProps) {
  const {
    whiteLabelingData,
    brandIcon,
    orgName,
    entryPointIntegrationObject,
    tosURL,
    privacyPolicyURL,
    entryPoint,
    loading,
    navigateBackURL,
    manageModalOpenState,
  } = useCarbon();

  const handlePrimaryButtonClick = () => {
    setCarbonActive(false);
    if (entryPointIntegrationObject?.active) {
      onPrimaryButtonClick(entryPointIntegrationObject.data_source_type);
    } else {
      onPrimaryButtonClick("INTEGRATION_LIST");
    }
  };

  const isWhiteLabeledOrg = Boolean(whiteLabelingData?.remove_branding);
  const isWhiteLabeledEntryPoint = Boolean(
    entryPoint &&
      whiteLabelingData?.integrations &&
      whiteLabelingData?.integrations?.[entryPoint]
  );

  const navigateBack = () => {
    if (navigateBackURL) window.open(navigateBackURL, "_self");
    else manageModalOpenState(false);
  };

  return (
    <div className="sm:cc-max-h-[90vh] sm:cc-w-[415px] sm:cc-h-[703px] cc-gap-0 sm:cc-rounded-[20px]">
      <div>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="cc-p-8 cc-border-b cc-border-color-black-7 dark:cc-border-dark-border-color cc-flex-grow cc-overflow-auto">
              <div className="cc-mb-6">
                <div className="cc-flex cc-pt-8 -cc-space-x-2">
                  <img
                    src={brandIcon}
                    alt={`${orgName} Icon`}
                    className="cc-h-12 cc-w-21"
                  />
                  {!isWhiteLabeledOrg ? (
                    <img
                      src={carbonLogo}
                      alt="Carbon logo"
                      className="cc-h-12 cc-w-21"
                    />
                  ) : null}
                </div>
              </div>
              {isWhiteLabeledOrg ? (
                <h2 className="cc-font-medium cc-mb-6 cc-text-2xl cc-tracking-tight dark:cc-text-dark-text-white">
                  <span className="cc-font-bold">{orgName}</span> wants to
                  access your data{" "}
                  {entryPointIntegrationObject?.announcementName && (
                    <>
                      <span>on</span>
                      <span className="cc-font-bold">
                        {` ${entryPointIntegrationObject?.name}`}
                      </span>
                    </>
                  )}
                </h2>
              ) : (
                <h2 className="cc-font-medium cc-mb-6 cc-text-2xl cc-tracking-tight dark:cc-text-dark-text-white">
                  <span className="cc-font-bold">{orgName}</span> uses{" "}
                  <span className="cc-font-bold">Carbon</span> to connect{" "}
                  {entryPointIntegrationObject?.announcementName ? (
                    <span className="cc-font-bold">
                      {entryPointIntegrationObject?.name}
                    </span>
                  ) : (
                    <span>your data</span>
                  )}
                </h2>
              )}
              <div className="cc-flex cc-flex-col cc-gap-y-5 cc-py-2">
                <div className="cc-flex cc-items-start">
                  <span className="cc-h-10 cc-w-10 cc-mr-4 cc-flex cc-shrink-0 cc-items-center cc-justify-center cc-bg-gray-50 cc-rounded-lg dark:cc-bg-svg-background">
                    <img
                      src={LockIcon}
                      alt="Lock"
                      className="cc-h-6 cc-w-6  dark:cc-invert-[1] dark:cc-hue-rotate-180"
                    />
                  </span>
                  <div>
                    <p className="cc-font-semibold cc-text-lg  dark:cc-text-dark-text-white">
                      Private
                    </p>
                    <p className="cc-text-low_em cc-text-base cc-font-semibold dark:cc-text-dark-text-gray">
                      Your credentials will never be made available to {orgName}
                    </p>
                  </div>
                </div>
                <div className="cc-flex cc-items-start">
                  <span className="cc-h-10 cc-w-10 cc-mr-4 cc-flex cc-shrink-0 cc-items-center cc-justify-center cc-bg-gray-50 cc-rounded-lg dark:cc-bg-svg-background">
                    <img
                      src={Shield}
                      alt="Shield"
                      className="cc-h-6 cc-w-6 dark:cc-invert-[1] dark:cc-hue-rotate-180"
                    />
                  </span>
                  <div>
                    <p className="cc-font-semibold cc-text-lg dark:cc-text-dark-text-white">
                      Secure
                    </p>
                    <p className="cc-text-low_em cc-font-semibold cc-text-base dark:cc-text-dark-text-gray">
                      {isWhiteLabeledOrg
                        ? `By connecting, your data is securely shared with ${orgName} and 3rd parties like OpenAI.`
                        : `By connecting with Carbon, your data is securely shared with ${orgName} and 3rd parties like OpenAI.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="cc-px-8 cc-pt-6 cc-pb-8 cc-flex cc-flex-col cc-gap-y-5">
              <div className="">
                <label className="cc-flex">
                  <span className="cc-text-sm cc-font-semibold cc-text-high_em dark:cc-text-dark-text-white">
                    By continuing, you agree to{" "}
                    {isWhiteLabeledOrg
                      ? isWhiteLabeledEntryPoint
                        ? orgName + "'s"
                        : "the following"
                      : "Carbon’s"}{" "}
                    <a
                      href={tosURL}
                      className="cc-font-semibold cc-text-info_em"
                      target="_blank"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href={privacyPolicyURL}
                      className="cc-font-semibold cc-text-info_em"
                      target="_blank"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              </div>
              <Button size="lg" onClick={handlePrimaryButtonClick}>
                Connect
              </Button>
              <Button
                variant="neutral-white-fix"
                size="lg"
                onClick={() => navigateBack()}
              >
                Go back
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ConnectScreen;

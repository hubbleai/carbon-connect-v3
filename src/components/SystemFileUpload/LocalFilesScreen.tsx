import React, { useEffect, useState } from "react";
import {
  DialogHeader,
  DialogTitle,
} from "@components/common/design-system/Dialog";
import BackIcon from "@assets/svgIcons/back-icon.svg";

import RefreshIcon from "@assets/svgIcons/refresh-icon.svg";
import { Button } from "@components/common/design-system/Button";
import {
  IntegrationItemType,
  INTEGRATIONS_LIST,
} from "@utils/integrationModalconstants";

import { ActiveStep } from "../../typing/shared";
import { useCarbon } from "../../context/CarbonContext";
import SyncedFilesList from "../CarbonFilePicker/SyncedFilesList";
import { SyncingModes } from "../CarbonFilePicker/CarbonFilePicker";
import SystemFileUpload from "./SystemFileUpload";
import Banner, { BannerState } from "../common/Banner";
import { IntegrationName } from "../../typing/shared";

export default function LocalFilesScreen({
  setActiveStep,
  activeStepData,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<ActiveStep>>;
  activeStepData?: IntegrationItemType;
}) {
  const { entryPoint, processedIntegrations } = useCarbon();
  const [activeScreen, setActiveScreen] = useState<"FILES" | "UPLOAD">("FILES");
  const [bannerState, setBannerState] = useState<BannerState>({
    message: null,
  });

  const localIntegration = processedIntegrations?.find(
    (int) => int.id == IntegrationName.LOCAL_FILES
  );

  if (!localIntegration) return null;

  return activeScreen == "UPLOAD" ? (
    <SystemFileUpload
      activeStepData={INTEGRATIONS_LIST.find(
        (item) => item.id === IntegrationName.LOCAL_FILES
      )}
      setActiveStep={setActiveStep}
      bannerState={bannerState}
      setBannerState={setBannerState}
      setScreen={setActiveScreen}
    />
  ) : (
    <>
      <DialogHeader closeButtonClass="cc-hidden sm:cc-flex">
        <div className="cc-flex-grow cc-flex cc-gap-3 cc-items-center">
          <button
            className="cc-pr-1 cc-h-10 cc-w-auto cc-shrink-0 "
            onClick={() => {
              if (!entryPoint) setActiveStep("INTEGRATION_LIST");
              else setActiveStep("CONNECT");
            }}
          >
            <img
              src={BackIcon}
              alt="Lock"
              className="cc-h-[18px] cc-w-[18px] dark:cc-invert-[1] dark:cc-hue-rotate-180"
            />
          </button>
          <div className=" dark:cc-bg-custom-gradient-dark cc-h-8 cc-w-8 sm:cc-h-14 sm:cc-w-14 cc-shrink-0 cc-bg-surface-white cc-rounded-lg cc-p-0.5 cc-shadow-e2">
            <div className="cc-h-full cc-w-full dark:cc-bg-[#0000007A] cc-bg-gray-50 cc-flex cc-items-center cc-justify-center cc-rounded-lg">
              <img
                src={activeStepData?.logo}
                alt={localIntegration.name}
                className="cc-h-4 cc-w-4 sm:cc-h-8 sm:cc-w-8"
              />
            </div>
          </div>
          <DialogTitle className="cc-flex-grow cc-text-left">
            {activeStepData?.name}
          </DialogTitle>
          <>
            <Button
              size="sm"
              variant="gray"
              className="cc-rounded-xl cc-shrink-0 sm:cc-hidden"
            >
              <img
                src={RefreshIcon}
                alt="User Plus"
                className="cc-h-[18px] cc-w-[18px] cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
              />
            </Button>
          </>
        </div>
      </DialogHeader>
      <Banner bannerState={bannerState} setBannerState={setBannerState} />
      <SyncedFilesList
        setActiveStep={setActiveStep}
        mode={SyncingModes.UPLOAD}
        handleUploadFilesClick={() => setActiveScreen("UPLOAD")}
        processedIntegration={localIntegration}
        selectedDataSource={null}
        bannerState={bannerState}
        setBannerState={setBannerState}
      />
    </>
  );
}

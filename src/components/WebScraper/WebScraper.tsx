import React, { act, useEffect, useState } from "react";
import { emptyFunction } from "@utils/helper-functions";
import {
  DialogHeader,
  DialogTitle,
} from "@components/common/design-system/Dialog";

import BackIcon from "@assets/svgIcons/back-icon.svg";
import WebsiteTabContent from "./WebsiteTabContent";
import SitemapTabContent from "./SitemapTabContent";
import {
  ActiveStep,
  IntegrationName,
  WebScraperIntegration,
} from "../../typing/shared";
import { useCarbon } from "../../context/CarbonContext";

import Banner, { BannerState } from "../common/Banner";
import SyncedFilesList from "../CarbonFilePicker/SyncedFilesList";
import { SyncingModes } from "../CarbonFilePicker/CarbonFilePicker";
import { IntegrationItemType } from "../../utils/integrationModalconstants";

export interface WebScraperProps {
  activeStep?: string;
  setActiveStep: React.Dispatch<React.SetStateAction<ActiveStep>>;
  onCloseModal: () => void;
  isWhiteLabeledEntryPoint: boolean;
}

export type FilterData = {
  [key: string]: number | string;
};

function WebScraper({
  activeStep = "",
  setActiveStep,
  onCloseModal,
  isWhiteLabeledEntryPoint,
}: WebScraperProps) {
  const { processedIntegrations, entryPoint, showFilesTab } = useCarbon();
  const [activeTab, setActiveTab] = useState<string>("website");
  const [service, setService] = useState<
    (WebScraperIntegration & IntegrationItemType) | undefined
  >(undefined);
  const [bannerState, setBannerState] = useState<BannerState>({
    message: null,
  });

  const shouldShowFilesTab = showFilesTab || service?.showFilesTab;
  const [activeScreen, setActiveScreen] = useState<"FILES" | "UPLOAD">(
    shouldShowFilesTab ? "FILES" : "UPLOAD"
  );

  useEffect(() => {
    setService(
      processedIntegrations?.find(
        (integration) => integration.id === "WEB_SCRAPER"
      )
    );
  }, [processedIntegrations]);

  const sitemapEnabled = service ? service?.sitemapEnabled ?? true : false;
  if (!service) return null;

  return (
    <>
      <DialogHeader
        className="cc-bg-white cc-border-b cc-border-outline-low_em"
        closeButtonClass="cc-hidden sm:cc-flex"
        onCloseModal={onCloseModal}
      >
        <div className="cc-flex-grow cc-flex cc-gap-3 cc-items-center">
          <button
            className="cc-pr-1 cc-h-10 cc-w-auto"
            onClick={() => {
              if (showFilesTab && activeScreen == "UPLOAD") {
                setActiveScreen("FILES");
              } else if (
                isWhiteLabeledEntryPoint &&
                entryPoint !== "INTEGRATION_LIST"
              ) {
                onCloseModal();
              } else if (!entryPoint || entryPoint == "INTEGRATION_LIST")
                setActiveStep("INTEGRATION_LIST");
              else {
                setActiveStep("CONNECT");
              }
            }}
          >
            <img
              src={BackIcon}
              alt="Lock"
              className="cc-h-[18px] cc-w-[18px] dark:cc-invert-[1] dark:cc-hue-rotate-180"
            />
          </button>
          <DialogTitle className="cc-flex-grow cc-text-left">
            Web Scraper
          </DialogTitle>
        </div>
      </DialogHeader>
      <Banner bannerState={bannerState} setBannerState={setBannerState} />
      {activeScreen == "UPLOAD" ? (
        <>
          {activeTab === "website" && (
            <WebsiteTabContent
              setActiveTab={setActiveTab}
              sitemapEnabled={sitemapEnabled}
              service={service}
              setBannerState={setBannerState}
            />
          )}
          {activeTab === "sitemap" && (
            <SitemapTabContent
              setActiveTab={setActiveTab}
              sitemapEnabled={sitemapEnabled}
              processedIntegration={processedIntegrations?.find(
                (p) => p.id == IntegrationName.WEB_SCRAPER
              )}
            />
          )}
        </>
      ) : (
        <SyncedFilesList
          setActiveStep={setActiveStep}
          mode={SyncingModes.UPLOAD}
          handleUploadFilesClick={() => setActiveScreen("UPLOAD")}
          processedIntegration={service}
          selectedDataSource={null}
          bannerState={bannerState}
          setBannerState={setBannerState}
        />
      )}
    </>
  );
}

export default WebScraper;

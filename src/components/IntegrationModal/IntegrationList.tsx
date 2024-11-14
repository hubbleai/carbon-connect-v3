import React, { useState } from "react";
import {
  emptyFunction,
  getIntegrationName,
  isEmpty,
} from "@utils/helper-functions";
import SearchIcon from "@assets/svgIcons/search-icon.svg";
import { INTEGRATIONS_LIST } from "@utils/integrationModalconstants";
import {
  DialogHeader,
  DialogTitle,
} from "@components/common/design-system/Dialog";
import BackIcon from "@assets/svgIcons/back-icon.svg";
import CrossIcon from "@assets/svgIcons/cross-icon.svg";
import { Input } from "@components/common/design-system/Input";
import { Button } from "@components/common/design-system/Button";
import { IntegrationAPIResponse } from ".";
import { cn } from "@components/common/design-system/utils";
import {
  ActiveStep,
  IntegrationName,
  ProcessedIntegration,
  LocalFilesIntegration,
  WebScraperIntegration,
} from "../../typing/shared";
import { useCarbon } from "../../context/CarbonContext";
import {
  DEFAULT_FILE_SIZE,
  MAX_PAGES_TO_SCRAPE,
  ONE_MB,
} from "../../constants/shared";
import { getFileSizeLimit } from "../../utils/files";

export interface IntegrationListProps {
  activeIntegrations: IntegrationAPIResponse[];
  setActiveStep?: (stepId: ActiveStep) => void;
  onCloseModal: () => void;
  handleBack: () => void;
}

function IntegrationList({
  activeIntegrations,
  setActiveStep = emptyFunction,
  onCloseModal,
  handleBack,
}: IntegrationListProps) {
  const [searchText, setSearchText] = useState<string>("");
  const {
    processedIntegrations,
    whiteLabelingData,
    maxFileSize = DEFAULT_FILE_SIZE,
    enabledIntegrations,
    accessToken,
  } = useCarbon();

  const listData = processedIntegrations
    ?.sort((a, b) => a.id.localeCompare(b.id))
    .filter((ai: ProcessedIntegration) =>
      ai.name?.toLowerCase()?.includes(searchText?.toLowerCase())
    );

  return (
    <>
      <DialogHeader
        className="cc-bg-white cc-border-b cc-border-outline-low_em"
        closeButtonClass="cc-hidden sm:cc-flex"
        onCloseModal={() => onCloseModal()}
      >
        <div className="cc-flex-grow cc-flex cc-gap-3 cc-items-center">
          <Button
            variant="neutral-white"
            className="cc-pr-1 cc-h-10 cc-w-auto cc-absolute sm:cc-relative cc-p-0 cc-border-none"
            onClick={() => handleBack()}
          >
            <img
              src={BackIcon}
              alt="Lock"
              className="cc-h-[18px] cc-w-[18px] dark:cc-invert-[1] dark:cc-hue-rotate-180"
            />
          </Button>
          <DialogTitle
            justifyModification={true}
            className="cc-flex-grow sm:cc-text-left"
          >
            Integrations
          </DialogTitle>
        </div>
      </DialogHeader>
      {!activeIntegrations.length && !accessToken ? (
        <div className="cc-h-screen cc-flex cc-items-center cc-justify-center">
          <p>Could not fetch integrations list.</p>
        </div>
      ) : (
        <div className="cc-p-4 cc-flex-grow cc-overflow-auto sm:cc-h-[640px] sm:cc-max-h-[90vh]">
          <div className="cc-relative cc-mb-6">
            <Input
              placeholder="Search Integrations"
              className="!cc-pl-10 dark:cc-bg-dark-input-bg dark:placeholder:cc-text-dark-input-text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <img
              src={SearchIcon}
              alt="search Icon"
              className="dark:cc-invert-[1] dark:cc-hue-rotate-180 cc-h-5 cc-w-5 cc-absolute cc-left-[14px] cc-transform -cc-translate-y-1/2 cc-top-1/2 cc-pointer-events-none "
            />
            {searchText !== "" && (
              <Button
                size="xs"
                onClick={() => setSearchText("")}
                variant="neutral-white"
                className="cc-absolute cc-border-none cc-right-2 cc-transform -cc-translate-y-1/2 cc-top-1/2 cc-px-[0_!important] cc-w-6 cc-bg-transparent"
              >
                <img
                  src={CrossIcon}
                  alt="Cross Icon"
                  className="cc-h-3 cc-w-3 dark:cc-invert-[1] dark:cc-hue-rotate-180"
                />
              </Button>
            )}
          </div>

          <ul className="cc-grid cc-grid-cols-2 cc-gap-3 sm:cc-grid-cols-3">
            {listData?.length
              ? listData.map((integration: ProcessedIntegration) => {
                  const isActive = activeIntegrations.find(
                    (int) =>
                      int.data_source_type == integration.data_source_type
                  );
                  return (
                    <li
                      key={integration.id}
                      className={`cc-border cc-rounded-xl cc-h-fit dark:cc-text-dark-text-white  dark:cc-bg-dark-bg-black dark:cc-border-[#FFFFFF1F] cc-relative  cc-items-center cc-p-2 sm:cc-p-3 cc-transition-all ${
                        !integration.active
                          ? "cc-bg-gray-200 cc-cursor-not-allowed"
                          : "cc-bg-white cc-cursor-pointer hover:cc-bg-surface-surface_1 dark:hover:cc-bg-dark-surface_1 dark:hover:cc-border-dark-outline-med_em hover:cc-border-outline-med_em"
                      }`}
                      onClick={() => {
                        setActiveStep(integration?.id);
                      }}
                    >
                      <div className="cc-grid cc-grid-cols-[40px,calc(100%_-_52px)] sm:cc-grid-cols-[56px,calc(100%_-_68px)] cc-gap-3 cc-items-center cc-justify-start">
                        <div className="cc-flex cc-aspect-square cc-items-center cc-justify-center cc-border-2  cc-rounded-md cc-shadow-e2 cc-border-white cc-shrink-0 dark:cc-bg-dark-text-white dark:cc-shadow-[0px_3px_4px_-2px_#0000007A]">
                          <div
                            className={cn(
                              `cc-flex  cc-items-center cc-justify-center cc-h-full cc-w-full cc-rounded-md cc-bg-gray-50`,
                              integration?.iconBgColor &&
                                "cc-bg-" + integration?.iconBgColor
                            )}
                          >
                            {integration.icon}
                          </div>
                        </div>
                        <div className="cc-flex-grow ">
                          <div className="cc-flex cc-items-center cc-break-words">
                            <div className="cc-text-base cc-font-semibold cc-items-center cc-inline-block  ">
                              {getIntegrationName(integration)}
                              {isActive ? (
                                <span
                                  className={
                                    "cc-h-2 cc-ml-[4px]  cc-top-[10px] cc-right-[10px] cc-inline-block cc-w-2 cc-border dark:cc-border-dark-bg-black cc-border-white cc-rounded-lg cc-bg-success-600"
                                  }
                                />
                              ) : null}
                            </div>
                          </div>

                          {integration.id == IntegrationName.LOCAL_FILES ? (
                            <p className="cc-font-semibold dark:cc-text-dark-text-gray cc-text-xs cc-text-low_em cc-mt-1 cc-truncate">
                              {`max ${
                                getFileSizeLimit(
                                  integration as LocalFilesIntegration,
                                  whiteLabelingData,
                                  maxFileSize
                                ) / ONE_MB
                              }MB per file`}
                            </p>
                          ) : null}
                          {integration.id == IntegrationName.WEB_SCRAPER ? (
                            <p className="cc-font-semibold dark:cc-text-dark-text-gray cc-text-xs cc-text-low_em cc-mt-1 cc-truncate">
                              {`max ${
                                (integration as WebScraperIntegration)
                                  .maxPagesToScrape || MAX_PAGES_TO_SCRAPE
                              } links to sync`}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
      )}
    </>
  );
}

export default IntegrationList;

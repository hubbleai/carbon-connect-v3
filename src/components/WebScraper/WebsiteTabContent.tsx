import React, { useState } from "react";

import { Button } from "@components/common/design-system/Button";
import { Input } from "@components/common/design-system/Input";
import { images } from "@assets/index";
import DownChevIcon from "@assets/svgIcons/down-chev-icon.svg";
import { cn } from "@components/common/design-system/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/common/design-system/Popover";
import WebScraperTabs from "./WebScraperTabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/common/design-system/Dropdown";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@components/common/design-system/Dialog";
import SuccessState from "@components/common/SuccessState";
import {
  BASE_URL,
  DEFAULT_CHUNK_SIZE,
  DEFAULT_OVERLAP_SIZE,
  DEFAULT_RECURSION_DEPTH,
  ENV,
  MAX_PAGES_TO_SCRAPE,
  MAX_RECURSION_DEPTH,
} from "../../constants/shared";
import { useCarbon } from "../../context/CarbonContext";
import { BannerState } from "../common/Banner";
import { isValidHttpUrl, removeHttp } from "../../utils/helper-functions";
import {
  IntegrationName,
  ActionType,
  WebScraperIntegration,
} from "../../typing/shared";

type WebscrapeInput = {
  url: string;
  recursionDepth: number | null;
  maxPageToScrape: number | null;
};

const initialData: WebscrapeInput = {
  url: "",
  recursionDepth: null,
  maxPageToScrape: null,
};

export default function WebsiteTabContent({
  setActiveTab,
  sitemapEnabled,
  service,
  setBannerState,
}: {
  setActiveTab: (val: string) => void;
  sitemapEnabled: boolean;
  service: WebScraperIntegration;
  setBannerState: React.Dispatch<React.SetStateAction<BannerState>>;
}) {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);
  const [websiteDataList, setWebsiteDataList] = useState<WebscrapeInput[]>([
    initialData,
  ]);
  const [submitting, setSubmitting] = useState(false);

  const {
    chunkSize,
    overlapSize,
    generateSparseVectors,
    prependFilenameToChunks,
    embeddingModel,
    maxItemsPerChunk,
    authenticatedFetch,
    environment = ENV.PRODUCTION,
    tags,
    accessToken,
    onSuccess,
    onError,
  } = useCarbon();

  const maxPagesToScrape = service.maxPagesToScrape ?? MAX_PAGES_TO_SCRAPE;
  const maxRecursionDepth = service.recursionDepth ?? MAX_RECURSION_DEPTH;

  const updateWebsiteListData = (
    index: number,
    newValues: { [key: string]: any }
  ) => {
    setWebsiteDataList((prev: WebscrapeInput[]) => {
      const newData = [...prev];
      newData[index] = { ...prev[index], ...newValues };
      return newData;
    });
  };

  const deleteWebsiteListData = (index: number) => {
    setWebsiteDataList((prev: WebscrapeInput[]) => {
      const newData = prev.filter((_, i) => i !== index);
      if (newData.length === 0) {
        return [initialData];
      }
      return newData;
    });
  };

  const submitScrape = async () => {
    try {
      if (submitting) {
        setBannerState({
          type: "ERROR",
          message: "Please wait for the request to finish",
        });

        return;
      }
      const chunkSizeValue =
        service?.chunkSize || chunkSize || DEFAULT_CHUNK_SIZE;
      const overlapSizeValue =
        service?.overlapSize || overlapSize || DEFAULT_OVERLAP_SIZE;
      const skipEmbeddingGeneration = service?.skipEmbeddingGeneration || false;
      const enableAutoSync = service?.enableAutoSync ?? false;
      const generateSparseVectorsValue =
        service?.generateSparseVectors ?? generateSparseVectors ?? false;
      const prependFilenameToChunksValue =
        service?.prependFilenameToChunks ?? prependFilenameToChunks ?? false;
      const maxItemsPerChunkValue =
        service?.maxItemsPerChunk || maxItemsPerChunk || null;
      const embeddingModelValue = embeddingModel || null;

      const htmlTagsToSkip = service?.htmlTagsToSkip || [];
      const cssClassesToSkip = service?.cssClassesToSkip || [];
      const cssSelectorsToSkip = service?.cssSelectorsToSkip || [];

      setSubmitting(true);

      let validData = websiteDataList.filter((urlData) =>
        isValidHttpUrl("https://" + urlData.url)
      );

      if (validData.length === 0) {
        setBannerState({
          type: "ERROR",
          message: "Please provide at least one valid URL.",
        });
        setSubmitting(false);
        return;
      }

      const requestObject = validData.map((urlData) => ({
        url: urlData.url,
        tags: tags,
        recursion_depth: urlData.recursionDepth ?? DEFAULT_RECURSION_DEPTH,
        max_pages_to_scrape: urlData.maxPageToScrape || MAX_PAGES_TO_SCRAPE,
        chunk_size: chunkSizeValue,
        chunk_overlap: overlapSizeValue,
        skip_embedding_generation: skipEmbeddingGeneration,
        enable_auto_sync: enableAutoSync,
        generate_sparse_vectors: generateSparseVectorsValue,
        prepend_filename_to_chunks: prependFilenameToChunksValue,
        html_tags_to_skip: htmlTagsToSkip,
        css_classes_to_skip: cssClassesToSkip,
        css_selectros_to_skip: cssSelectorsToSkip,
        ...(maxItemsPerChunkValue && {
          max_items_per_chunk: maxItemsPerChunkValue,
        }),
        ...(embeddingModelValue && {
          embedding_model: embeddingModelValue,
        }),
      }));

      const uploadResponse = await authenticatedFetch(
        `${BASE_URL[environment]}/web_scrape`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestObject),
        }
      );
      const responseData = await uploadResponse.json();
      if (uploadResponse.status === 200) {
        setShowSuccessState(true);
        setWebsiteDataList([]);
        onSuccess &&
          onSuccess({
            status: 200,
            data: {
              data_source_external_id: null,
              sync_status: null,
              files: responseData,
            },
            action: ActionType.UPDATE,
            event: ActionType.UPDATE,
            integration: IntegrationName.WEB_SCRAPER,
          });
      }
    } catch (error) {
      setBannerState({
        type: "ERROR",
        message: "Error initiating scraping. Please try again.",
      });

      onError &&
        onError({
          status: 400,
          data: [{ message: "Error initiating scraping. Please try again." }],
          action: ActionType.UPDATE,
          event: ActionType.UPDATE,
          integration: IntegrationName.WEB_SCRAPER,
        });
      setShowSuccessState(false);
    }
    setSubmitting(false);
  };

  if (showSuccessState) {
    return (
      <div className="cc-flex-grow cc-p-4 cc-overflow-auto cc-flex cc-flex-col">
        <WebScraperTabs
          activeTab="website"
          setActiveTab={setActiveTab}
          sitemapEnabled={sitemapEnabled}
        />
        <SuccessState
          heading="Scraping request initiated successfully."
          action={() => setShowSuccessState(false)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="cc-flex-grow cc-p-4 cc-overflow-auto">
        <WebScraperTabs
          activeTab="website"
          setActiveTab={setActiveTab}
          sitemapEnabled={sitemapEnabled}
        />
        <div className="cc-pb-4 cc-flex cc-grow cc-w-full">
          <div className="cc-flex cc-flex-col cc-justify-start cc-items-start cc-w-full cc-space-y-4">
            {websiteDataList.map((websiteData, index) => (
              <div
                key={index}
                className="cc-flex cc-space-x-2 cc-items-center cc-w-full cc-h-10"
              >
                <div className="cc-flex cc-flex-1 cc-relative">
                  <div>
                    <img
                      src={images.left_icon}
                      alt="tabler_sitemap"
                      className="cc-absolute cc-top-3 cc-left-2 cc-pointer-events-none dark:cc-invert-[1] dark:cc-hue-rotate-180"
                    />
                    <Input
                      type="text"
                      className="cc-w-[100px_!important] !cc-pl-8 !cc-rounded-r-none"
                      placeholder="Enter URL"
                      disabled={true}
                      value="https://"
                    />
                  </div>
                  <div className="cc-w-px cc-shrink-0 cc-bg-outline-med_em dark:cc-bg-dark-input-bg " />
                  <Input
                    type="text"
                    className="cc-rounded-l-none"
                    placeholder="Enter URL"
                    value={websiteData.url}
                    onChange={(e) =>
                      updateWebsiteListData(index, {
                        url: removeHttp(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="cc-flex sm:cc-hidden cc-relative">
                  <MobileWebsiteUrlDropdown
                    initialData={websiteData}
                    index={index}
                    updateWebsiteListData={updateWebsiteListData}
                    deleteUrl={
                      websiteDataList.length === 1 &&
                      websiteDataList[0].url === ""
                        ? undefined
                        : () => deleteWebsiteListData(index)
                    }
                    maxPagesToScrape={maxPagesToScrape}
                    maxRecursionDepth={maxRecursionDepth}
                  />
                </div>
                <div className="cc-hidden sm:cc-flex cc-items-center cc-gap-3">
                  <FilterPopover
                    initialData={websiteData}
                    index={index}
                    updateWebsiteListData={updateWebsiteListData}
                    maxPagesToScrape={maxPagesToScrape}
                    maxRecursionDepth={maxRecursionDepth}
                  />
                  <Button
                    size="md"
                    variant="neutral-white"
                    className="cc-px-[0_!important] cc-w-10 cc-border-transparent"
                  >
                    <img
                      src={images.trash_2}
                      alt=""
                      className="cc-cursor-pointer dark:cc-invert-[1] dark:cc-hue-rotate-180"
                      onClick={() => deleteWebsiteListData(index)}
                    />
                  </Button>
                </div>
              </div>
            ))}
            {websiteDataList.length < 50 && (
              <>
                <Button
                  size="md"
                  variant="neutral-white"
                  onClick={() => {
                    setWebsiteDataList((prev) => [...prev, initialData]);
                  }}
                  className="cc-w-full cc-flex sm:cc-hidden"
                >
                  <img
                    src={images.addIcon}
                    className="cc-w-[18px] cc-h-[18px] cc-shrink-0"
                  />
                  Add
                </Button>
                <Button
                  size="lg"
                  variant="neutral-white-fix"
                  onClick={() => {
                    setWebsiteDataList((prev) => [...prev, initialData]);
                  }}
                  className="cc-w-full cc-hidden sm:cc-flex"
                >
                  <img
                    src={images.addIcon}
                    className="cc-w-5 cc-h-5 cc-shrink-0"
                  />
                  Add
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <DialogFooter>
        <div className="cc-mb-4 cc-full cc-text-sm cc-flex cc-justify-center cc-text-low_em cc-font-semibold dark:cc-text-dark-text-gray">
          <img
            src={images.info_fill}
            alt="info_fill"
            className="cc-h-5 cc-w-5 cc-flex cc-mr-2"
          />
          First {maxPagesToScrape} links per website are synced by default.
        </div>
        <Button
          size="md"
          className="cc-w-full"
          onClick={() => {
            submitScrape();
          }}
          disabled={submitting}
        >
          Submit
        </Button>
      </DialogFooter>
    </>
  );
}

function FilterPopover({
  initialData,
  index,
  updateWebsiteListData,
  maxPagesToScrape,
  maxRecursionDepth,
}: {
  initialData: WebscrapeInput;
  index: number;
  updateWebsiteListData: (
    index: number,
    newValues: { [key: string]: any }
  ) => void;
  maxPagesToScrape: number;
  maxRecursionDepth: number;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="md"
          variant="neutral-white"
          className="cc-gap-2 cc-font-semibold cc-relative"
        >
          <img
            src={images.filter}
            alt=""
            className="cc-mr-2 dark:cc-invert-[1] dark:cc-hue-rotate-180"
          />
          Configure
          <img
            src={DownChevIcon}
            alt=""
            className="dark:cc-invert-[1] dark:cc-hue-rotate-180"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="cc-p-2 cc-hidden sm:!cc-block">
        <ConfigureForm
          initialData={initialData}
          index={index}
          updateWebsiteListData={updateWebsiteListData}
          close={() => setOpen(false)}
          maxPagesToScrape={maxPagesToScrape}
          maxRecursionDepth={maxRecursionDepth}
        />
      </PopoverContent>
    </Popover>
  );
}

function MobileWebsiteUrlDropdown({
  initialData,
  index,
  updateWebsiteListData,
  deleteUrl,
  maxPagesToScrape,
  maxRecursionDepth,
}: {
  initialData: WebscrapeInput;
  index: number;
  updateWebsiteListData: (
    index: number,
    newValues: { [key: string]: any }
  ) => void;
  deleteUrl?: () => void;
  maxPagesToScrape: number;
  maxRecursionDepth: number;
}) {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          activeState={"INTEGRATION_LIST"}
          className="cc-h-auto sm:cc-h-fit sm:cc-max-h-[90vh] cc-top-auto  cc-gap-0 sm:cc-rounded-[20px] cc-translate-y-0 -sm:cc-translate-y-1/2 cc-bottom-0 cc-rounded-t-2xl sm:cc-bottom-auto sm:top-1/2 cc-overflow-visible"
          style={{ height: "auto" }}
        >
          <DialogClose asChild>
            <Button
              size="md"
              variant="neutral-white"
              className="cc-absolute -cc-top-14 cc-left-1/2 cc-px-[0_!important] cc-w-10 -cc-translate-x-1/2"
              onClick={() => setShowDialog(false)}
            >
              <img
                src={images.crossIcon}
                alt="CrossIcon"
                className="cc-h-[18px] cc-w-[18px]"
              />
            </Button>
          </DialogClose>
          <div className="cc-p-4 flex flex-col gap-8">
            <div className="cc-text-xlxt cc-font-bold cc-mb-2">Configure</div>
            <ConfigureForm
              initialData={initialData}
              index={index}
              updateWebsiteListData={updateWebsiteListData}
              close={() => setShowDialog(false)}
              buttonVariant="primary"
              maxPagesToScrape={maxPagesToScrape}
              maxRecursionDepth={maxRecursionDepth}
            />
          </div>
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <img
            src={images.menuIcon}
            alt="Menu Icon"
            className="cc-h-[18px] cc-w-[18px] cc-shrink-0"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="cc-w-48 cc-bg-white cc-border cc-py-[4px] cc-border-outline-base_em cc-rounded-xl cc-shadow-e3 cc-z-30 cc-block sm:!cc-hidden"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cc-flex cc-justify-between cc-font-semibold !cc-py-[8px] !cc-px-[20px] cc-cursor-pointer "
              onClick={() => setShowDialog(true)}
            >
              <span>Configure</span>
              <img
                src={images.filter}
                alt=""
                className="cc-w-[18px] cc-h-[18px]"
              />
            </DropdownMenuItem>
            {deleteUrl && <DropdownMenuSeparator />}
            {deleteUrl && (
              <DropdownMenuItem
                className="cc-flex cc-justify-between cc-font-semibold !cc-py-[8px] !cc-px-[20px] cc-cursor-pointer"
                onClick={deleteUrl}
              >
                <span>Delete</span>
                <img
                  src={images.trash_2}
                  alt=""
                  className="cc-w-[18px] cc-h-[18px dark:cc-invert-[1] dark:cc-hue-rotate-180"
                />
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function ConfigureForm({
  initialData,
  index,
  updateWebsiteListData,
  close,
  buttonVariant = "neutral-white",
  maxPagesToScrape,
  maxRecursionDepth,
}: {
  initialData: WebscrapeInput;
  index: number;
  updateWebsiteListData: (
    index: number,
    newValues: { [key: string]: any }
  ) => void;
  close: () => void;
  buttonVariant?: "neutral-white" | "primary";
  maxPagesToScrape: number;
  maxRecursionDepth: number;
}) {
  const [urlData, setUrlData] = useState(initialData);
  return (
    <>
      <div className="cc-flex cc-justify-between cc-items-center cc-py-2 ">
        <div className="cc-flex">
          <label>
            <span
              className={cn(
                `dark:after:cc-bg-dark-bg-black cc-custom-radio cc-text-sm cc-font-semibold cc-text-high_em dark:cc-text-dark-text-white dark:before:cc-border-dark-text-gray before:cc-hidden `
              )}
            >
              Recursion depth
            </span>
          </label>
        </div>
        <div className="cc-w-[51px]">
          <Input
            type="text"
            placeholder=""
            className="cc-h-8 cc-text-xs !cc-pl-2"
            value={urlData.recursionDepth || 0}
            onChange={(e) => {
              if (parseInt(e.target.value) > maxRecursionDepth) return;
              setUrlData((prev) => ({
                ...prev,
                recursionDepth: parseInt(e.target.value) || 0,
                selectedFilter: "recursionDepth",
              }));
            }}
          />
        </div>
      </div>
      <div className="cc-flex cc-justify-between cc-items-center cc-py-2">
        <div className="cc-flex">
          <label>
            <span
              className={cn(
                `cc-custom-radio cc-text-sm cc-font-semibold cc-text-high_em dark:cc-text-dark-text-white dark:before:cc-border-dark-text-gray before:cc-hidden`
              )}
            >
              Max pages to scrape
            </span>
          </label>
        </div>
        <div className="cc-w-[51px]">
          <Input
            type="text"
            placeholder=""
            className="cc-h-8 cc-text-xs !cc-pl-2"
            value={urlData.maxPageToScrape || 0}
            onChange={(e) => {
              if (parseInt(e.target.value) > maxPagesToScrape) return;
              setUrlData((prev) => ({
                ...prev,
                maxPageToScrape: parseInt(e.target.value) || 0,
              }));
            }}
          />
        </div>
      </div>
      <Button
        size="md"
        variant="neutral-white-fix"
        className="cc-font-semibold cc-w-full cc-mt-3"
        onClick={() => {
          updateWebsiteListData(index, {
            recursionDepth: urlData.recursionDepth,
            maxPageToScrape: urlData.maxPageToScrape,
          });
          close();
        }}
      >
        Apply
      </Button>
    </>
  );
}

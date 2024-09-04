import React, { useState } from "react";

import { Button } from "@components/common/design-system/Button";
import { Input } from "@components/common/design-system/Input";
import { images } from "@assets/index";
import WebScraperTabs from "./WebScraperTabs";
import { DialogFooter } from "@components/common/design-system/Dialog";
import { Checkbox } from "@components/common/design-system/Checkbox";
import SuccessState from "@components/common/SuccessState";
import Banner, { BannerState } from "../common/Banner";
import { useCarbon } from "../../context/CarbonContext";
import {
  BASE_URL,
  DEFAULT_CHUNK_SIZE,
  DEFAULT_OVERLAP_SIZE,
  DEFAULT_RECURSION_DEPTH,
  ENV,
  MAX_PAGES_TO_SCRAPE,
} from "../../constants/shared";
import { isValidHttpUrl, removeHttp } from "../../utils/helper-functions";
import Loader from "../common/Loader";

import {
  IntegrationName,
  ActionType,
  WebScraperIntegration,
} from "../../typing/shared";

export default function SitemapTabContent({
  setActiveTab,
  sitemapEnabled,
  processedIntegration,
}: {
  setActiveTab: (val: string) => void;
  sitemapEnabled: boolean;
  processedIntegration: WebScraperIntegration | undefined;
}) {
  const [internalStep, setInternalStep] = useState<number>(1);
  const [url, setUrl] = useState<string>("");
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [sitemapUrls, setSitemapUrls] = useState([]);
  const [bannerState, setBannerState] = useState<BannerState>({
    message: null,
  });
  const [urlsLoading, setUrlsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const maxPagesToScrape =
    processedIntegration?.maxPagesToScrape || MAX_PAGES_TO_SCRAPE;

  const {
    authenticatedFetch,
    environment = ENV.PRODUCTION,
    accessToken,
    chunkSize,
    overlapSize,
    generateSparseVectors,
    prependFilenameToChunks,
    maxItemsPerChunk,
    embeddingModel,
    tags,
    onSuccess,
    onError,
  } = useCarbon();

  const handleFetchSitemapUrls = async () => {
    setSelectedUrls([]);
    setSitemapUrls([]);
    const finalUrl = "https://" + url;
    try {
      if (!isValidHttpUrl(finalUrl)) {
        setBannerState({ message: "Please enter a valid URL", type: "ERROR" });
        return;
      }
      setUrlsLoading(true);
      const response = await authenticatedFetch(
        `${BASE_URL[environment]}/process_sitemap?url=${finalUrl}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        setSitemapUrls(responseData.urls);
        setInternalStep(2);
      } else {
        throw new Error("Error fetching sitemap. Please try again.");
      }
    } catch (error) {
      setBannerState({
        type: "ERROR",
        message: "Error fetching sitemap. Please try again.",
      });
    }
    setUrlsLoading(false);
  };

  const submitScrapeRequest = async () => {
    const finalUrl = "https://" + url;
    try {
      if (isSubmitting === true) {
        return;
      }
      setIsSubmitting(true);
      const chunkSizeValue =
        processedIntegration?.chunkSize || chunkSize || DEFAULT_CHUNK_SIZE;
      const overlapSizeValue =
        processedIntegration?.overlapSize ||
        overlapSize ||
        DEFAULT_OVERLAP_SIZE;
      const skipEmbeddingGeneration =
        processedIntegration?.skipEmbeddingGeneration || false;
      const enableAutoSync = processedIntegration?.enableAutoSync ?? false;
      const generateSparseVectorsValue =
        processedIntegration?.generateSparseVectors ??
        generateSparseVectors ??
        false;
      const prependFilenameToChunksValue =
        processedIntegration?.prependFilenameToChunks ??
        prependFilenameToChunks ??
        false;
      const maxItemsPerChunkValue =
        processedIntegration?.maxItemsPerChunk || maxItemsPerChunk || null;
      const embeddingModelValue = embeddingModel || null;
      const recursionDepth =
        processedIntegration?.recursionDepth ?? DEFAULT_RECURSION_DEPTH;

      const htmlTagsToSkip = processedIntegration?.htmlTagsToSkip || [];
      const cssClassesToSkip = processedIntegration?.cssClassesToSkip || [];
      const cssSelectorsToSkip = processedIntegration?.cssSelectorsToSkip || [];
      const downloadCssAndMedia =
        processedIntegration?.downloadCssAndMedia || false;
      const generateChunksOnly =
        processedIntegration?.generateChunksOnly || false;

      const urlsToScrape =
        selectedUrls.length == sitemapUrls.length ? [] : selectedUrls;

      const requestObject = {
        url: finalUrl,
        tags: tags,
        recursion_depth: recursionDepth,
        max_pages_to_scrape: maxPagesToScrape,
        chunk_size: chunkSizeValue,
        chunk_overlap: overlapSizeValue,
        skip_embedding_generation: skipEmbeddingGeneration,
        enable_auto_sync: enableAutoSync,
        generate_sparse_vectors: generateSparseVectorsValue,
        prepend_filename_to_chunks: prependFilenameToChunksValue,
        html_tags_to_skip: htmlTagsToSkip,
        css_classes_to_skip: cssClassesToSkip,
        css_selectors_to_skip: cssSelectorsToSkip,
        ...(maxItemsPerChunkValue && {
          max_items_per_chunk: maxItemsPerChunkValue,
        }),
        ...(embeddingModelValue && { embedding_model: embeddingModelValue }),
        urls_to_scrape: urlsToScrape,
        download_css_and_media: downloadCssAndMedia,
        generate_chunks_only: generateChunksOnly,
      };

      const uploadResponse = await authenticatedFetch(
        `${BASE_URL[environment]}/scrape_sitemap`,
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
        setSelectedUrls([]);
        setSitemapUrls([]);
        setUrl("");
        onSuccess &&
          onSuccess({
            status: 200,
            data: {
              data_source_external_id: null,
              sync_status: null,
              files: [responseData],
            },
            action: ActionType.UPDATE,
            event: ActionType.UPDATE,
            integration: IntegrationName.WEB_SCRAPER,
          });
        setInternalStep(3);
      }
    } catch (e) {
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
    }
    setIsSubmitting(false);
  };

  if (internalStep === 3) {
    return (
      <div className="cc-flex-grow cc-p-4 cc-overflow-auto cc-flex cc-flex-col">
        <WebScraperTabs
          activeTab="sitemap"
          setActiveTab={setActiveTab}
          sitemapEnabled={sitemapEnabled}
        />
        <SuccessState
          heading="Scraping request initiated successfully."
          action={() => setInternalStep(1)}
        />
      </div>
    );
  }

  return (
    <>
      <Banner bannerState={bannerState} setBannerState={setBannerState} />
      <div className="cc-flex-grow cc-p-4 cc-overflow-auto cc-flex cc-flex-col">
        <WebScraperTabs
          activeTab="sitemap"
          setActiveTab={setActiveTab}
          sitemapEnabled={sitemapEnabled}
        />
        <div
          key={0}
          className="cc-flex cc-space-x-2 cc-items-center cc-w-full cc-h-10 cc-mb-3"
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
                className="cc-w-[100px_!important] !cc-pl-8 cc-rounded-r-none "
                placeholder="Enter URL"
                disabled={true}
                value="https://"
              />
            </div>
            <div className="cc-w-px cc-shrink-0 cc-bg-outline-med_em dark:cc-bg-dark-input-bg" />
            <Input
              type="text"
              className="cc-rounded-l-none"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(removeHttp(e.target.value))}
            />
          </div>
          <Button
            size="md"
            variant="neutral-white"
            className="cc-font-semibold cc-hidden sm:cc-flex dark:!cc-bg-[#fff] dark:!cc-text-[#000]"
            disabled={url === "" || urlsLoading}
            onClick={() => handleFetchSitemapUrls()}
          >
            Fetch
          </Button>
        </div>
        {internalStep === 2 && (
          <div className="sm:cc-h-[369px] cc-border-t cc-flex-grow cc-border-outline-low_em cc-overflow-y-auto cc-overflow-x-hidden  cc-mx-0 cc-border cc-rounded-xl dark:cc-border-[#FFFFFF1F]">
            <div className="cc-flex cc-justify-between cc-items-center cc-bg-surface-surface_1 sm:cc-flex dark:cc-bg-dark-border-color">
              <div className="cc-px-4 cc-py-2 cc-text-sm cc-text-disabledtext cc-capitalize cc-font-bold dark:cc-text-dark-input-text">
                Fetched URLs
              </div>
              <div className="cc-py-2 cc-text-xs cc-text-disabledtext dark:cc-text-dark-text-white cc-capitalize cc-font-bold cc-text-right cc-mr-4">
                {selectedUrls.length &&
                selectedUrls.length === sitemapUrls.length ? (
                  <button
                    onClick={() => setSelectedUrls([])}
                    className="cc-text-sm cc-font-semibold cc-h-6 cc-text-outline-danger_high_em cc-items-start cc-text-left"
                  >
                    Clear selection
                  </button>
                ) : (
                  <label className="cc-flex cc-gap-2 cc-items-center cc-h-6 cc-text-sm cc-text-[#100C20] cc-font-semibold cc-cursor-pointer dark:!cc-text-[#fff] ">
                    <Checkbox
                      className="cc-my-0.5"
                      checked={
                        selectedUrls.length
                          ? selectedUrls.length === sitemapUrls.length
                          : false
                      }
                      onCheckedChange={() => {
                        setSelectedUrls(sitemapUrls);
                      }}
                    />
                    Select all
                  </label>
                )}
              </div>
            </div>
            {urlsLoading ? (
              <Loader />
            ) : sitemapUrls.length > 0 ? (
              <ul className="cc-px-4 sm:cc-px-0 sm:cc-pb-2">
                {sitemapUrls.map((item, index) => {
                  const isChecked = selectedUrls.indexOf(item) >= 0;

                  return (
                    <SitemapItem
                      key={index}
                      isChecked={isChecked}
                      item={item}
                      onSelect={() => {
                        setSelectedUrls((prev) => {
                          if (isChecked) {
                            return prev.filter((url) => url !== item);
                          } else {
                            return [...prev, item];
                          }
                        });
                      }}
                    />
                  );
                })}
              </ul>
            ) : (
              <div className="cc-py-4 cc-text-center cc-text-disabledtext cc-font-medium cc-text-sm">
                No URLs found
              </div>
            )}
          </div>
        )}
      </div>

      {internalStep === 1 && (
        <DialogFooter className="sm:cc-hidden">
          <Button
            variant="primary"
            size="lg"
            className="cc-w-full"
            disabled={url === ""}
            onClick={() => {
              handleFetchSitemapUrls();
            }}
          >
            Fetch
          </Button>
        </DialogFooter>
      )}
      {internalStep === 2 && selectedUrls.length > 0 && (
        <DialogFooter>
          <div className="cc-mb-4 cc-full cc-text-sm cc-flex cc-justify-center cc-text-low_em cc-font-semibold dark:cc-text-dark-text-white">
            <img
              src={images.info_fill}
              alt="info_fill"
              className="cc-h-5 cc-w-5 cc-flex cc-mr-2 dark:cc-invert-[1] dark:cc-hue-rotate-180"
            />
            {selectedUrls.length == sitemapUrls.length
              ? "All URLs selected."
              : `${selectedUrls.length} URL(s) selected.`}
            {selectedUrls.length > maxPagesToScrape &&
              ` First ${maxPagesToScrape} URLs will be synced.`}
          </div>
          <Button
            size="md"
            className="cc-w-full"
            onClick={() => {
              submitScrapeRequest();
            }}
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </DialogFooter>
      )}
    </>
  );
}

type SitemapItemProps = {
  isChecked: boolean;
  onSelect: () => void;
  item: string;
};

function SitemapItem({ item, isChecked, onSelect }: SitemapItemProps) {
  return (
    <li
      key={item}
      className="cc-flex cc-transition-all sm:cc-px-4 cc-font-semibold cc-text-high_em cc-text-sm dark:cc-text-dark-text-white dark:hover:cc-bg-[#464646] hover:cc-bg-gray-25 cc-cursor-pointer"
    >
      <div className="cc-py-3 cc-border-b cc-border-outline-base_em cc-w-full">
        <div className="cc-gap-2 cc-flex cc-items-start cc-w-full sm:cc-px-2">
          <Checkbox
            className="cc-my-0.5"
            checked={isChecked}
            onCheckedChange={onSelect}
          />
          <div className="cc-flex cc-flex-grow cc-gap-x-4 cc-gap-y-1 cc-flex-wrap">
            <p className="cc-flex cc-flex-grow cc-flex-start">{item}</p>
          </div>
        </div>
      </div>
    </li>
  );
}

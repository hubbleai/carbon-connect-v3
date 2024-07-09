import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import RefreshIcon from "@assets/svgIcons/refresh-icon.svg";
import { Input } from "@components/common/design-system/Input";
import { Button } from "@components/common/design-system/Button";
import { DialogFooter } from "@components/common/design-system/Dialog";
import FolderIcon from "@assets/svgIcons/folder.svg";
import SearchIcon from "@assets/svgIcons/search-icon.svg";
import NoResultsIcon from "@assets/svgIcons/no-result.svg";
import { Checkbox } from "@components/common/design-system/Checkbox";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/common/design-system/Breadcrumb";
import { ProcessedIntegration, UserSourceItemApi } from "../../typing/shared";
import SourceItem from "./SourceItem";
import { BASE_URL, ENV } from "../../constants/shared";
import { useCarbon } from "../../context/CarbonContext";
import { IntegrationAPIResponse } from "../IntegrationModal";
import {
  generateRequestId,
  getConnectRequestProps,
} from "../../utils/helper-functions";
import Banner, { BannerState } from "../common/Banner";
import Loader from "../common/Loader";

const PER_PAGE = 20;
type BreadcrumbType = {
  parentId: string | null;
  name: string;
  accountId: number | undefined;
  refreshes: number;
  lastSync?: Date;
};

export default function SourceItemsList({
  setIsUploading,
  setShowFilePicker,
  selectedDataSource,
  processedIntegration,
}: {
  setIsUploading: (val: { state: boolean; percentage: number }) => void;
  setShowFilePicker: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDataSource: IntegrationAPIResponse | null;
  processedIntegration: ProcessedIntegration | null;
}) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [serchValue, setSearchValue] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const [currItems, setCurrItems] = useState<UserSourceItemApi[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [parentId, setParentId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbType[]>([
    {
      parentId: null,
      name: "All Files",
      accountId: selectedDataSource?.id,
      refreshes: 0,
    },
  ]);
  const [sourceItemRefreshes, setSourceItemRefreshes] = useState(0);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [bannerState, setBannerState] = useState<BannerState>({
    message: null,
  });

  const filteredList = currItems.filter((item: any) =>
    item.name.toLowerCase().includes(serchValue.toLowerCase())
  );

  const carbonProps = useCarbon();
  const {
    authenticatedFetch,
    environment = ENV.PRODUCTION,
    accessToken,
    useRequestIds,
    setRequestIds,
    requestIds,
  } = carbonProps;

  const loadMoreRows = async () => {
    if (!hasMoreItems) return;
    fetchSourceItems(parentId, offset);
  };

  const fetchSourceItems = async (
    parentId: string | null = null,
    localOffset: number = 0
  ) => {
    if (!selectedDataSource) return;
    const requestBody: any = {
      data_source_id: selectedDataSource.id,
      pagination: {
        offset: localOffset,
        limit: PER_PAGE,
      },
    };

    if (parentId) {
      requestBody.parent_id = parentId.toString();
    }

    const sourceItemsResponse = await authenticatedFetch(
      `${BASE_URL[environment]}/integrations/items/list`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (sourceItemsResponse.status === 200) {
      const data = await sourceItemsResponse.json();
      const count = data?.count;
      const sourceItems = data?.items;
      setOffset(localOffset + sourceItems.length);
      setCurrItems((prev) => [...prev, ...sourceItems]);
      setHasMoreItems(count > localOffset + sourceItems.length);
    }
  };

  useEffect(() => {
    if (breadcrumbs.length) {
      setOffset(0);
      const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
      setCurrItems([]);
      setHasMoreItems(true);
      setItemsLoading(true);
      lastBreadcrumb.lastSync &&
        fetchSourceItems(lastBreadcrumb.parentId, 0).then(() =>
          setItemsLoading(false)
        );
    }
  }, [JSON.stringify(breadcrumbs)]);

  useEffect(() => {
    if (!selectedDataSource || selectedDataSource?.sync_status !== "READY")
      return;
    setOffset(0);
    setParentId(null);
    setBreadcrumbs([
      {
        parentId: null,
        name: "All Files",
        accountId: selectedDataSource?.id,
        refreshes: sourceItemRefreshes,
        lastSync: selectedDataSource?.source_items_synced_at,
      },
    ]);
  }, [
    selectedDataSource?.id,
    sourceItemRefreshes,
    selectedDataSource?.source_items_synced_at,
  ]);

  const onItemClick = (item: UserSourceItemApi) => {
    if (itemsLoading) return;
    if (item.is_expandable) {
      setParentId(item.external_id);
      setBreadcrumbs((prev) => [
        ...prev,
        {
          parentId: item.external_id,
          name: item.name,
          accountId: selectedDataSource?.id,
          refreshes: sourceItemRefreshes,
          lastSync: selectedDataSource?.source_items_synced_at,
        },
      ]);
    }
  };

  const onBreadcrumbClick = (index: number) => {
    // Navigate to the clicked directory in the breadcrumb
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    const lastBreadcrumb = newBreadcrumbs[newBreadcrumbs.length - 1];
    setParentId(lastBreadcrumb.parentId);
    setBreadcrumbs(newBreadcrumbs);
  };

  const syncSelectedFiles = async () => {
    if (!processedIntegration || !selectedDataSource) return;
    let requestId = null;
    if (useRequestIds) {
      requestId = generateRequestId(20);
      setRequestIds({
        ...requestIds,
        [processedIntegration?.data_source_type]: requestId,
      });
    }

    const requestObject = getConnectRequestProps(
      processedIntegration,
      requestId,
      { data_source_id: selectedDataSource.id, ids: selectedItems },
      carbonProps
    );

    const syncFilesResponse = await authenticatedFetch(
      `${BASE_URL[environment]}/integrations/files/sync`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestObject),
      }
    );

    if (syncFilesResponse.status === 200) {
      setBannerState({
        type: "SUCCESS",
        message: "Files successfully queued for sync!",
      });
    } else {
      setBannerState({
        type: "ERROR",
        message: "Files sync failed!",
      });
    }
    setSelectedItems([]);
  };

  return (
    <>
      <Banner bannerState={bannerState} setBannerState={setBannerState} />
      <div className="cc-p-4 cc-min-h-0 cc-flex-grow cc-flex cc-flex-col">
        <div className="cc-flex cc-gap-2 sm:cc-gap-3 cc-mb-3 cc-flex-col sm:cc-flex-row">
          <p className="cc-text-xl cc-font-semibold cc-flex-grow dark:cc-text-dark-text-white">
            Select files to sync
          </p>
          <div className="cc-flex cc-gap-2 sm:cc-gap-3">
            <label className="cc-relative cc-flex-grow sm:cc-max-w-[220px]">
              <img
                src={SearchIcon}
                alt="Search Icon"
                className="dark:cc-invert-[1] dark:cc-hue-rotate-180 cc-h-4 cc-w-4 cc-absolute cc-top-1/2 cc-transform -cc-translate-y-1/2 cc-left-2 cc-pointer-events-none"
              />
              <Input
                type="text"
                placeholder="Search"
                className="cc-h-8 cc-text-xs cc-pl-7"
                value={serchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </label>
            <Button
              size="sm"
              variant="neutral-white"
              className="cc-text-xs cc-rounded-xl cc-font-semibold dark:cc-text-dark-text-white"
              onClick={() => setShowFilePicker((prev) => !prev)}
            >
              View synced files
            </Button>
            <Button
              size="sm"
              variant="gray"
              className="cc-rounded-xl cc-shrink-0 cc-hidden sm:cc-flex"
              onClick={() => setSourceItemRefreshes((prev) => prev + 1)}
            >
              <img
                src={RefreshIcon}
                alt="User Plus"
                className="cc-h-[18px] cc-w-[18px] cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
              />
            </Button>
          </div>
        </div>
        <div className="cc-flex cc-flex-col sm:cc-flex-row cc-text-sm cc-font-semibold cc-mb-3  sm:cc-gap-3">
          <div className="cc-overflow-auto cc-pb-4 sm:cc-pb-0 cc-px-4 -cc-mx-4 cc-flex-grow ">
            <Breadcrumb className="cc-text-nowrap cc-whitespace-nowrap cc-flex-nowrap">
              <BreadcrumbList className="cc-flex-nowrap">
                {breadcrumbs.map((crumb, index) => (
                  <>
                    <BreadcrumbItem
                      className="cc-shrink-0"
                      key={index}
                      onClick={() => onBreadcrumbClick(index)}
                    >
                      <BreadcrumbPage className="hover:cc-opacity-70 cc-cursor-pointer cc-transition-all cc-gap-1.5 cc-flex cc-shrink-0 cc-items-center dark:cc-text-dark-text-white">
                        <img
                          src={FolderIcon}
                          alt="Folder Icon"
                          className="cc-w-5 cc-shrink-0"
                        />
                        {crumb.name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                    {breadcrumbs.length > index + 1 ? (
                      <BreadcrumbSeparator className="cc-shrink-0" />
                    ) : null}
                  </>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {selectedItems.length > 0 ? (
            <button
              onClick={() => setSelectedItems([])}
              className="cc-text-sm cc-font-semibold cc-text-outline-danger_high_em cc-items-start cc-text-left"
            >
              Clear selection
            </button>
          ) : (
            <label className="cc-flex cc-gap-2 cc-text-sm cc-font-semibold cc-cursor-pointer dark:cc-text-dark-text-white">
              <Checkbox
                className="my-0.5"
                checked={
                  currItems.length
                    ? selectedItems.length === currItems.length
                    : false
                }
                onCheckedChange={() => {
                  const allFilesId = currItems
                    .filter((item) => item.is_selectable)
                    .map((item: any) => item.external_id);
                  setSelectedItems(allFilesId);
                }}
              />
              Select all
            </label>
          )}
        </div>
        <div
          id="scrollableTarget"
          className="cc-border-t cc-flex cc-flex-col dark:cc-border-[#FFFFFF1F] cc-border-outline-low_em cc-overflow-y-auto cc-overflow-x-hidden -cc-mx-4 cc-px-4 sm:cc-mx-0 sm:cc-px-0 cc-flex-grow sm:cc-border sm:cc-rounded-xl"
        >
          <div className="cc-bg-surface-surface_1 cc-hidden sm:cc-flex dark:cc-bg-dark-border-color">
            <div className="cc-px-4 cc-py-2 cc-text-xs dark:cc-text-dark-input-text cc-text-disabledtext cc-capitalize cc-font-bold cc-flex-grow">
              FILE NAME
            </div>
            <div className="cc-py-2 cc-text-xs dark:cc-text-dark-input-text cc-text-disabledtext cc-capitalize cc-font-bold cc-shrink-0 cc-text-right sm:cc-w-[228px]">
              <p className="cc-px-4">CREATED AT</p>
            </div>
          </div>
          {selectedDataSource?.sync_status == "SYNCING" ||
          selectedDataSource?.sync_status == "QUEUED_FOR_SYNC" ? (
            <div className="cc-py-4 cc-px-4 cc-text-center cc-flex-grow cc-text-disabledtext cc-font-medium cc-text-sm cc-flex cc-flex-col cc-items-center cc-justify-center h-full">
              <p className="cc-text-low_em cc-font-medium cc-max-w-[282px]">
                Your content is being synced.
              </p>
            </div>
          ) : itemsLoading ? (
            <Loader />
          ) : !filteredList.length ? (
            <div className="cc-py-4 cc-px-4 cc-text-center cc-flex-grow cc-text-disabledtext cc-font-medium cc-text-sm cc-flex cc-flex-col cc-items-center cc-justify-center h-full">
              <div className="cc-p-2 cc-bg-surface-surface_2 cc-rounded-lg cc-mb-3">
                <img
                  src={NoResultsIcon}
                  alt="No results Icon"
                  className="cc-w-6 cc-shrink-0"
                />
              </div>
              <p className="cc-text-base cc-font-medium cc-mb-1 cc-max-w-[282px]">
                No matching results
              </p>
              <p className="cc-text-low_em cc-font-medium cc-max-w-[282px]">
                Try another search, or use search options to find a file by
                type, format or more.
              </p>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={currItems.length}
              next={loadMoreRows}
              hasMore={hasMoreItems}
              loader={<Loader />}
              scrollableTarget="scrollableTarget"
            >
              <ul className="cc-pb-2">
                {filteredList.map((item) => {
                  const isChecked =
                    selectedItems.indexOf(item.external_id) >= 0;

                  return (
                    <SourceItem
                      key={item.id}
                      isChecked={isChecked}
                      item={item}
                      onSelect={() => {
                        setSelectedItems((prev) => {
                          if (isChecked) {
                            return prev.filter((id) => id !== item.external_id);
                          } else {
                            return [...prev, item.external_id];
                          }
                        });
                      }}
                      onItemClick={onItemClick}
                    />
                  );
                })}
              </ul>
            </InfiniteScroll>
          )}
        </div>
      </div>
      {selectedItems.length > 0 && (
        <DialogFooter>
          <Button
            variant="primary"
            size="lg"
            className="cc-w-full"
            onClick={() => {
              // setIsUploading({ state: true, percentage: 24 });
              syncSelectedFiles();
            }}
          >
            Upload {selectedItems.length} file(s)
          </Button>
        </DialogFooter>
      )}
    </>
  );
}

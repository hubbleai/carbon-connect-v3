import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import RefreshIcon from "@assets/svgIcons/refresh-icon.svg";
import { Input } from "@components/common/design-system/Input";
import { Button } from "@components/common/design-system/Button";
import { DialogFooter } from "@components/common/design-system/Dialog";
import FolderIcon from "@assets/svgIcons/folder.svg";
import SearchIcon from "@assets/svgIcons/search-icon.svg";
import NoResultsIcon from "@assets/svgIcons/no-result.svg";
import AddCircleIconBlack from "@assets/svgIcons/add-circle-icon-black.svg";
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

const PER_PAGE = 20;
type BreadcrumbType = {
  parentId: string | null;
  name: string;
  accountId: number | undefined;
  refreshes: number;
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
    setItemsLoading(true);
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
    setItemsLoading(false);
  };

  useEffect(() => {
    setOffset(0);
    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    setCurrItems([]);
    fetchSourceItems(lastBreadcrumb.parentId, 0);
  }, [JSON.stringify(breadcrumbs)]);

  useEffect(() => {
    setOffset(0);
    setParentId(null);
    setBreadcrumbs([
      {
        parentId: null,
        name: "All Files",
        accountId: selectedDataSource?.id,
        refreshes: sourceItemRefreshes,
      },
    ]);
  }, [selectedDataSource?.id, sourceItemRefreshes]);

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
      // toast.success('Files successfully queued for sync!');
    } else {
      // toast.error('Files sync failed!');
    }
    setSelectedItems([]);
  };

  return (
    <>
      <div className="cc-p-4 cc-min-h-0 cc-flex-grow cc-flex cc-flex-col">
        <div className="cc-flex cc-gap-2 sm:cc-gap-3 cc-mb-3 cc-flex-col sm:cc-flex-row">
          <p className="cc-text-xl cc-font-semibold cc-flex-grow">
            Select files to sync
          </p>
          <div className="cc-flex cc-gap-2 sm:cc-gap-3">
            <label className="cc-relative cc-flex-grow sm:cc-max-w-[220px]">
              <img
                src={SearchIcon}
                alt="Search Icon"
                className="cc-h-4 cc-w-4 cc-absolute cc-top-1/2 cc-transform -cc-translate-y-1/2 cc-left-2 cc-pointer-events-none"
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
              className="cc-text-xs cc-rounded-xl cc-font-semibold"
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
                className="cc-h-[18px] cc-w-[18px] cc-shrink-0"
              />
            </Button>
          </div>
        </div>
        <div className="cc-flex cc-flex-col sm:cc-flex-row cc-text-sm cc-font-semibold cc-mb-3 cc-gap-5 sm:cc-gap-3">
          <div className="cc-overflow-auto cc-pb-4 sm:cc-pb-0 cc-px-4 -cc-mx-4 cc-flex-grow">
            <Breadcrumb className="cc-text-nowrap cc-whitespace-nowrap cc-flex-nowrap">
              <BreadcrumbList className="cc-flex-nowrap">
                {breadcrumbs.map((crumb, index) => (
                  <>
                    <BreadcrumbItem
                      className="cc-shrink-0"
                      key={crumb.parentId}
                      onClick={() => onBreadcrumbClick(index)}
                    >
                      <BreadcrumbPage className="hover:cc-opacity-70 cc-cursor-pointer cc-transition-all cc-gap-1.5 cc-flex cc-shrink-0 cc-items-center">
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
            <label className="cc-flex cc-gap-2 cc-text-sm cc-font-semibold cc-cursor-pointer">
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
          className="cc-border-t cc-flex cc-flex-col cc-border-outline-low_em cc-overflow-y-auto cc-overflow-x-hidden -cc-mx-4 cc-px-4 sm:cc-mx-0 sm:cc-px-0 cc-flex-grow sm:cc-border sm:cc-rounded-xl"
        >
          <div className="cc-bg-surface-surface_1 cc-hidden sm:cc-flex">
            <div className="cc-px-4 cc-py-2 cc-text-xs cc-text-disabledtext cc-capitalize cc-font-bold cc-flex-grow">
              FILE NAME
            </div>
            <div className="cc-py-2 cc-text-xs cc-text-disabledtext cc-capitalize cc-font-bold cc-shrink-0 cc-text-right sm:cc-w-[228px]">
              <p className="cc-px-4">CREATED AT</p>
            </div>
          </div>
          {filteredList.length > 0 ? (
            <InfiniteScroll
              dataLength={currItems.length}
              next={loadMoreRows}
              hasMore={hasMoreItems}
              loader={<p>Loading...</p>}
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
          ) : (
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
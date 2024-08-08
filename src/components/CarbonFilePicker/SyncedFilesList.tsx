import React, { ReactText, useEffect, useRef, useState } from "react";
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

import { useCarbon } from "../../context/CarbonContext";
import {
  BASE_URL,
  DEFAULT_FILES_TAB_COLUMNS,
  ENV,
  FOLDER_BASED_CONNECTORS,
  LOCAL_FILE_TYPES,
} from "../../constants/shared";
import { IntegrationAPIResponse } from "../IntegrationModal";
import {
  ActiveStep,
  ProcessedIntegration,
  UserFileApi,
  IntegrationName,
} from "../../typing/shared";
import FileItem from "./FileItem";
import { SyncingModes } from "./CarbonFilePicker";
import Loader from "../common/Loader";
import {
  getFileItemType,
  pluralize,
  truncateString,
} from "../../utils/helper-functions";
import { BannerState } from "../common/Banner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../common/design-system/Breadcrumb";

const PER_PAGE = 20;

type BreadcrumbType = {
  parentId: number | null;
  name: string;
  accountId: number | undefined;
  refreshes: number;
  root_files_only: boolean;
};

export default function SyncedFilesList({
  selectedDataSource,
  handleUploadFilesClick,
  mode,
  processedIntegration,
  setActiveStep,
  bannerState,
  setBannerState,
}: {
  selectedDataSource: IntegrationAPIResponse | null;
  handleUploadFilesClick: () => void;
  mode: SyncingModes | null;
  processedIntegration: ProcessedIntegration;
  setActiveStep: React.Dispatch<React.SetStateAction<ActiveStep>>;
  bannerState: BannerState;
  setBannerState: React.Dispatch<React.SetStateAction<BannerState>>;
}) {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const {
    authenticatedFetch,
    environment = ENV.PRODUCTION,
    accessToken,
    sendDeletionWebhooks,
    filesTabColumns,
  } = useCarbon();

  const [files, setFiles] = useState<UserFileApi[]>([]);
  const [hasMoreFiles, setHasMoreFiles] = useState(true);
  const [offset, setOffset] = useState(0);
  const [syncedFilesRefreshes, setSyncedFilesRefreshes] = useState(0);
  const [filesLoading, setFilesLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const isLocalFiles = processedIntegration.id == IntegrationName.LOCAL_FILES;
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbType[]>([
    {
      parentId: null,
      name: "All Files",
      accountId: undefined,
      refreshes: 0,
      root_files_only: true,
    },
  ]);

  const filteredList = files.filter((item) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columnsToDisplay =
    processedIntegration?.filesTabColumns ||
    filesTabColumns ||
    DEFAULT_FILES_TAB_COLUMNS;

  useEffect(() => {
    if (!selectedDataSource && !isLocalFiles) return;
    setSearchValue("");
    setBreadcrumbs([
      {
        parentId: null,
        name: "All Files",
        accountId: selectedDataSource?.id,
        refreshes: syncedFilesRefreshes,
        root_files_only: true,
      },
    ]);
  }, [selectedDataSource?.id, syncedFilesRefreshes]);

  useEffect(() => {
    if (breadcrumbs.length) {
      setOffset(0);
      setFiles([]);
      setHasMoreFiles(true);
      const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
      if (lastBreadcrumb.accountId || isLocalFiles) {
        setFilesLoading(true);
        loadInitialData(selectedDataSource, lastBreadcrumb).then(() =>
          setFilesLoading(false)
        );
      }
    }
  }, [JSON.stringify(breadcrumbs)]);

  const getUserFilesFilters = (
    breadcrumb: BreadcrumbType,
    selectedDataSource: IntegrationAPIResponse | null
  ) => {
    if (selectedDataSource) {
      if (
        FOLDER_BASED_CONNECTORS.includes(selectedDataSource.data_source_type)
      ) {
        return {
          organization_user_data_source_id: [selectedDataSource.id],
          root_files_only: breadcrumb.root_files_only,
          ...(breadcrumb.parentId && {
            parent_file_ids: [breadcrumb.parentId],
          }),
        };
      } else {
        return { organization_user_data_source_id: [selectedDataSource.id] };
      }
    } else {
      return {
        source: LOCAL_FILE_TYPES,
      };
    }
  };

  const getUserFiles = async (
    selectedDataSource: IntegrationAPIResponse | null,
    offset: number,
    breadcrumb: BreadcrumbType
  ) => {
    const requestBody = {
      pagination: {
        offset: offset,
        limit: PER_PAGE,
      },
      filters: getUserFilesFilters(breadcrumb, selectedDataSource),
      order_by: "created_at",
      order_dir: "desc",
    };

    const userFilesResponse = await authenticatedFetch(
      `${BASE_URL[environment]}/user_files_v2`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    if (userFilesResponse.status === 200) {
      const data = await userFilesResponse.json();
      const count = data.count;
      const userFiles = data.results;
      return { count, userFiles };
    } else {
      setHasMoreFiles(false);
      return { count: null, userFiles: [] };
    }
  };

  const loadInitialData = async (
    selectedDataSource: IntegrationAPIResponse | null,
    breadcrumb: BreadcrumbType
  ) => {
    const { count, userFiles } = await getUserFiles(
      selectedDataSource,
      0,
      breadcrumb
    );
    setFiles([...userFiles]);
    setOffset(userFiles.length);

    if (count > userFiles.length) {
      setHasMoreFiles(true);
    } else {
      setHasMoreFiles(false);
    }
  };

  const loadMoreRows = async () => {
    if (!selectedDataSource && !isLocalFiles) return;
    setLoadingMore(true);
    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    const { count, userFiles } = await getUserFiles(
      selectedDataSource,
      offset,
      lastBreadcrumb
    );
    const newFiles = [...files, ...userFiles];
    setFiles(newFiles);
    setOffset(offset + userFiles.length);

    if (count > offset + userFiles.length) {
      setHasMoreFiles(true);
    } else {
      setHasMoreFiles(false);
    }
    setLoadingMore(false);
  };

  const onItemClick = (item: UserFileApi) => {
    if (
      filesLoading ||
      !selectedDataSource ||
      !FOLDER_BASED_CONNECTORS.includes(selectedDataSource?.data_source_type)
    )
      return;
    if (getFileItemType(item) == "FOLDER") {
      // setParentId(item.external_id);
      setBreadcrumbs((prev) => [
        ...prev,
        {
          parentId: item.id,
          name: item.name,
          accountId: selectedDataSource?.id,
          refreshes: syncedFilesRefreshes,
          root_files_only: false,
        },
      ]);
    }
  };

  const handleDeleteFiles = async () => {
    setActionInProgress(true);
    if (selectedFiles.length > 50) {
      setBannerState({
        message: "You can only select up to 50 files to delete",
        type: "ERROR",
      });
      setActionInProgress(false);
      return;
    }
    const requestBody = {
      filters: {
        ids: selectedFiles,
      },
      send_webhook:
        sendDeletionWebhooks ||
        processedIntegration?.sendDeletionWebhooks ||
        false,
    };
    const deleteFileResponse = await authenticatedFetch(
      `${BASE_URL[environment]}/delete_files_v2`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    if (deleteFileResponse.status === 200) {
      const newFiles = [
        ...files.filter((file) => !selectedFiles.find((f) => f == file.id)),
      ];
      setFiles(newFiles);
      setSelectedFiles([]);
      setBannerState({
        message: "Your files have been queued for deletion!",
        type: "SUCCESS",
      });
    } else {
      setBannerState({ message: "Error deleting files", type: "ERROR" });
      console.error("Error deleting files: ", deleteFileResponse.error);
    }
    setActionInProgress(false);
  };

  const resyncFile = async (fileId: number) => {
    const requestBody = { file_id: fileId };
    return await authenticatedFetch(`${BASE_URL[environment]}/resync_file`, {
      method: "POST",
      headers: {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
  };

  const handleResyncFiles = () => {
    setActionInProgress(true);
    if (selectedFiles.length > 20) {
      setBannerState({
        message: "You can only select up to 20 files to resync",
        type: "ERROR",
      });
      setActionInProgress(false);
      return;
    }
    const promises: any = [];
    for (let fileId of selectedFiles) {
      promises.push(resyncFile(fileId));
    }
    Promise.all(promises).then(function (values) {
      let successCount = 0;
      let failedCount = 0;
      for (let value of values) {
        if (value.status == 200) {
          successCount += 1;
        } else {
          failedCount += 1;
        }
      }
      const state = failedCount > 0 ? "ERROR" : "SUCCESS";
      setBannerState({
        message: "Finished queuing files for resync",
        type: state,
        additionalInfo: `${successCount} succeeded, ${failedCount} failed`,
      });
      setSelectedFiles([]);
      setActionInProgress(false);
    });
  };

  const onBreadcrumbClick = (index: number) => {
    if (
      !selectedDataSource ||
      !FOLDER_BASED_CONNECTORS.includes(selectedDataSource.data_source_type)
    )
      return;
    // Navigate to the clicked directory in the breadcrumb
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
  };

  return (
    <>
      <div className="cc-p-4 cc-min-h-0 cc-flex-grow cc-flex cc-flex-col">
        <div className="cc-flex cc-gap-2 sm:cc-gap-3 cc-mb-3 cc-flex-col sm:cc-flex-row">
          <p className="cc-text-xl cc-font-semibold cc-flex-grow dark:cc-text-dark-text-white">
            Synced Files
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
                className="cc-h-8 cc-text-xs !cc-pl-7"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </label>
            <Button
              size="sm"
              variant="gray"
              className="cc-rounded-xl cc-shrink-0 cc-hidden sm:cc-flex"
              onClick={() => setSyncedFilesRefreshes((prev) => prev + 1)}
            >
              <img
                src={RefreshIcon}
                alt="User Plus"
                className="cc-h-[18px] cc-w-[18px] cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
              />
            </Button>
            {mode ? (
              <Button
                size="sm"
                variant="neutral-white"
                className="cc-text-xs !cc-rounded-xl cc-font-semibold cc-shrink-0"
                onClick={() => handleUploadFilesClick()}
              >
                <img
                  src={AddCircleIconBlack}
                  alt="Add Circle Plus"
                  className="cc-h-[14px] cc-w-[14px] cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
                />
                Add more files
              </Button>
            ) : null}
          </div>
        </div>
        <div className="cc-flex cc-flex-col sm:cc-flex-row cc-text-sm cc-font-semibold cc-mb-3 cc-gap-5 sm:cc-gap-3">
          <div className="cc-overflow-auto cc-pb-4 sm:cc-pb-0 cc-px-4 -cc-mx-4 cc-flex-grow ">
            <Breadcrumb className="cc-text-nowrap cc-whitespace-nowrap cc-flex-nowrap">
              <BreadcrumbList className="cc-flex-nowrap">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem
                      className="cc-shrink-0"
                      onClick={() => onBreadcrumbClick(index)}
                    >
                      <BreadcrumbPage className="hover:cc-opacity-70 cc-cursor-pointer cc-transition-all cc-gap-1.5 cc-flex cc-shrink-0 cc-items-center dark:cc-text-dark-text-white">
                        <img
                          src={FolderIcon}
                          alt="Folder Icon"
                          className="cc-w-5 cc-shrink-0"
                        />
                        {truncateString(crumb.name, 15)}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                    {breadcrumbs.length > index + 1 ? (
                      <BreadcrumbSeparator className="cc-shrink-0" />
                    ) : null}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {selectedFiles.length > 0 ? (
            <button
              onClick={() => setSelectedFiles([])}
              className="cc-text-sm cc-font-semibold cc-text-outline-danger_high_em cc-items-start cc-text-left"
            >
              Clear selection
            </button>
          ) : (
            <label className="cc-flex cc-gap-2 cc-text-sm cc-font-semibold cc-cursor-pointer dark:cc-text-dark-text-white">
              <Checkbox
                className="my-0.5"
                checked={
                  files.length ? selectedFiles.length === files.length : false
                }
                onCheckedChange={() => {
                  const allFilesId = files.map((item) => item.id);
                  setSelectedFiles(allFilesId);
                }}
              />
              Select all
            </label>
          )}
        </div>
        <div
          id="scrollableTarget"
          className="dark:cc-border-[#FFFFFF1F] md:cc-border-x-0 md:cc-border-b-0   cc-flex cc-flex-col cc-border-outline-low_em cc-overflow-y-auto cc-overflow-x-hidden  sm:cc-mx-0 sm:cc-px-0  cc-border cc-rounded-xl md:cc-rounded-[0px] md:!cc-border-t md:cc-border-outline-base_em "
        >
          <div className="cc-bg-surface-surface_1 cc-px-4 cc-justify-between cc-hidden md:cc-hidden sm:cc-flex dark:cc-bg-dark-border-color">
            {columnsToDisplay.includes("name") ? (
              <div className=" cc-py-2 cc-w-[35%] cc-text-xs cc-text-disabledtext cc-capitalize cc-font-bold dark:cc-text-dark-input-text">
                FILE NAME
              </div>
            ) : null}
            {columnsToDisplay.includes("status") ? (
              <div className=" cc-py-2 cc-w-[15%] cc-text-right cc-text-xs cc-text-disabledtext cc-capitalize cc-font-bold    dark:cc-text-dark-input-text">
                STATUS
              </div>
            ) : null}
            {columnsToDisplay.includes("created_at") ? (
              <div className="cc-py-2 cc-w-[20%] cc-text-xs cc-text-right cc-text-disabledtext cc-capitalize cc-font-bold cc-shrink-0   dark:cc-text-dark-input-text">
                CREATED AT
              </div>
            ) : null}
            {columnsToDisplay.includes("external_url") ? (
              <div className="cc-py-2 cc-w-[30%] cc-text-right cc-text-xs cc-text-disabledtext cc-capitalize cc-font-bold cc-shrink-0  dark:cc-text-dark-input-text">
                EXTERNAL URL
              </div>
            ) : null}
          </div>
          {filesLoading ? (
            <Loader />
          ) : !filteredList.length ? (
            <div className="cc-py-4 cc-px-4 cc-text-center cc-flex-grow cc-text-disabledtext cc-font-medium cc-text-sm cc-flex cc-flex-col cc-items-center cc-justify-center h-full">
              <div className="cc-p-2 cc-bg-surface-surface_2 cc-rounded-lg cc-mb-3">
                <img
                  src={NoResultsIcon}
                  alt="No results Icon"
                  className="cc-w-6 cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
                />
              </div>
              <p className="cc-text-base cc-font-medium cc-mb-1 cc-max-w-[282px] dark:cc-text-dark-text-white">
                No matching results
              </p>
              <p className="cc-text-low_em cc-font-medium cc-max-w-[282px] dark:cc-text-dark-text-white">
                Try another search, or use search options to find a file by
                type, format or more.
              </p>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={files.length + 1}
              next={loadMoreRows}
              hasMore={hasMoreFiles} // Replace with a condition based on your data source
              loader={loadingMore ? <Loader /> : null}
              scrollableTarget="scrollableTarget"
            >
              <ul className="cc-pb-2">
                {filteredList.map((item) => {
                  const isChecked = selectedFiles.indexOf(item.id) >= 0;

                  return (
                    <FileItem
                      key={item.id}
                      isChecked={isChecked}
                      item={item}
                      onSelect={() => {
                        setSelectedFiles((prev) => {
                          if (isChecked) {
                            return prev.filter((id) => id !== item.id);
                          } else {
                            return [...prev, item.id];
                          }
                        });
                      }}
                      onClick={onItemClick}
                      columnsToDisplay={columnsToDisplay}
                    />
                  );
                })}
              </ul>
            </InfiniteScroll>
          )}
        </div>
      </div>
      {selectedFiles.length > 0 && (
        <DialogFooter className="cc-flex cc-justify-between md:cc-flex-col md:cc-gap-2">
          <Button
            variant="primary"
            size="lg"
            className="cc-w-[68%] md:cc-w-full"
            onClick={() => handleResyncFiles()}
            disabled={actionInProgress}
          >
            Resync {selectedFiles.length}{" "}
            {pluralize("file", selectedFiles.length)}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="cc-w-[30%] cc-bg-[#FFE0E0] cc-text-[#F03D3D] md:cc-w-full"
            onClick={() => handleDeleteFiles()}
            disabled={actionInProgress}
          >
            Delete {selectedFiles.length}{" "}
            {pluralize("file", selectedFiles.length)}
          </Button>
        </DialogFooter>
      )}
    </>
  );
}

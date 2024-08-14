import React, { ReactText, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import RefreshIcon from "@assets/svgIcons/refresh-icon.svg";
import { Input } from "@components/common/design-system/Input";
import { Button } from "@components/common/design-system/Button";
import { DialogFooter } from "@components/common/design-system/Dialog";
import SearchIcon from "@assets/svgIcons/search-icon.svg";
import { Checkbox } from "@components/common/design-system/Checkbox";

import { useCarbon } from "../../context/CarbonContext";
import { BASE_URL, ENV, LOCAL_FILE_TYPES } from "../../constants/shared";
import { IntegrationAPIResponse } from "../IntegrationModal";
import {
  ActiveStep,
  GithubRepoItem,
  ProcessedIntegration,
} from "../../typing/shared";
import Loader from "../common/Loader";

import Banner, { BannerState } from "../common/Banner";
import RepoItem from "../CarbonFilePicker/RepoItem";

const PER_PAGE = 20;

export default function GithubRepoScreen({
  username,
  processedIntegration,
  setActiveStep,
  activeIntegrations,
  setShowFilePicker,
  setShowAdditionalStep,
  setSelectedDataSource,
  dataSource,
  setPauseDataSourceSelection,
}: {
  username: string;
  processedIntegration: ProcessedIntegration;
  setActiveStep: React.Dispatch<React.SetStateAction<ActiveStep>>;
  activeIntegrations: IntegrationAPIResponse[];
  setShowFilePicker: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAdditionalStep: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDataSource: React.Dispatch<
    React.SetStateAction<IntegrationAPIResponse | null>
  >;
  dataSource: IntegrationAPIResponse | null;
  setPauseDataSourceSelection: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [serchValue, setSearchValue] = useState<string>("");
  const {
    authenticatedFetch,
    environment = ENV.PRODUCTION,
    accessToken,
  } = useCarbon();

  const [repos, setRepos] = useState<GithubRepoItem[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [hasMoreFiles, setHasMoreFiles] = useState(true);
  const [page, setPage] = useState(1);
  const [bannerState, setBannerState] = useState<BannerState>({
    message: null,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setPauseDataSourceSelection(true);
  }, []);

  useEffect(() => {
    const ghSource = activeIntegrations.find((i) => {
      return (
        i.data_source_type == "GITHUB" &&
        i.data_source_metadata?.["username"] == username
      );
    });
    setSelectedDataSource(ghSource || null);
  }, [JSON.stringify(activeIntegrations)]);

  useEffect(() => {
    if (!dataSource) return;
    try {
      authenticatedFetch(
        `${BASE_URL[environment]}/integrations/github/repos?data_source_id=${dataSource.id}&page=${page}&per_page=${PER_PAGE}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      ).then((res: any) => {
        res.json().then((data: GithubRepoItem[]) => {
          setRepos(data);
          if (data.length < PER_PAGE) setHasMoreFiles(false);
        });
      });
    } catch (e) {
      setBannerState({
        message: "Something went wrong fetching repositories",
        type: "ERROR",
      });
      console.error(e);
    }
  }, [dataSource?.id]);

  const loadMoreRows = async () => {
    if (!dataSource) {
      setBannerState({
        message: "Unable to find a connected data source",
        type: "ERROR",
      });
      return;
    }
    try {
      const res = await authenticatedFetch(
        `${BASE_URL[environment]}/integrations/github/repos?data_source_id=${
          dataSource.id
        }&page=${page + 1}&per_page=${PER_PAGE}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.length) {
        setPage((prev) => prev + 1);
        setRepos([...repos, ...data]);
      } else {
        setHasMoreFiles(false);
      }
    } catch (e) {
      console.error(e);
      setBannerState({
        message: "Something went wrong fetching repositories",
        type: "ERROR",
      });
    }
  };

  const syncSelectedRepos = async () => {
    if (!dataSource) {
      setBannerState({
        message: "Unable to find a connected data source",
        type: "ERROR",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await authenticatedFetch(
        `${BASE_URL[environment]}/integrations/github/sync_repos`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data_source_id: dataSource.id,
            repos: selectedRepos,
          }),
        }
      );
      if (res.status == 200) {
        setSelectedRepos([]);
        setBannerState({
          message: "We are syncing the content from your repos, please wait.",
          type: "SUCCESS",
        });
        setPauseDataSourceSelection(false);
        setTimeout(() => {
          setShowFilePicker(true);
          setShowAdditionalStep(false);
        }, 3000);
      } else {
        setBannerState({
          message: `Unable to sync your repos, ${res.detail}`,
          type: "ERROR",
        });
      }
    } catch (e) {
      console.error(e);
      setBannerState({ message: "Unable to sync your repos", type: "ERROR" });
    }
    setSubmitting(false);
  };

  return (
    <>
      <Banner bannerState={bannerState} setBannerState={setBannerState} />
      <div className="cc-p-4 cc-min-h-0 cc-flex-grow cc-flex cc-flex-col">
        <div className="cc-flex cc-gap-2 sm:cc-gap-3 cc-mb-3 cc-flex-col sm:cc-flex-row">
          <p className="cc-text-xl cc-font-semibold cc-flex-grow dark:cc-text-dark-text-white">
            All Files
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
          </div>
        </div>
        <div className="cc-flex cc-flex-col sm:cc-flex-row cc-text-sm cc-font-semibold cc-mb-3 cc-gap-5 sm:cc-gap-3">
          {selectedRepos.length > 0 ? (
            <button
              onClick={() => setSelectedRepos([])}
              className="cc-text-sm cc-font-semibold cc-text-outline-danger_high_em cc-items-start cc-text-left"
            >
              Clear selection
            </button>
          ) : (
            <label className="cc-flex cc-gap-2 cc-text-sm cc-font-semibold cc-cursor-pointer dark:cc-text-dark-text-white">
              <Checkbox
                className="my-0.5"
                checked={
                  repos.length ? selectedRepos.length === repos.length : false
                }
                onCheckedChange={() => {
                  const allFilesId = repos.map((item) => item.id);
                  setSelectedRepos(allFilesId);
                }}
              />
              Select all
            </label>
          )}
        </div>
        <div
          id="scrollableTarget"
          className=" dark:cc-border-[#FFFFFF1F] cc-border-t cc-flex cc-flex-col cc-border-outline-low_em cc-overflow-y-auto cc-overflow-x-hidden -cc-mx-4 cc-px-4 sm:cc-mx-0 sm:cc-px-0 cc-flex-grow sm:cc-border sm:cc-rounded-xl"
        >
          <div className="cc-bg-surface-surface_1 cc-hidden sm:cc-flex dark:cc-bg-dark-border-color">
            <div className="cc-px-4 cc-py-2 cc-text-xs cc-text-disabledtext cc-capitalize cc-font-bold cc-flex-grow dark:cc-text-dark-input-text">
              FILE NAME
            </div>
            {repos[0]?.name && (
              <div className="cc-px-4 cc-py-2 cc-text-xs cc-text-disabledtext cc-capitalize cc-font-bold cc-flex-grow cc-text-right sm:cc-w-[100px] dark:cc-text-dark-input-text">
                NAME
              </div>
            )}
            <div className="cc-py-2 cc-text-xs cc-text-disabledtext cc-capitalize cc-font-bold cc-shrink-0 cc-text-right sm:cc-w-[228px] dark:cc-text-dark-input-text">
              <p className="cc-px-4">URL</p>
            </div>
          </div>
          {!repos.length ? (
            <Loader />
          ) : (
            <InfiniteScroll
              dataLength={hasMoreFiles ? repos.length + 1 : repos.length}
              next={loadMoreRows}
              hasMore={hasMoreFiles} // Replace with a condition based on your data source
              loader={<Loader />}
              scrollableTarget="scrollableTarget"
            >
              <ul className="cc-pb-2">
                {repos.map((item) => {
                  const isChecked = selectedRepos.indexOf(item.id) >= 0;

                  return (
                    <RepoItem
                      key={item.id}
                      isChecked={isChecked}
                      item={item}
                      onSelect={() => {
                        setSelectedRepos((prev) => {
                          if (isChecked) {
                            return prev.filter((id) => id !== item.id);
                          } else {
                            return [...prev, item.id];
                          }
                        });
                      }}
                    />
                  );
                })}
              </ul>
            </InfiniteScroll>
          )}
        </div>
      </div>
      {selectedRepos.length > 0 && (
        <DialogFooter>
          <Button
            variant="primary"
            size="lg"
            className="cc-w-full"
            onClick={() => {
              // setIsUploading({ state: true, percentage: 24 });
              syncSelectedRepos();
            }}
            disabled={submitting}
          >
            Select {selectedRepos.length} repo(s)
          </Button>
        </DialogFooter>
      )}
    </>
  );
}

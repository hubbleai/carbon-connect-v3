import React, { useState } from "react";
import RefreshIcon from "@assets/svgIcons/refresh-icon.svg";
import { Input } from "@components/common/design-system/Input";
import { Button } from "@components/common/design-system/Button";
import { DialogFooter } from "@components/common/design-system/Dialog";
import FolderIcon from "@assets/svgIcons/folder.svg";
import FIleIcon from "@assets/svgIcons/file.svg";
import SearchIcon from "@assets/svgIcons/search-icon.svg";
import NoResultsIcon from "@assets/svgIcons/no-result.svg";
import AddCircleIconBlack from "@assets/svgIcons/add-circle-icon-black.svg";
import { Checkbox } from "@components/common/design-system/Checkbox";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/common/design-system/Breadcrumb";

type FileItemType = {
  type: "FILE";
  id: string;
  name: string;
  createdAt: string;
  status?: "READY" | "ERROR" | "SYNCING";
};

type FolderItemType = {
  type: "FOLDER";
  id: string;
  name: string;
  createdAt: string;
  status?: "READY" | "ERROR" | "SYNCING";
};

type GithubRepoItemType = {
  type: "GITHUB_REPO";
  id: string;
  name: string;
  url: string;
  status?: "READY" | "ERROR" | "SYNCING";
};

const fileList: (FileItemType | FolderItemType | GithubRepoItemType)[] = [
  {
    type: "GITHUB_REPO",
    id: "Awesome-Algorithms",
    name: "Awesome-Algorithms",
    url: "https://github.com/yourusername/Awesome-Algorithms",
  },
  {
    type: "GITHUB_REPO",
    id: "MachineLearning101",
    name: "MachineLearning101",
    url: "https://github.com/yourusername/MachineLearning101",
  },
  {
    type: "GITHUB_REPO",
    id: "ReactNativeApp",
    name: "ReactNativeApp",
    url: "https://github.com/yourusername/ReactNativeApp",
  },
  {
    type: "FOLDER",
    id: "Downloads",
    name: "Downloads",
    createdAt: "Dec 7, 2019 07:09 AM",
  },
  {
    type: "FOLDER",
    id: "Received Files",
    name: "Received Files",
    createdAt: "Dec 7, 2019 07:09 AM",
  },
  {
    type: "FOLDER",
    id: "Personal",
    name: "Personal",
    createdAt: "Mar 20, 2019 07:09 AM",
    status: "SYNCING",
  },
  {
    type: "FILE",
    id: "Asset 10.png",
    name: "Asset 10.png",
    createdAt: "May 06, 2024 07:09 AM",
    status: "READY",
  },
  {
    type: "FILE",
    id: "Chat GPT Prompt - Summary.docx",
    name: "Chat GPT Prompt - Summary.docx",
    createdAt: "Dec 7, 2019 07:09 AM",
    status: "ERROR",
  },
  {
    type: "FILE",
    id: "errors.txt",
    name: "errors.txt",
    createdAt: "Feb 2, 2019 07:09 AM",
  },
];

export default function FileSelector({
  setIsUploading,
}: {
  setIsUploading: (val: { state: boolean; percentage: number }) => void;
}) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [serchValue, setSearchValue] = useState<string>("");

  const filteredList = fileList.filter(
    (item) =>
      item.name.includes(serchValue) ||
      (item.type === "GITHUB_REPO" && item.url?.includes(serchValue))
  );

  return (
    <>
      <div className="cc-p-4 cc-flex cc-flex-col cc-overflow-auto">
        <div className="cc-flex cc-gap-2 sm:cc-gap-3 cc-mb-3 cc-flex-col sm:cc-flex-row">
          <p className="cc-text-xl cc-font-semibold cc-flex-grow">
            Select repos to sync
          </p>
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
          >
            View synced files
          </Button>
          <Button
            size="sm"
            variant="gray"
            className="cc-rounded-xl cc-shrink-0 cc-hidden sm:cc-flex"
          >
            <img
              src={RefreshIcon}
              alt="User Plus"
              className="cc-h-[18px] cc-w-[18px] cc-shrink-0"
            />
          </Button>
          <Button
            size="sm"
            variant="neutral-white"
            className="cc-text-xs cc-rounded-xl cc-font-semibold"
          >
            <img
              src={AddCircleIconBlack}
              alt="Add Circle Plus"
              className="cc-h-[14px] cc-w-[14px] cc-shrink-0"
            />
            Add more files
          </Button>
        </div>
        <div className="cc-flex cc-flex-col sm:cc-flex-row cc-text-sm cc-font-semibold cc-mb-3 cc-gap-5 sm:cc-gap-3">
          <div className="cc-overflow-auto cc-pb-4 sm:cc-pb-0 cc-px-4 -cc-mx-4 cc-flex-grow">
            <Breadcrumb className="cc-text-nowrap cc-whitespace-nowrap cc-flex-nowrap">
              <BreadcrumbList className="cc-flex-nowrap">
                <BreadcrumbItem className="cc-shrink-0">
                  <BreadcrumbPage className="hover:cc-opacity-70 cc-cursor-pointer cc-transition-all cc-gap-1.5 cc-flex cc-shrink-0 cc-items-center">
                    <img
                      src={FolderIcon}
                      alt="Folder Icon"
                      className="cc-w-5 cc-shrink-0"
                    />
                    All Repos
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="cc-shrink-0" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="hover:cc-opacity-70 cc-cursor-pointer cc-transition-all cc-shrink-0">
                    Awesome-Algorithms
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="cc-shrink-0" />
                <BreadcrumbItem className="cc-shrink-0">
                  <BreadcrumbPage>Contoso Project</BreadcrumbPage>
                </BreadcrumbItem>
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
            <label className="cc-flex cc-gap-2 cc-text-sm cc-font-semibold cc-cursor-pointer">
              <Checkbox
                className="my-0.5"
                checked={selectedFiles.length === fileList.length}
                onCheckedChange={() => {
                  const allFilesId = fileList.map((item) => item.id);
                  setSelectedFiles(allFilesId);
                }}
              />
              Select all
            </label>
          )}
        </div>
        <div className="cc-border-t cc-flex cc-flex-col cc-border-outline-low_em cc-overflow-auto cc-flex-grow sm:cc-h-80 sm:cc-border sm:cc-rounded-xl">
          <div className="cc-bg-surface-surface_1 cc-hidden sm:cc-flex">
            <div className="cc-px-4 cc-py-2 cc-text-xs cc-text-disabledtext cc-capitalize cc-font-bold cc-flex-grow">
              FILE NAME
            </div>
            {filteredList[0]?.status && (
              <div className="cc-px-4 cc-py-2 cc-text-xs cc-text-disabledtext cc-capitalize cc-font-bold cc-flex-grow cc-text-right sm:cc-w-[100px]">
                STATUS
              </div>
            )}
            <div className="cc-py-2 cc-text-xs cc-text-disabledtext cc-capitalize cc-font-bold cc-shrink-0 cc-text-right sm:cc-w-[228px]">
              <p className="cc-px-4">CREATED AT</p>
            </div>
          </div>
          {filteredList.length > 0 ? (
            <ul className="cc-pb-2 sm:cc-px-4">
              {filteredList.map((item) => {
                const isChecked = selectedFiles.indexOf(item.id) >= 0;

                return (
                  <GithubRepoItem
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
                  />
                );
              })}
            </ul>
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
      {selectedFiles.length > 0 && (
        <DialogFooter>
          <Button
            variant="primary"
            size="lg"
            className="cc-w-full"
            onClick={() => {
              setIsUploading({ state: true, percentage: 24 });
            }}
          >
            Upload {selectedFiles.length} files
          </Button>
        </DialogFooter>
      )}
    </>
  );
}

type GithubRepoItemProps = {
  isChecked: boolean;
  onSelect: () => void;
  item: FileItemType | FolderItemType | GithubRepoItemType;
};

const GithubRepoItem = ({ item, isChecked, onSelect }: GithubRepoItemProps) => {
  return (
    <li
      key={item.id}
      className="cc-flex cc-transition-all cc-py-3 cc-font-semibold cc-text-high_em cc-text-sm cc-border-b cc-border-outline-base_em hover:cc-bg-gray-25 cc-cursor-pointer"
    >
      <div className="cc-gap-2 cc-flex cc-items-start cc-w-full sm:cc-px-2">
        <Checkbox
          className="cc-my-0.5"
          checked={isChecked}
          onCheckedChange={onSelect}
        />
        {item.type === "FOLDER" && (
          <img
            src={FolderIcon}
            alt="Folder Icon"
            className="cc-w-5 cc-shrink-0"
          />
        )}
        {item.type === "FILE" && (
          <img
            src={FIleIcon}
            alt="Folder Icon"
            className="cc-w-5 cc-shrink-0"
          />
        )}
        <div className="cc-flex cc-flex-grow cc-gap-x-4 cc-gap-y-1 cc-flex-wrap">
          <p className="cc-flex-grow">{item.name}</p>
          <>
            {item.status && item.status === "READY" && (
              <div className="cc-bg-surface-success_accent_1 cc-text-success_high_em cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg">
                Ready
              </div>
            )}
            {item.status && item.status === "ERROR" && (
              <div className="cc-bg-surface-danger_accent_1 cc-text-outline-danger_high_em cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg">
                Error
              </div>
            )}
            {item.status && item.status === "SYNCING" && (
              <div className="cc-bg-surface-warning_accent_1 cc-text-warning-600 cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg">
                Syncing
              </div>
            )}
          </>
          <p className="cc-w-full cc-shrink-0 cc-text-left cc-text-xs cc-text-low_em sm:cc-text-high_em sm:cc-w-[200px] sm:text-sm sm:cc-text-right sm:cc-text-sm cc-truncate">
            {(item.type === "FOLDER" || item.type === "FILE") && item.createdAt}
            {item.type === "GITHUB_REPO" && item.url}
          </p>
        </div>
      </div>
    </li>
  );
};

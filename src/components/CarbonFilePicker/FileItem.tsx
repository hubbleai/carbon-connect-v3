import React, { useEffect } from "react";
import FolderIcon from "@assets/svgIcons/folder.svg";
import FIleIcon from "@assets/svgIcons/file.svg";
import { Checkbox } from "@components/common/design-system/Checkbox";
import { FileTabColumns, UserFileApi } from "../../typing/shared";
import { formatDate, getFileItemType } from "../../utils/helper-functions";

type FileListItemProps = {
  isChecked: boolean;
  onSelect: () => void;
  item: UserFileApi;
  onClick: (item: UserFileApi) => void;
  columnsToDisplay: FileTabColumns[];
};

export default function FileItem({
  item,
  isChecked,
  onSelect,
  onClick,
  columnsToDisplay,
}: FileListItemProps) {
  const itemType = getFileItemType(item);
  useEffect(() => {
    console.log(columnsToDisplay.length);
  }, []);
  return (
    <li
      key={item.id}
      className="cc-flex cc-px-4  md:!cc-px-[0px] cc-transition-all cc-font-semibold cc-text-high_em cc-text-sm hover:cc-bg-gray-25 cc-cursor-pointer dark:cc-text-dark-text-white dark:hover:cc-bg-[#464646]"
    >
      <div className="cc-gap-2 cc-flex cc-items-start cc-w-full  cc-border-b cc-border-outline-base_em cc-py-3">
        <Checkbox
          className="cc-my-0.5"
          checked={isChecked}
          onCheckedChange={onSelect}
        />
        {itemType === "FOLDER" && (
          <img
            src={FolderIcon}
            alt="Folder Icon"
            className="cc-w-5 cc-shrink-0"
          />
        )}
        {itemType === "FILE" && (
          <img
            src={FIleIcon}
            alt="Folder Icon"
            className="cc-w-5 cc-shrink-0"
          />
        )}

        <div
          className="cc-flex cc-w-full cc-flex-wrap cc-gap-y-1  cc-items-start cc-justify-between"
          onClick={() => onClick(item)}
        >
          {columnsToDisplay.includes("name") ? (
            <div
              className={`cc-flex cc-justify-between  md:cc-w-[60%] cc-items-start ${
                !columnsToDisplay.includes("external_url") &&
                !columnsToDisplay.includes("created_at")
                  ? "cc-w-[70%]"
                  : !columnsToDisplay.includes("status") &&
                    !columnsToDisplay.includes("external_url")
                  ? "cc-w-[70%]"
                  : !columnsToDisplay.includes("status") &&
                    !columnsToDisplay.includes("created_at")
                  ? "cc-w-[45%]"
                  : !columnsToDisplay.includes("external_url") &&
                    columnsToDisplay.includes("status") &&
                    columnsToDisplay.includes("created_at")
                  ? "cc-w-[37%]"
                  : columnsToDisplay.includes("external_url") &&
                    columnsToDisplay.includes("status") &&
                    !columnsToDisplay.includes("created_at")
                  ? "cc-w-[37%]"
                  : "cc-w-[26.69%] "
              }`}
            >
              <p className=" cc-w-[100%] md:cc-max-w-[100%] cc-max-w-[100%] cc-break-all ">
                {item.name}
              </p>
            </div>
          ) : null}

          {columnsToDisplay.includes("status") ? (
            <div
              className={` cc-flex cc-justify-end ${
                columnsToDisplay.includes("external_url") &&
                columnsToDisplay.includes("created_at")
                  ? "cc-w-[16%]"
                  : !columnsToDisplay.includes("external_url") &&
                    columnsToDisplay.includes("status") &&
                    columnsToDisplay.includes("created_at")
                  ? "cc-w-[9%]"
                  : columnsToDisplay.includes("external_url") &&
                    columnsToDisplay.includes("status") &&
                    !columnsToDisplay.includes("created_at")
                  ? "cc-w-[9%]"
                  : "cc-w-[20%]"
              }`}
            >
              <>
                {item.sync_status && item.sync_status === "READY" && (
                  <div className="cc-bg-surface-success_accent_1 cc-text-success_high_em cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg">
                    Ready
                  </div>
                )}
                {item.sync_status && item.sync_status === "SYNC_ERROR" && (
                  <div className="cc-bg-surface-danger_accent_1 cc-text-outline-danger_high_em cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg">
                    Error
                  </div>
                )}
                {item.sync_status &&
                  (item.sync_status === "SYNCING" ||
                    item.sync_status === "QUEUED_FOR_SYNC") && (
                    <div className="cc-bg-surface-warning_accent_1 cc-text-warning-600 cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg">
                      Syncing
                    </div>
                  )}
              </>
            </div>
          ) : null}

          {columnsToDisplay.includes("created_at") ? (
            <div className="cc-flex cc-justify-end cc-w-[22%] md:cc-w-full">
              <p className=" cc-shrink-0 cc-text-left md:cc-text-xs md:cc-text-low_em cc-text-high_em md:cc-w-full md:text-sm md:cc-text-left cc-text-sm cc-truncate dark:cc-text-dark-text-white ">
                {(itemType === "FOLDER" || itemType === "FILE") &&
                  formatDate(item.created_at)}
              </p>
            </div>
          ) : null}

          {columnsToDisplay.includes("external_url") ? (
            <div
              className={`cc-flex cc-justify-end  ${
                columnsToDisplay.includes("status") &&
                !columnsToDisplay.includes("created_at")
                  ? "md:cc-w-[75%] cc-w-[32%]"
                  : !columnsToDisplay.includes("status") &&
                    !columnsToDisplay.includes("created_at")
                  ? "cc-w-[50%] md:cc-w-full"
                  : columnsToDisplay.includes("external_url") &&
                    columnsToDisplay.includes("status") &&
                    !columnsToDisplay.includes("created_at")
                  ? "cc-w-[32%]"
                  : "md:cc-w-full cc-w-[25%]"
              }`}
            >
              <p
                title={item.external_url ?? undefined}
                className="cc-w-full cc-break-all cc-text-left md:cc-text-xs md:!cc-text-low_em sm:cc-text-high_em sm:cc-w-full sm:text-sm sm:cc-text-right cc-line-clamp-3  md:cc-text-left sm:cc-text-sm dark:cc-text-dark-text-white"
              >
                {item.external_url || "NA"}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

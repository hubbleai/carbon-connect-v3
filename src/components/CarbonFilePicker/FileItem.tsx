import React from "react";
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
  return (
    <li
      key={item.id}
      className="cc-flex sm:cc-px-4 cc-transition-all cc-font-semibold cc-text-high_em cc-text-sm hover:cc-bg-gray-25 cc-cursor-pointer dark:cc-text-dark-text-white dark:hover:cc-bg-[#464646]"
    >
      <div className="cc-gap-2 cc-flex cc-items-start cc-w-full sm:cc-px-2 cc-border-b cc-border-outline-base_em cc-py-3">
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
          className="cc-flex cc-flex-grow cc-gap-x-4 cc-gap-y-1 cc-flex-wrap cc-items-start"
          onClick={() => onClick(item)}
        >
          {columnsToDisplay.includes("name") ? (
            <p className="cc-flex-grow cc-w-[350px] cc-max-w-[350px] cc-break-words ">
              {item.name}
            </p>
          ) : null}
          {columnsToDisplay.includes("status") ? (
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
          ) : null}
          {columnsToDisplay.includes("external_url") ? (
            <p className="cc-w-full cc-break-words cc-text-left cc-text-xs cc-text-low_em sm:cc-text-high_em sm:cc-w-[200px] sm:text-sm sm:cc-text-right sm:cc-text-sm dark:cc-text-dark-text-white">
              {item.external_url || "NA"}
            </p>
          ) : null}
          {columnsToDisplay.includes("created_at") ? (
            <p className="cc-w-full cc-shrink-0 cc-text-left cc-text-xs cc-text-low_em sm:cc-text-high_em sm:cc-w-[200px] sm:text-sm sm:cc-text-right sm:cc-text-sm cc-truncate dark:cc-text-dark-text-white">
              {(itemType === "FOLDER" || itemType === "FILE") &&
                formatDate(item.created_at)}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

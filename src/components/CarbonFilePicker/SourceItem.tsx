import React, { useState } from "react";
import FolderIcon from "@assets/svgIcons/folder.svg";
import FIleIcon from "@assets/svgIcons/file.svg";
import { Checkbox } from "@components/common/design-system/Checkbox";
import { UserSourceItemApi } from "../../typing/shared";
import { formatDate, getSourceItemType } from "../../utils/helper-functions";
import { useCarbon } from "../../context/CarbonContext";
import ErrorTooltip from "./ErrorTooltip";

export default function SourceItem({
  item,
  isChecked,
  onSelect,
  onItemClick,
  allowedFormats,
}: {
  isChecked: boolean;
  onSelect: () => void;
  item: UserSourceItemApi;
  onItemClick: (item: UserSourceItemApi) => void;
  allowedFormats: string[] | null;
}) {
  const itemType = getSourceItemType(item);

  const getFileFormat = (item: UserSourceItemApi) => {
    const parts = item.name.split(".");
    if (parts.length > 1) {
      return parts[parts.length - 1].toUpperCase();
    }
    return null;
  };

  const itemDisabledReason = (item: UserSourceItemApi): string | null => {
    if (!item.is_selectable) return "Syncing this item is not supported";
    const fileFormat = item.file_format || getFileFormat(item);
    if (allowedFormats && fileFormat && !allowedFormats.includes(fileFormat)) {
      return "This file format is not supported";
    }
    return null;
  };
  const disabledReason = itemDisabledReason(item);

  return (
    <li
      key={item.id}
      className="cc-flex cc-px-4 md:!cc-px-[0px] cc-transition-all cc-font-semibold cc-text-high_em cc-text-sm hover:cc-bg-gray-25 cc-cursor-pointer dark:cc-text-dark-text-white dark:hover:cc-bg-[#464646]"
    >
      <div className="cc-gap-2 cc-flex cc-items-start cc-w-full  cc-border-b cc-border-outline-base_em cc-py-3">
        <div className="cc-relative error">
          <Checkbox
            className="cc-my-0.5 "
            checked={isChecked}
            onCheckedChange={onSelect}
            disabled={Boolean(disabledReason)}
          />
          {Boolean(disabledReason) ? (
            <div className="cc-absolute cc-top-[32px] -cc-left-[11px] error-tooltip cc-z-[1]">
              <ErrorTooltip leftPosTip={"12"} message={disabledReason} />
            </div>
          ) : null}
        </div>

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
          className="cc-flex cc-flex-grow cc-gap-x-4 cc-gap-y-1 cc-flex-wrap cc-items-start cc-justify-between"
          onClick={() => onItemClick(item)}
        >
          <p className="cc-flex-grow dark:cc-text-dark-text-white cc-w-[350px] cc-max-w-[350px] cc-break-words">
            {item.name}
          </p>
          <p className="cc-w-full cc-shrink-0 cc-text-left cc-text-xs cc-text-low_em sm:cc-text-high_em sm:cc-w-[200px] sm:text-sm sm:cc-text-right sm:cc-text-sm cc-truncate dark:cc-text-dark-text-white">
            {(itemType === "FOLDER" || itemType === "FILE") &&
              formatDate(item.created_at)}
          </p>
        </div>
      </div>
    </li>
  );
}

import React, { useState } from "react";
import FolderIcon from "@assets/svgIcons/folder.svg";
import FIleIcon from "@assets/svgIcons/file.svg";
import { Checkbox } from "@components/common/design-system/Checkbox";
import { IntegrationName, UserSourceItemApi } from "../../typing/shared";
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
    // allow all files from github because they don't match our file formats
    if (item.source == IntegrationName.GITHUB) {
      return null;
    }
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
      <div className="cc-gap-2 cc-flex cc-items-start cc-w-full  cc-border-b cc-border-outline-base_em cc-py-3 ">
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
          className="cc-flex cc-flex-grow cc-gap-x-[0px] cc-gap-y-1 cc-flex-wrap cc-items-start cc-justify-between smallMobile:cc-flex-col"
          onClick={() => onItemClick(item)}
        >
          <p className="sm:cc-flex-grow dark:cc-text-dark-text-white sm:cc-w-[335px] tab:!cc-max-w-[308px] sm:cc-max-w-[334px] cc-break-words">
            {item.name}
          </p>
          <p className=" cc-shrink-0 cc-text-left cc-text-xs  sm:text-sm sm:cc-text-right  cc-truncate dark:cc-text-dark-text-white tabMax:!cc-px-[8px] sm:cc-max-w-[89px] dark:!cc-bg-[#ffffff33] cc-font-semibold  cc-py-[3px] cc-text-xs cc-px-1 cc-rounded-lg sm:cc-w-fit cc-bg-surface-surface_2">
            {item.item_type}
          </p>
          <p className="cc-w-full cc-shrink-0 cc-text-left cc-text-xs cc-text-low_em sm:cc-text-high_em sm:cc-w-[239px] sm:text-sm sm:cc-text-right sm:cc-text-sm cc-truncate dark:cc-text-dark-text-white tabMax:!cc-text-left">
            {(itemType === "FOLDER" || itemType === "FILE") &&
              formatDate(item.created_at)}
          </p>
        </div>
      </div>
    </li>
  );
}

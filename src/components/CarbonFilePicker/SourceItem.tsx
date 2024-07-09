import React, { useState } from "react";
import FolderIcon from "@assets/svgIcons/folder.svg";
import FIleIcon from "@assets/svgIcons/file.svg";
import { Checkbox } from "@components/common/design-system/Checkbox";
import { UserSourceItemApi } from "../../typing/shared";
import { formatDate, getSourceItemType } from "../../utils/helper-functions";

export default function SourceItem({
  item,
  isChecked,
  onSelect,
  onItemClick,
}: {
  isChecked: boolean;
  onSelect: () => void;
  item: UserSourceItemApi;
  onItemClick: (item: UserSourceItemApi) => void;
}) {
  const itemType = getSourceItemType(item);
  return (
    <li
      key={item.id}
      className="cc-flex sm:cc-px-4 cc-transition-all cc-font-semibold dark:hover:cc-bg-[#464646]/25  cc-text-high_em cc-text-sm hover:cc-bg-gray-25 cc-cursor-pointer"
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

import React, { useState } from "react";
import FolderIcon from "@assets/svgIcons/folder.svg";
import { Checkbox } from "@components/common/design-system/Checkbox";
import { GithubRepoItem } from "../../typing/shared";

export default function RepoItem({
  item,
  isChecked,
  onSelect,
}: {
  isChecked: boolean;
  onSelect: () => void;
  item: GithubRepoItem;
}) {
  return (
    <li
      key={item.url}
      className="cc-flex cc-px-4 md:!cc-px-[0px] cc-transition-all cc-font-semibold dark:hover:cc-bg-[#464646]/25 dark:cc-text-dark-text-white  cc-text-high_em cc-text-sm hover:cc-bg-gray-25  cc-cursor-pointer"
    >
      <div className="cc-gap-2 cc-flex cc-items-start cc-w-full  cc-border-b cc-border-outline-base_em cc-py-3">
        <Checkbox
          className="cc-my-0.5"
          checked={isChecked}
          onCheckedChange={onSelect}
        />
        <img
          src={FolderIcon}
          alt="Folder Icon"
          className="cc-w-5 cc-shrink-0"
        />

        <div className="cc-flex cc-flex-grow cc-gap-x-4 cc-gap-y-1 md:cc-flex-col cc-items-start">
          <div className="cc-flex cc-justify-between cc-w-[66%] md:cc-w-[100%] cc-items-start">
            <p className="cc-flex-grow dark:cc-text-dark-text-white cc-w-[72.88%] md:cc-max-w-[62%] cc-max-w-[72.88%] cc-break-all">
              {item.name}
            </p>
            <p className="cc-w-full cc-shrink-0 cc-text-left cc-text-xs cc-text-low_em sm:cc-text-high_em sm:cc-w-[200px] sm:text-sm sm:cc-text-right sm:cc-text-sm cc-truncate dark:cc-text-dark-text-white">
              {item.url}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

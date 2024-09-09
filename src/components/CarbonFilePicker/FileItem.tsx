import React from "react";
import FolderIcon from "@assets/svgIcons/folder.svg";
import FIleIcon from "@assets/svgIcons/file.svg";
import { Checkbox } from "@components/common/design-system/Checkbox";
import { FileTabColumns, UserFileApi } from "../../typing/shared";
import { formatDate, getFileItemType } from "../../utils/helper-functions";
import ErrorTooltip from "./ErrorTooltip";

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
    <>
      <tr
        key={`file-${item.id}`}
        className="cc-border-b cc-border-[#00000012] hover:cc-bg-surface-surface_1 cc-cursor-pointer"
        onClick={() => onClick(item)}
      >
        <th className="cc-flex cc-items-center cc-pl-6 cc-pr-2 cc-py-3  md:!cc-hidden ">
          <Checkbox
            className="cc-my-0.5 cc-mr-[8px]"
            checked={isChecked}
            onCheckedChange={onSelect}
          />
          {itemType === "FOLDER" && (
            <img
              src={FolderIcon}
              alt="Folder Icon"
              className="cc-w-5 cc-shrink-0 cc-mr-[8px]"
            />
          )}
          {itemType === "FILE" && (
            <img
              src={FIleIcon}
              alt="File Icon"
              className="cc-w-5 cc-shrink-0 cc-mr-[8px]"
            />
          )}

          {columnsToDisplay.includes("name") && (
            <p
              className={` ${
                columnsToDisplay.includes("created_at") &&
                columnsToDisplay.includes("external_url")
                  ? "cc-w-auto"
                  : "cc-w-[312px]"
              } cc-break-all cc-line-clamp-2 cc-text-start cc-text-[#000] cc-text-[14px] cc-font-semibold cc-leadind-[24px]`}
            >
              {item.name || "Untitled"}
            </p>
          )}
        </th>

        {columnsToDisplay.includes("status") && (
          <td className="cc-py-3 cc-px-2 cc-align-top  md:cc-hidden cc-table-cell">
            {item.sync_status === "READY" && (
              <div className="cc-w-fit cc-bg-surface-success_accent_1 cc-text-success_high_em cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg cc-font-semibold">
                Ready
              </div>
            )}
            {item.sync_status === "SYNC_ERROR" && (
              <>
                <div className="cc-w-fit cc-font-semibold cc-bg-surface-danger_accent_1 cc-text-outline-danger_high_em cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg cc-relative error">
                  Error
                  <div className="cc-absolute cc-top-[32px] -cc-left-[6px] error-tooltip">
                    <ErrorTooltip
                      leftPosTip={"21"}
                      message={item.sync_error_message}
                    />
                  </div>
                </div>
              </>
            )}
            {(item.sync_status === "SYNCING" ||
              item.sync_status === "QUEUED_FOR_SYNC") && (
              <div className="cc-w-fit cc-font-semibold cc-bg-surface-warning_accent_1 cc-text-warning-600 cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg">
                Syncing
              </div>
            )}
          </td>
        )}

        {columnsToDisplay.includes("created_at") && (
          <td className="cc-py-3 cc-px-2 cc-align-top md:cc-hidden cc-table-cell">
            <p className="cc-text-[14px] cc-leading-[24px] cc-font-semibold ">
              {formatDate(item.created_at)}
            </p>
          </td>
        )}

        {columnsToDisplay.includes("external_url") && (
          <td className="cc-py-3 cc-px-2 cc-align-top md:cc-hidden cc-table-cell">
            <p
              title={item.external_url || "NA"}
              className="cc-w-[250px] cc-break-all cc-text-[14px] cc-leading-[24px] cc-font-semibold cc-line-clamp-3"
            >
              {item.external_url || "NA"}
            </p>
          </td>
        )}

        {/* Mobile view */}

        <td className="md:!cc-table-cell cc-hidden cc-py-3 cc-px-2 cc-align-top">
          <div>
            <div className="cc-flex">
              <Checkbox
                className="cc-my-0.5 cc-mr-[8px]"
                checked={isChecked}
                onCheckedChange={onSelect}
              />
              {itemType === "FOLDER" && (
                <img
                  src={FolderIcon}
                  alt="Folder Icon"
                  className="cc-w-5 cc-shrink-0 cc-mr-[8px]"
                />
              )}
              {itemType === "FILE" && (
                <img
                  src={FIleIcon}
                  alt="File Icon"
                  className="cc-w-5 cc-shrink-0 cc-mr-[8px]"
                />
              )}
              <p className="cc-w-[100%] cc-break-all cc-text-start cc-text-[#000] cc-text-[14px] cc-font-semibold cc-leadind-[24px]">
                {item.name}
              </p>
              <div>
                {columnsToDisplay.includes("status") && (
                  <>
                    {item.sync_status === "READY" && (
                      <div className="cc-w-fit cc-bg-surface-success_accent_1 cc-text-success_high_em cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg cc-font-semibold">
                        Ready
                      </div>
                    )}
                    {item.sync_status === "SYNC_ERROR" && (
                      <div className="cc-w-fit cc-font-semibold cc-bg-surface-danger_accent_1 cc-text-outline-danger_high_em cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg cc-relative error">
                        Error
                        <div className="cc-absolute cc-top-[32px] -cc-left-[107px] error-tooltip">
                          <ErrorTooltip
                            leftPosTip={"116"}
                            message={item.sync_error_message}
                          />
                        </div>
                      </div>
                    )}
                    {(item.sync_status === "SYNCING" ||
                      item.sync_status === "QUEUED_FOR_SYNC") && (
                      <div className="cc-w-fit cc-font-semibold cc-bg-surface-warning_accent_1 cc-text-warning-600 cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg">
                        Syncing
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="cc-ml-[54px]">
              {columnsToDisplay.includes("created_at") && (
                <div className="cc-my-[4px] ">
                  <p className="cc-text-[12px] cc-text-[#8C8A94] cc-leading-[16px] cc-font-semibold">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              )}
              {columnsToDisplay.includes("external_url") && (
                <div>
                  <p
                    title={item.external_url || "NA"}
                    className="cc-w-full cc-break-all cc-text-[#8C8A94] cc-text-[12px] cc-leading-[16px] cc-font-semibold"
                  >
                    {item.external_url || "NA"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

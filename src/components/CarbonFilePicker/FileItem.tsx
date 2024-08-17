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
  return (
    <>
     <tr key={item.id} >
  
 <th className="cc-flex">
 <Checkbox
     className="cc-my-0.5"
     checked={isChecked}
     onCheckedChange={onSelect}
   />
   {itemType === "FOLDER" && (
     <img src={FolderIcon} alt="Folder Icon" className="cc-w-5 cc-shrink-0" />
   )}
   {itemType === "FILE" && (
     <img src={FIleIcon} alt="File Icon" className="cc-w-5 cc-shrink-0" />
   )}
 </th>


   {columnsToDisplay.includes("name") && (
     <td>
       <p className="cc-w-[100%] cc-break-all">{item.name}</p>
     </td>
   )}

   {columnsToDisplay.includes("status") && (
     <td >
       {item.sync_status === "READY" && (
         <div className="cc-bg-surface-success_accent_1 cc-text-success_high_em cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg">
           Ready
         </div>
       )}
       {item.sync_status === "SYNC_ERROR" && (
         <div className="cc-bg-surface-danger_accent_1 cc-text-outline-danger_high_em cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg">
           Error
         </div>
       )}
       {(item.sync_status === "SYNCING" || item.sync_status === "QUEUED_FOR_SYNC") && (
         <div className="cc-bg-surface-warning_accent_1 cc-text-warning-600 cc-py-[3px] cc-text-xs cc-px-2 cc-rounded-lg">
           Syncing
         </div>
       )}
     </td>
   )}

   {columnsToDisplay.includes("created_at") && (
     <td >
       <p className="cc-shrink-0 cc-text-left md:cc-text-xs md:cc-text-low_em cc-text-high_em md:cc-w-full md:text-sm md:cc-text-left cc-text-sm cc-truncate dark:cc-text-dark-text-white">
         {formatDate(item.created_at)}
       </p>
     </td>
   )}

   {columnsToDisplay.includes("external_url") && (
     <td >
       <p
         title={item.external_url || "NA"}
         className="cc-w-full cc-break-all cc-text-left md:cc-text-xs md:!cc-text-low_em sm:cc-text-high_em sm:text-sm sm:cc-text-right cc-line-clamp-3 dark:cc-text-dark-text-white"
       >
         {item.external_url || "NA"}
       </p>
     </td>
   )}
 </tr>
    </>
    
   
   
  );
}

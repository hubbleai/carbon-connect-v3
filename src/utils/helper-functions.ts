import { Integration } from "..";
import { IntegrationAPIResponse } from "../components/IntegrationModal";
import {
  DEFAULT_CHUNK_SIZE,
  DEFAULT_OVERLAP_SIZE,
  DEFAULT_SIZE_MB,
  ONE_MB,
  SYNC_FILES_ON_CONNECT,
  SYNC_SOURCE_ITEMS,
} from "../constants/shared";
import { useCarbon } from "../context/CarbonContext";
import {
  Formats,
  ProcessedIntegration,
  IntegrationName,
  UserSourceItemApi,
  UserFileApi,
  ActionType,
  CarbonConnectProps,
} from "../typing/shared";
import { IntegrationItemType } from "./integrationModalconstants";

export function isEmpty(obj: any) {
  let isEmpty = false;
  const type = typeof obj;
  isEmpty = isEmpty || !obj;
  isEmpty = isEmpty || type === "undefined"; // if it is undefined
  isEmpty = isEmpty || obj === null; // if it is null
  isEmpty = isEmpty || (type === "string" && obj.trim() === ""); // if the string is empty or only have spaces
  isEmpty = isEmpty || obj === false || obj === 0; // if boolean value returns false
  isEmpty = isEmpty || (Array.isArray(obj) && obj.length === 0); // if array is empty
  isEmpty = isEmpty || (type === "object" && Object.keys(obj).length === 0); // if object is empty
  return isEmpty;
}

export const deepClone = (data: any = {}) => {
  return JSON.parse(JSON.stringify(data));
};

export const emptyFunction = () => {};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number = 500
) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const getInitials = (name: string) => {
  if (name !== undefined && name !== null) {
    var parts = name.split(" ");
    var initials = "";
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].length > 0 && parts[i] !== "") {
        initials += parts[i][0].toUpperCase();
      }
    }
    return initials;
  }
};

export function keyExists(key: string, obj: any) {
  if (
    (Array.isArray(obj) && key in obj) ||
    (obj instanceof Object && Object.prototype.hasOwnProperty.call(obj, key))
  ) {
    return true;
  }
  return false;
}

export const generateRequestId = (length: number) => {
  const prefix = "cc-";
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return prefix + result;
};

export const getConnectRequestProps = (
  processedIntegration: ProcessedIntegration,
  requestId: string | null,
  additionalProps: object = {},
  carbonProps: CarbonConnectProps
) => {
  const {
    chunkSize,
    overlapSize,
    embeddingModel,
    generateSparseVectors,
    prependFilenameToChunks,
    tags,
    fileSyncConfig,
    maxItemsPerChunk,
    setPageAsBoundary,
    useOcr,
    parsePdfTablesWithOcr,
    incrementalSync,
  } = carbonProps;

  const chunkSizeValue =
    processedIntegration?.chunkSize || chunkSize || DEFAULT_CHUNK_SIZE;
  const overlapSizeValue =
    processedIntegration?.overlapSize || overlapSize || DEFAULT_OVERLAP_SIZE;
  const skipEmbeddingGeneration =
    processedIntegration?.skipEmbeddingGeneration || false;
  const embeddingModelValue = embeddingModel || null;
  const generateSparseVectorsValue =
    processedIntegration?.generateSparseVectors ||
    generateSparseVectors ||
    false;
  const prependFilenameToChunksValue =
    processedIntegration?.prependFilenameToChunks ||
    prependFilenameToChunks ||
    false;
  const syncFilesOnConnection =
    processedIntegration?.syncFilesOnConnection ?? SYNC_FILES_ON_CONNECT;
  const syncSourceItems =
    processedIntegration?.syncSourceItems ?? SYNC_SOURCE_ITEMS;
  const fileSyncConfigValue =
    processedIntegration?.fileSyncConfig || fileSyncConfig || {};
  const maxItemsPerChunkValue =
    processedIntegration?.maxItemsPerChunk || maxItemsPerChunk || null;
  const setPageAsBoundaryValue =
    processedIntegration?.setPageAsBoundary || setPageAsBoundary || false;
  const useOcrValue = processedIntegration?.useOcr || useOcr || false;
  const parsePdfTablesWithOcrValue =
    processedIntegration?.parsePdfTablesWithOcr ||
    parsePdfTablesWithOcr ||
    false;
  const incrementalSyncValue =
    processedIntegration?.incrementalSync || incrementalSync || false;

  return {
    ...additionalProps,
    tags: tags,
    chunk_size: chunkSizeValue,
    chunk_overlap: overlapSizeValue,
    skip_embedding_generation: skipEmbeddingGeneration,
    embedding_model: embeddingModelValue,
    generate_sparse_vectors: generateSparseVectorsValue,
    prepend_filename_to_chunks: prependFilenameToChunksValue,
    sync_files_on_connection: syncFilesOnConnection,
    ...(requestId && { request_id: requestId }),
    sync_source_items: syncSourceItems,
    file_sync_config: fileSyncConfigValue,
    ...(maxItemsPerChunkValue && {
      max_items_per_chunk: maxItemsPerChunkValue,
    }),
    set_page_as_boundary: setPageAsBoundaryValue,
    use_ocr: useOcrValue,
    parse_pdf_tables_with_ocr: parsePdfTablesWithOcrValue,
    incremental_sync: incrementalSyncValue,
  };
};

export const getFileItemType = (item: UserFileApi) => {
  let isFolder = false;
  const fileType = item.file_metadata?.type;
  // for now only folder type data sources are considered
  if (item.file_metadata?.is_folder) isFolder = true;
  // if (item.file_metadata?.is_shortcut) isFolder = true;
  // if (item.file_metadata?.bucket) isFolder = true;
  // if (item.file_metadata?.is_query) isFolder = true;
  // if (item.file_metadata?.is_feed_url) isFolder = true;
  // if (item.file_metadata?.is_thread) isFolder = true;
  // if (fileType && ["SPACE", "DIRECTORY", "HELP_CENTER"].indexOf(fileType) != -1)
  //   isFolder = true;
  if (isFolder) {
    return "FOLDER";
  } else {
    return "FILE";
  }
};

export const getSourceItemType = (item: UserSourceItemApi) => {
  if (item.is_expandable) return "FOLDER";
  return "FILE";
};

export const formatDate = (data: Date) => {
  const dateString = new Date(data).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  const timeString = new Date(data).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    // second: '2-digit',
    hour12: true,
  });
  return `${dateString} ${timeString}`;
};

export function getDataSourceDomain(dataSource: IntegrationAPIResponse) {
  const extId = dataSource.data_source_external_id;
  const type = dataSource.data_source_type;

  if (!extId) return null;

  const parts = extId.split("|");

  if (
    type == IntegrationName.SALESFORCE ||
    type == IntegrationName.ZENDESK ||
    type == IntegrationName.SHAREPOINT
  ) {
    if (parts.length == 3) return parts[2];
    else return null;
  }

  if (type == "CONFLUENCE") {
    const workspace = parts[2];
    const workspaceParts = workspace.split("/");
    if (workspaceParts.length == 2) return workspaceParts[1];
    return null;
  }
}

export const findModifications = (
  newIntegrations: IntegrationAPIResponse[],
  oldIntegrations: IntegrationAPIResponse[],
  requestIdsRef: any
) => {
  const response = [];
  try {
    for (let i = 0; i < newIntegrations.length; i++) {
      const newIntegration = newIntegrations[i];
      const requestId = requestIdsRef.current
        ? requestIdsRef.current[newIntegration.data_source_type] || null
        : null;

      const oldIntegration = oldIntegrations.find(
        (oldIntegration) => oldIntegration.id === newIntegration.id
      );
      if (!oldIntegration) {
        const onSuccessObject = {
          status: 200,
          integration: newIntegration.data_source_type,
          action: ActionType.ADD,
          event: ActionType.ADD,
          data: {
            data_source_external_id: newIntegration.data_source_external_id,
            sync_status: newIntegration.sync_status,
            request_id: requestId,
          },
        };

        response.push(onSuccessObject);
      } else if (
        oldIntegration?.last_synced_at !== newIntegration?.last_synced_at &&
        newIntegration?.last_sync_action === "CANCEL"
      ) {
        const onSuccessObject = {
          status: 200,
          integration: newIntegration.data_source_type,
          action: ActionType.CANCEL,
          event: ActionType.CANCEL,
          data: {
            data_source_external_id: newIntegration.data_source_external_id,
            sync_status: newIntegration.sync_status,
          },
        };
        response.push(onSuccessObject);
      } else if (
        oldIntegration?.last_synced_at !== newIntegration?.last_synced_at &&
        newIntegration?.last_sync_action === "UPDATE"
      ) {
        const requestId = requestIdsRef.current
          ? requestIdsRef.current[newIntegration.data_source_type] || null
          : null;
        const filesSynced =
          oldIntegration?.files_synced_at !== newIntegration?.files_synced_at;
        const onSuccessObject = {
          status: 200,
          integration: newIntegration.data_source_type,
          action: ActionType.UPDATE,
          event: ActionType.UPDATE,
          data: {
            data_source_external_id: newIntegration.data_source_external_id,
            sync_status: newIntegration.sync_status,
            request_id: requestId,
            files_synced: filesSynced,
          },
        };
        response.push(onSuccessObject);
      }
    }

    return response;
  } catch (error) {
    console.error(error);
    return response;
  }
};

export const pluralize = (str: string, value: number) => {
  if (value == 0 || value > 1) {
    return str + "s";
  }
  return str;
};

export const isValidHttpUrl = (string: string) => {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
};

export const removeHttp = (string: string) => {
  return string.replace("https://", "").replace("http://", "");
};

export const truncateString = (str: string, n: number) => {
  if (str.length > n) {
    return str.substring(0, n) + "...";
  } else {
    return str;
  }
};

export const getIntegrationDisclaimer = (
  processedIntegration: ProcessedIntegration,
  whitelabelingData: any,
  orgName: string
) => {
  const removeBranding = whitelabelingData?.remove_branding;
  return `By connecting to ${processedIntegration.name}, you are providing us
  with access to your ${processedIntegration.name} account. We will use
  this access to import your data ${
    removeBranding && orgName ? `into ${orgName}` : "into Carbon"
  }. We will not modify your
  data in any way.`;
};

export const getIntegrationName = (integration: ProcessedIntegration) => {
  let name = integration.integrationsListViewTitle || integration.name;
  if (integration.id == IntegrationName.S3) {
    if (integration.enableDigitalOcean) {
      return integration.name + "/DigitalOcean";
    }
  }
  return name;
};

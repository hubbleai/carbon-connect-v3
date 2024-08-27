import React, { ReactNode, useEffect, useState } from "react";
import IntegrationModal from "./components/IntegrationModal";

import "./styles.css";

import { CarbonProvider } from "./context/CarbonContext";
import { BASE_URL, ENV } from "./constants/shared";
import { IntegrationItemType } from "./utils/integrationModalconstants";
import { TEST_PROPS } from "./constants/testProps";

const CarbonConnect: React.FC<CarbonConnectProps> = (props) => {
  // for local testing
  // const finalProps = props.environment != ENV.PRODUCTION ? TEST_PROPS : props;
  const finalProps = props;

  useEffect(() => {
    if (!finalProps.theme) {
      const newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      document.querySelector("html")?.setAttribute("data-mode", newTheme);
      return;
    }
    const newMode = finalProps.theme === "dark" ? "dark" : "light";
    document.querySelector("html")?.setAttribute("data-mode", newMode);

  }, [finalProps.theme]);

  return (
    <>
      <CarbonProvider {...finalProps}>
        <IntegrationModal>{finalProps.children}</IntegrationModal>
      </CarbonProvider>
    </>
  );
};

export { CarbonConnect };

// NOTE - DON'T IMPORT THESE TYPES FROM HERE. THEY WERE ADDED TO FIX THE PACKAGE NOT EXPORTING TYPES
export enum SyncStatus {
  READY = "READY",
  QUEUED_FOR_SYNC = "QUEUED_FOR_SYNC",
  SYNCING = "SYNCING",
  SYNC_ERROR = "SYNC_ERROR",
}

export enum ActionType {
  INITIATE = "INITIATE",
  ADD = "ADD",
  UPDATE = "UPDATE",
  CANCEL = "CANCEL",
  ERROR = "ERROR",
}

export type TagValue = string | number | boolean | string[] | number[];

export type WebScraper = {
  urls: string[];
  validUrls: string[];
  tags: string[];
};

export type LocalFile = {
  id: string;
  name: string;
  source: IntegrationName;
  external_file_id: string;
  tags: string[];
  sync_status: SyncStatus;
};

export type OnSuccessData = {
  status: number;
  data: {
    data_source_external_id?: string | null;
    sync_status?: string | null;
    files?: LocalFile[] | WebScraper[] | OnSuccessDataFileObject[] | null;
    request_id?: string | null;
    files_synced?: boolean;
  } | null;
  action: ActionType;
  event: ActionType;
  integration?: IntegrationName;
};

export type OnErrorData = {
  status: number;
  action: ActionType;
  event: ActionType;
  integration: IntegrationName;
  // TODO: Need a more detailed type
  data?: object;
};

export type OnSuccessDataFileObject = {
  id: string;
  source: IntegrationName;
  organization_id: string;
  organization_supplied_user_id: string;
  organization_user_data_source_id: string;
  external_file_id: string;
  external_url: string;
  sync_status: SyncStatus;
  last_sync: string;
  tags: Record<string, TagValue> | null;
  // TODO: Need a more detailed type
  file_statistics: object;
  // TODO: Need a more detailed type
  file_metadata: object;
  chunk_size: number;
  chunk_overlap: number;
  name: string;
  enable_auto_sync: boolean;
  presigned_url: string;
  parsed_text_url: string;
  skip_embedding_generation: boolean;
  created_at: string;
  updated_at: string;
  action: ActionType;
};

export type FileType = {
  extension: string;
  chunkSize?: number;
  overlapSize?: number;
  skipEmbeddingGeneration?: boolean;
  setPageAsBoundary?: boolean;
  useOcr?: boolean;
  generateSparseVectors?: boolean;
  parsePdfTablesWithOcr?: boolean;
  splitRows?: boolean;
  transcriptionService?: TranscriptionService;
  includeSpeakerLabels?: boolean;
};

export type FileSyncConfig = {
  auto_synced_source_types?: AutoSyncedSourceTypes[];
  sync_attachments?: boolean;
  detect_audio_language?: boolean;
  split_rows?: boolean;
  transcription_service?: TranscriptionService;
  include_speaker_labels?: boolean;
};

export type BaseIntegration = {
  id: IntegrationName;
  chunkSize?: number;
  overlapSize?: number;
  skipEmbeddingGeneration?: boolean;
  enableAutoSync?: boolean;
  generateSparseVectors?: boolean;
  prependFilenameToChunks?: boolean;
  maxItemsPerChunk?: number;
  syncFilesOnConnection?: boolean;
  syncSourceItems?: boolean;
  setPageAsBoundary?: boolean;
  useOcr?: boolean;
  parsePdfTablesWithOcr?: boolean;
  sendDeletionWebhooks?: boolean;
  fileSyncConfig?: FileSyncConfig;
  useCarbonFilePicker?: boolean;
  filesTabColumns?: FileTabColumns[];
  incrementalSync?: boolean;
  enableDigitalOcean?: boolean;
  showFilesTab?: boolean;
};

export type LocalFilesIntegration = BaseIntegration & {
  maxFileSize: number;
  maxFilesCount?: number;
  allowedFileTypes?: FileType[];
  splitRows?: boolean;
  transcriptionService?: TranscriptionService;
  includeSpeakerLabels?: boolean;
};

export interface WebScraperIntegration extends BaseIntegration {
  recursionDepth?: number;
  maxPagesToScrape?: number;
  htmlTagsToSkip?: string[];
  cssClassesToSkip?: string[];
  cssSelectorsToSkip?: string[];
  sitemapEnabled?: boolean;
}

export type Integration =
  | LocalFilesIntegration
  | WebScraperIntegration
  | BaseIntegration;

export type FileTabColumns = "name" | "status" | "created_at" | "external_url";

export type CarbonConnectProps = {
  orgName: string;
  brandIcon: string;
  loadingIconColor?: string;
  children?: ReactNode;
  tokenFetcher?: () => Promise<{ access_token: string }>;
  onSuccess?: (data: OnSuccessData) => void;
  onError?: (data: OnErrorData) => void;
  tags?: Record<string, TagValue>;
  maxFileSize?: number;
  environment?: keyof typeof BASE_URL;
  entryPoint?: IntegrationName | "INTEGRATION_LIST";
  enabledIntegrations?: Integration[];
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>> | null;
  chunkSize?: number;
  overlapSize?: number;
  tosURL?: string;
  privacyPolicyURL?: string;
  alwaysOpen?: boolean;
  navigateBackURL?: string | null;
  backButtonText?: string;
  zIndex?: number;

  embeddingModel?: EmbeddingGenerators;
  generateSparseVectors?: boolean;
  prependFilenameToChunks?: boolean;
  maxItemsPerChunk?: number;
  setPageAsBoundary?: boolean;
  useRequestIds?: boolean;
  useOcr?: boolean;
  parsePdfTablesWithOcr?: boolean;
  sendDeletionWebhooks?: boolean;
  fileSyncConfig?: FileSyncConfig;
  theme?: "dark" | "light";
  filesTabColumns?: FileTabColumns[];
  incrementalSync?: boolean;
  showFilesTab?: boolean;
  dataSourcePollingInterval?: number;
  openFilesTabTo?: "FILE_PICKER" | "FILES_LIST";
};

export enum AutoSyncedSourceTypes {
  ARTICLE = "ARTICLE",
  TICKET = "TICKET",
}

export enum EmbeddingGenerators {
  OPENAI = "OPENAI",
  AZURE_OPENAI = "AZURE_OPENAI",
  AZURE_ADA_LARGE_256 = "AZURE_ADA_LARGE_256",
  AZURE_ADA_LARGE_1024 = "AZURE_ADA_LARGE_1024",
  AZURE_ADA_LARGE_3072 = "AZURE_ADA_LARGE_3072",
  AZURE_ADA_SMALL_512 = "AZURE_ADA_SMALL_512",
  AZURE_ADA_SMALL_1536 = "AZURE_ADA_SMALL_1536",
  COHERE_MULTILINGUAL_V3 = "COHERE_MULTILINGUAL_V3",
  VERTEX_MULTIMODAL = "VERTEX_MULTIMODAL",
  OPENAI_ADA_LARGE_256 = "OPENAI_ADA_LARGE_256",
  OPENAI_ADA_LARGE_1024 = "OPENAI_ADA_LARGE_1024",
  OPENAI_ADA_LARGE_3072 = "OPENAI_ADA_LARGE_3072",
  OPENAI_ADA_SMALL_512 = "OPENAI_ADA_SMALL_512",
  OPENAI_ADA_SMALL_1536 = "OPENAI_ADA_SMALL_1536",
}

export enum IntegrationName {
  LOCAL_FILES = "LOCAL_FILES",
  NOTION = "NOTION",
  WEB_SCRAPER = "WEB_SCRAPER",
  GOOGLE_DRIVE = "GOOGLE_DRIVE",
  INTERCOM = "INTERCOM",
  DROPBOX = "DROPBOX",
  ONEDRIVE = "ONEDRIVE",
  BOX = "BOX",
  ZENDESK = "ZENDESK",
  SHAREPOINT = "SHAREPOINT",
  ZOTERO = "ZOTERO",
  CONFLUENCE = "CONFLUENCE",
  S3 = "S3",
  GMAIL = "GMAIL",
  FRESHDESK = "FRESHDESK",
  GITBOOK = "GITBOOK",
  OUTLOOK = "OUTLOOK",
  SALESFORCE = "SALESFORCE",
  GITHUB = "GITHUB",
  SLACK = "SLACK",
  GOOGLE_CLOUD_STORAGE = "GOOGLE_CLOUD_STORAGE",
}

export enum TranscriptionService {
  ASSEMBLYAI = "assemblyai",
  DEEPGRAM = "deepgram",
}

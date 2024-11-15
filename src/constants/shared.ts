import { FileTabColumns, IntegrationName } from "../typing/shared";

export enum ENV {
  PRODUCTION = "PRODUCTION",
  DEVELOPMENT = "DEVELOPMENT",
  LOCAL = "LOCAL",
}

export const BASE_URL = {
  [ENV.PRODUCTION]: "https://api.carbon.ai",
  [ENV.DEVELOPMENT]: "https://api.dev.carbon.ai",
  [ENV.LOCAL]: "http://localhost:8000",
};

export const onSuccessEvents = {
  ADD: "ADD",
  CANCEL: "CANCEL",
  ERROR: "ERROR",
  INITIATE: "INITIATE",
  REMOVE: "REMOVE",
  UPDATE: "UPDATE",
};

export const SYNC_FILES_ON_CONNECT = true;

export const SYNC_SOURCE_ITEMS = true;

export const TWO_STEP_CONNECTORS = [
  IntegrationName.ZENDESK,
  IntegrationName.SHAREPOINT,
  IntegrationName.CONFLUENCE,
  IntegrationName.SALESFORCE,
  IntegrationName.S3,
  IntegrationName.FRESHDESK,
  IntegrationName.GITBOOK,
  IntegrationName.GITHUB,
  IntegrationName.GURU,
  IntegrationName.SERVICENOW,
  IntegrationName.AZURE_BLOB_STORAGE,
  IntegrationName.DOCUMENT360,
];

export const THIRD_PARTY_CONNECTORS = [
  IntegrationName.BOX,
  IntegrationName.CONFLUENCE,
  IntegrationName.DROPBOX,
  IntegrationName.GOOGLE_DRIVE,
  IntegrationName.INTERCOM,
  IntegrationName.NOTION,
  IntegrationName.ONEDRIVE,
  IntegrationName.SHAREPOINT,
  IntegrationName.ZENDESK,
  IntegrationName.ZOTERO,
  IntegrationName.FRESHDESK,
  IntegrationName.GITBOOK,
  IntegrationName.GMAIL,
  IntegrationName.OUTLOOK,
  IntegrationName.SALESFORCE,
  IntegrationName.S3,
  IntegrationName.GITHUB,
  IntegrationName.GOOGLE_CLOUD_STORAGE,
  IntegrationName.GURU,
  IntegrationName.SERVICENOW,
  IntegrationName.AZURE_BLOB_STORAGE,
  IntegrationName.DOCUMENT360,
];

// used to check if we need to generate sync/OAuth URL for syncing files
export const SYNC_URL_SUPPORTED_CONNECTORS = [
  IntegrationName.BOX,
  IntegrationName.DROPBOX,
  IntegrationName.GOOGLE_DRIVE,
  IntegrationName.INTERCOM,
  IntegrationName.NOTION,
  IntegrationName.ONEDRIVE,
  IntegrationName.SHAREPOINT,
  IntegrationName.ZENDESK,
  IntegrationName.ZOTERO,
  IntegrationName.CONFLUENCE,
  IntegrationName.SALESFORCE,
];

export const FILE_PICKER_SUPPORTED_CONNECTORS = [
  IntegrationName.BOX,
  IntegrationName.CONFLUENCE,
  IntegrationName.DROPBOX,
  IntegrationName.GOOGLE_DRIVE,
  IntegrationName.INTERCOM,
  IntegrationName.NOTION,
  IntegrationName.ONEDRIVE,
  IntegrationName.SHAREPOINT,
  IntegrationName.ZENDESK,
  IntegrationName.ZOTERO,
  IntegrationName.FRESHDESK,
  IntegrationName.GITBOOK,
  IntegrationName.SALESFORCE,
  IntegrationName.S3,
  IntegrationName.GITHUB,
  IntegrationName.GOOGLE_CLOUD_STORAGE,
  IntegrationName.GURU,
  IntegrationName.SERVICENOW,
  IntegrationName.AZURE_BLOB_STORAGE,
  IntegrationName.DOCUMENT360,
];

// note - this excludes RAW_TEXT
export const LOCAL_FILE_TYPES = [
  "TEXT",
  "CSV",
  "TSV",
  "PDF",
  "DOCX",
  "PPTX",
  "XLSX",
  "MD",
  "RTF",
  "JSON",
  "HTML",
  "JPG",
  "JPEG",
  "PNG",
  "MP3",
  "MP4",
  "MP2",
  "AAC",
  "WAV",
  "FLAC",
  "PCM",
  "M4A",
  "OGG",
  "OPUS",
  "WEBM",
];

export const DEFAULT_CHUNK_SIZE = 1500;

export const DEFAULT_OVERLAP_SIZE = 20;

export const MAX_PAGES_TO_SCRAPE = 100;

export const MAX_RECURSION_DEPTH = 10;

export const DEFAULT_RECURSION_DEPTH = 3;

export const ONE_MB = 1000000;
export const DEFAULT_SIZE_MB = 20;
export const DEFAULT_FILE_SIZE = DEFAULT_SIZE_MB * ONE_MB;

export const DEFAULT_MAX_FILES = 10;
export const MAX_FILES_LIMIT = 50;

export const FOLDER_BASED_CONNECTORS = [
  IntegrationName.BOX,
  IntegrationName.DROPBOX,
  IntegrationName.ONEDRIVE,
  IntegrationName.GOOGLE_DRIVE,
  IntegrationName.SHAREPOINT,
];

export const DEFAULT_FILES_TAB_COLUMNS: FileTabColumns[] = [
  "name",
  "status",
  "created_at",
  // 'external_url'
];

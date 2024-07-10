import {
  IntegrationName,
  EmbeddingGenerators,
  CarbonConnectProps,
  AutoSyncedSourceTypes,
} from "../typing/shared";
import { ENV } from "./shared";

const tokenFetcher = async () => {
  const response = await fetch(
    "https://api.dev.carbon.ai/auth/v1/access_token",
    {
      method: "GET",
      headers: {
        "customer-id": "id",
        authorization: "auth",
      },
    }
  );
  if (response.status == 200) {
    const data = await response.json();
    return {
      access_token: data.access_token,
    };
  } else {
    return { access_token: "" };
  }
};

export const TEST_PROPS: CarbonConnectProps = {
  orgName: "Wikemedia",
  brandIcon:
    "https://upload.wikimedia.org/wikipedia/commons/5/53/Wikimedia-logo.png",
  tokenFetcher: tokenFetcher,
  environment: ENV.DEVELOPMENT,
  tags: {
    appType: "chatbot",
    appVersion: "1.1.1",
    appDescription: "Chatbot for Rubber",
    // appId: '378476476985508433',
  },
  maxFileSize: 10000000,
  // maxItemsPerChunk={1}
  embeddingModel: EmbeddingGenerators.OPENAI_ADA_LARGE_1024,
  generateSparseVectors: false,
  prependFilenameToChunks: false,
  maxItemsPerChunk: 1,
  entryPoint: "INTEGRATION_LIST",
  setPageAsBoundary: false,
  useRequestIds: true,
  parsePdfTablesWithOcr: false,
  // primaryTextColor="black"
  sendDeletionWebhooks: true,
  // fileSyncConfig={{
  //   auto_synced_data_sources: [AutoSyncedSourceTypes.ARTICLE]
  // }}
  enabledIntegrations: [
    {
      id: IntegrationName.BOX,
    },
    {
      id: IntegrationName.CONFLUENCE,
      syncFilesOnConnection: true,
      useCarbonFilePicker: true,
    },
    {
      id: IntegrationName.DROPBOX,
      setPageAsBoundary: true,
    },
    {
      id: IntegrationName.GOOGLE_DRIVE,
      useOcr: true,
      fileSyncConfig: {
        detect_audio_language: true,
        split_rows: true,
      },
      useCarbonFilePicker: true,
    },
    {
      id: IntegrationName.INTERCOM,
      syncFilesOnConnection: true,
      fileSyncConfig: {
        auto_synced_source_types: [AutoSyncedSourceTypes.TICKET],
      },
      syncSourceItems: false,
    },
    {
      id: IntegrationName.LOCAL_FILES,
      chunkSize: 400,
      overlapSize: 20,
      // maxFileSize: 1000000000,
      maxFilesCount: 1000,
      skipEmbeddingGeneration: false,
      prependFilenameToChunks: true,
      generateSparseVectors: false,
      maxItemsPerChunk: 2,
      setPageAsBoundary: true,
      sendDeletionWebhooks: true,
      // allowedFileTypes: [
      //   {
      //     extension: "csv",
      //     skipEmbeddingGeneration: true,
      //   },
      //   {
      //     extension: "txt",
      //   },
      //   {
      //     extension: "pdf",
      //     useOcr: true,
      //   },
      //   {
      //     extension: "HTML",
      //   },
      // ],
    },
    {
      id: IntegrationName.NOTION,
    },
    {
      id: IntegrationName.ONEDRIVE,
    },
    {
      id: IntegrationName.SHAREPOINT,
    },
    {
      id: IntegrationName.WEB_SCRAPER,
      // enableAutoSync: true,
      chunkSize: 1100,
      recursionDepth: 10,
      maxPagesToScrape: 500,
      // embeddingModel: "COHERE_MULTILINGUAL_V3",
      // cssClassesToSkip: ["some"],
      // htmlTagsToSkip: ["script"],
      generateSparseVectors: false,
      // sitemapEnabled: false,
    },
    {
      id: IntegrationName.ZENDESK,
      syncFilesOnConnection: true,
    },
    {
      id: IntegrationName.ZOTERO,
    },
    {
      id: IntegrationName.FRESHDESK,
      syncFilesOnConnection: true,
    },
    {
      id: IntegrationName.GITBOOK,
      syncFilesOnConnection: true,
      syncSourceItems: false,
    },
    {
      id: IntegrationName.GITHUB,
      syncFilesOnConnection: false,
      skipEmbeddingGeneration: false,
    },
    {
      id: IntegrationName.SALESFORCE,
      syncFilesOnConnection: false,
      setPageAsBoundary: true,
      useCarbonFilePicker: true,
    },
    {
      id: IntegrationName.GMAIL,
      syncFilesOnConnection: false,
      useCarbonFilePicker: true,
    },
    {
      id: IntegrationName.OUTLOOK,
      syncFilesOnConnection: false,
    },
    {
      id: IntegrationName.S3,
      syncFilesOnConnection: false,
    },
    {
      id: IntegrationName.SLACK,
    },
  ],
  onSuccess: (data: any) => {
    console.log("Data on Success: ", data);
  },
  onError: (error: any) => {
    console.log("Data on Error: ", error);
  },
  // navigateBackURL: "https://carbon.ai",
  open: true,
  // theme: "dark",
};

import React, { createContext, useContext, useState, useEffect } from "react";

import { BASE_URL, ENV } from "../constants/shared";
import {
  ActiveStep,
  ProcessedIntegration,
  IntegrationName,
  EmbeddingGenerators,
  CarbonConnectProps,
} from "../typing/shared";
import { INTEGRATIONS_LIST } from "../utils/integrationModalconstants";

type CarbonContextValues = CarbonConnectProps & {
  accessToken?: string | null;
  authenticatedFetch?: any;
  fetchTokens?: any;
  processedIntegrations?: ProcessedIntegration[];
  setRequestIds?: any;
  requestIds?: object;
  whiteLabelingData?: any;
  entryPointIntegrationObject?: ProcessedIntegration | null;
  loading?: boolean;
  manageModalOpenState?: any;
  activeStep?: ActiveStep;
  setActiveStep?: any;
  showModal?: boolean;
};

const CarbonContext: React.Context<CarbonContextValues> = createContext({
  orgName: "",
  brandIcon: "",
});

export const CarbonProvider = ({
  orgName,
  brandIcon,
  children,
  tokenFetcher,
  onSuccess = () => {},
  onError = () => {},
  tags = {},
  maxFileSize = 20000000,
  environment = ENV.PRODUCTION,
  entryPoint,
  enabledIntegrations = [
    {
      id: IntegrationName.LOCAL_FILES,
      chunkSize: 100,
      overlapSize: 10,
      maxFileSize: 20000000,
      skipEmbeddingGeneration: false,
      setPageAsBoundary: false,
      sendDeletionWebhooks: false,
      allowedFileTypes: [
        {
          extension: "csv",
        },
        {
          extension: "txt",
        },
        {
          extension: "pdf",
        },
      ],
    },
  ],
  open = false,
  setOpen = null,
  chunkSize = 1500,
  overlapSize = 20,
  tosURL = "https://carbon.ai/terms",
  privacyPolicyURL = "https://carbon.ai/privacy",
  alwaysOpen = false,
  navigateBackURL = null,
  backButtonText = "Go Back",
  zIndex = 1000,
  embeddingModel = EmbeddingGenerators.OPENAI,
  generateSparseVectors = false,
  prependFilenameToChunks = false,
  maxItemsPerChunk,
  setPageAsBoundary = false,
  useRequestIds = false,
  useOcr = false,
  parsePdfTablesWithOcr = false,
  sendDeletionWebhooks = false,
  fileSyncConfig = {},
  incrementalSync = false,
  showFilesTab = true,
}: CarbonConnectProps) => {
  const [showModal, setShowModal] = useState(open);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [processedIntegrations, setProcessedIntegrations] = useState<
    ProcessedIntegration[]
  >([]);
  const [entryPointIntegrationObject, setEntryPointIntegrationObject] =
    useState<ProcessedIntegration | null>(null);
  const [whiteLabelingData, setWhiteLabelingData] = useState(null);

  const [requestIds, setRequestIds] = useState({});

  const manageModalOpenState = (modalOpenState: boolean) => {
    if (alwaysOpen) return;
    // if (!modalOpenState) {
    //   if (entryPoint === "LOCAL_FILES" || entryPoint === "WEB_SCRAPER")
    //     setActiveStep(entryPoint);
    //   else setActiveStep("CONNECT");
    // }
    if (setOpen) setOpen(modalOpenState);
    setShowModal(modalOpenState);
  };

  const authenticatedFetch = async (
    url: string,
    options: any = {},
    retry = true
  ): Promise<Response | undefined> => {
    try {
      const response = await fetch(url, {
        body: options.body,
        method: options.method,
        headers: options.headers,
      });

      if (response.status === 401 && retry && tokenFetcher) {
        const response = await tokenFetcher();
        setAccessToken(response?.access_token || null);

        const newOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Token ${response.access_token}`,
          },
        };

        return await authenticatedFetch(url, newOptions, false); // Passing 'false' to avoid endless loop in case refreshing the token doesn't help
      }

      return response;
    } catch (err) {
      console.error(
        `[CarbonContext.js] Error in authenticatedFetch [${url}]: `,
        err
      );
    }
  };

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const response = tokenFetcher && (await tokenFetcher());
      setAccessToken(response?.access_token || null);

      const whiteLabelingResponse = await authenticatedFetch(
        `${BASE_URL[environment]}/auth/v1/white_labeling`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Token ${response?.access_token || null}`,
          },
        }
      );
      const whiteLabelingResponseData = await whiteLabelingResponse?.json();
      setWhiteLabelingData(whiteLabelingResponseData);
    } catch (err) {
      setError(true);
      console.error("[CarbonContext.js] Error in fetchTokens: ", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    let tempIntegrations = [];
    // merge the integration data like logos etc with the options provided as props
    for (let i = 0; i < INTEGRATIONS_LIST.length; i++) {
      const integration = INTEGRATIONS_LIST[i];
      const integrationOptions = enabledIntegrations?.find(
        (enabledIntegration) =>
          enabledIntegration.id === integration.id && integration.active
      );
      if (!integrationOptions) continue;
      tempIntegrations.push({ ...integrationOptions, ...integration });
    }
    setProcessedIntegrations(tempIntegrations);

    if (entryPoint && entryPoint !== "INTEGRATION_LIST") {
      const obj = tempIntegrations.find(
        (integration) => integration.id === entryPoint
      );
      if (!obj) {
        const isIntegrationAvailable = INTEGRATIONS_LIST.find(
          (integration) => integration.id === entryPoint
        );
        if (isIntegrationAvailable)
          console.error(
            "Invalid entry point. Make sure that the integrations is enabled through enabledIntegrations prop."
          );
        else
          console.error(
            "Invalid entry point. Make sure that right integration id is passed."
          );
      }

      setEntryPointIntegrationObject(obj || null);
    }
  }, []);

  useEffect(() => {
    setShowModal(open);
  }, [open]);

  const contextValues = {
    accessToken,
    setAccessToken,
    fetchTokens,
    authenticatedFetch,
    enabledIntegrations,
    orgName,
    brandIcon,
    environment,
    entryPoint,
    tags,
    maxFileSize,
    onSuccess,
    onError,
    chunkSize,
    overlapSize,
    processedIntegrations,
    entryPointIntegrationObject,
    whiteLabelingData,
    tosURL,
    privacyPolicyURL,
    open,
    setOpen,
    showModal,
    setShowModal,
    alwaysOpen,
    navigateBackURL,
    manageModalOpenState,
    backButtonText,
    zIndex,
    embeddingModel,
    generateSparseVectors,
    prependFilenameToChunks,
    maxItemsPerChunk,
    setPageAsBoundary,
    setRequestIds,
    requestIds,
    useRequestIds,
    useOcr,
    parsePdfTablesWithOcr,
    loading,
    sendDeletionWebhooks,
    fileSyncConfig,
    incrementalSync,
    showFilesTab,
  };

  return (
    <CarbonContext.Provider value={contextValues}>
      {children}
    </CarbonContext.Provider>
  );
};

export const useCarbon = () => {
  const context = useContext(CarbonContext);
  if (context === undefined) {
    throw new Error("useCarbon must be used within CarbonProvider");
  }
  return context;
};

export default CarbonContext;

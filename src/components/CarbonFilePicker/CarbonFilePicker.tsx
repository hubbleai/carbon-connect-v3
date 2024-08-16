import React, { useEffect, useState } from "react";
import {
  DialogHeader,
  DialogTitle,
} from "@components/common/design-system/Dialog";
import BackIcon from "@assets/svgIcons/back-icon.svg";
import RefreshIcon from "@assets/svgIcons/refresh-icon.svg";
import { Button } from "@components/common/design-system/Button";
import { IntegrationItemType } from "@utils/integrationModalconstants";
import SettingsDropdown from "@components/common/SettingsDropdown";
import AccountDropdown from "@components/common/AccountDropdown";
import { IntegrationAPIResponse } from "../IntegrationModal";
import UserPlus from "@assets/svgIcons/user-plus.svg";
import AddCircleIconWhite from "@assets/svgIcons/add-circle-icon-white.svg";
import { useTheme } from "next-themes";
import {
  BASE_URL,
  ENV,
  FILE_PICKER_SUPPORTED_CONNECTORS,
  SYNC_URL_SUPPORTED_CONNECTORS,
  TWO_STEP_CONNECTORS,
} from "../../constants/shared";
import {
  ActiveStep,
  IntegrationName,
  ProcessedIntegration,
  ActionType,
} from "../../typing/shared";
import { useCarbon } from "../../context/CarbonContext";
import {
  generateRequestId,
  getConnectRequestProps,
  getDataSourceDomain,
  getIntegrationName,
} from "../../utils/helper-functions";
import FreshdeskScreen from "../Screens/FreshdeskScreen";

import SourceItemsList from "./SourceItemsList";
import SyncedFilesList from "./SyncedFilesList";
import Banner, { BannerState } from "../common/Banner";
import SalesforceScreen from "../Screens/SalesforceScreen";
import GitbookScreen from "../Screens/GitbookScreen";
import ConfluenceScreen from "../Screens/ConfluenceScreen";
import S3Screen from "../Screens/S3Screen";
import ZendeskScreen from "../Screens/ZendeskScreen";
import SharepointScreen from "../Screens/SharepointScreen";
import GithubScreen from "../Screens/GithubScreen";
import AccountManagement from "@components/common/AccountManagement";
import SlackScreen from "../Screens/SlackScreen";

export enum SyncingModes {
  FILE_PICKER = "FILE_PICKER",
  SYNC_URL = "SYNC_URL",
  UPLOAD = "UPLOAD",
  CUSTOM = "CUSTOM",
}

export default function CarbonFilePicker({
  activeStepData,
  setActiveStep,
  onCloseModal,
  activeIntegrations,
}: {
  activeStepData?: IntegrationItemType;
  setActiveStep: React.Dispatch<React.SetStateAction<ActiveStep>>;
  onCloseModal: () => void;
  activeIntegrations: IntegrationAPIResponse[];
}) {
  const carbonProps = useCarbon();
  const {
    accessToken,
    processedIntegrations,
    useRequestIds,
    setRequestIds,
    requestIds,
    authenticatedFetch,
    environment = ENV.PRODUCTION,
    entryPoint,
    onSuccess,
    showFilesTab,
    openFilesTabTo,
  } = carbonProps;

  const integrationName = activeStepData?.id;
  const [isUploading, setIsUploading] = useState<{
    state: boolean;
    percentage: number;
  }>({ state: false, percentage: 0 });
  const [connectedDataSources, setConnectedDataSources] = useState<
    IntegrationAPIResponse[]
  >([]);
  const [selectedDataSource, setSelectedDataSource] =
    useState<IntegrationAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processedIntegration, setProcessedIntegration] =
    useState<ProcessedIntegration | null>(null);
  const [showAdditionalStep, setShowAdditionalStep] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [isRevokingDataSource, setIsRevokingDataSource] = useState(false);
  const [isResyncingDataSource, setIsResyncingDataSource] = useState(false);
  const [mode, setMode] = useState<SyncingModes | null>(null);
  const [bannerState, setBannerState] = useState<BannerState>({
    message: null,
  });
  const [pauseDataSourceSelection, setPauseDataSourceSelection] =
    useState(false);
  const [performingAction, setPerformingAction] = useState(false);
  const [startCustomSync, setStartCustomSync] = useState(false);

  const shouldShowFilesTab = processedIntegration?.showFilesTab ?? showFilesTab;

  const { systemTheme } = useTheme();

  // if user specified that they want to use file picker or if sync url is not supported
  useEffect(() => {
    if (!processedIntegration) return;
    if (
      FILE_PICKER_SUPPORTED_CONNECTORS.find((c) => c == integrationName) &&
      (processedIntegration?.useCarbonFilePicker ||
        !SYNC_URL_SUPPORTED_CONNECTORS.find((c) => c == integrationName))
    ) {
      setMode(SyncingModes.FILE_PICKER);
    } else if (
      SYNC_URL_SUPPORTED_CONNECTORS.find((c) => c == integrationName)
    ) {
      setMode(SyncingModes.SYNC_URL);
    } else if (integrationName == IntegrationName.SLACK) {
      setMode(SyncingModes.CUSTOM);
    }
  }, [processedIntegration]);

  useEffect(() => {
    setProcessedIntegration(
      processedIntegrations?.find(
        (integration) => integration.id === integrationName
      ) || null
    );
  }, [processedIntegrations]);

  useEffect(() => {
    const connected = activeIntegrations.filter(
      (integration) => integration.data_source_type === activeStepData?.id
    );
    const accountsAdded = connected.length > connectedDataSources.length;
    setConnectedDataSources(connected);

    if (pauseDataSourceSelection || !connected.length) {
      setIsLoading(false);
      return;
    }

    const currDataSource = connected.find(
      (c) => c.id == selectedDataSource?.id
    );

    if (
      (selectedDataSource === null && connected.length) ||
      currDataSource?.source_items_synced_at !==
        selectedDataSource?.source_items_synced_at ||
      currDataSource?.sync_status !== selectedDataSource?.sync_status ||
      accountsAdded
    ) {
      if (connected.length === 1) {
        setSelectedDataSource(connected[0]);
      } else {
        if (currDataSource && !accountsAdded) {
          setSelectedDataSource(currDataSource);
        } else {
          const sorted = connected.sort(
            (a, b) =>
              new Date(b.last_synced_at).getTime() -
              new Date(a.last_synced_at).getTime()
          );
          setSelectedDataSource(sorted[0]);
        }
      }
    }
    setIsLoading(false);
  }, [JSON.stringify(activeIntegrations), pauseDataSourceSelection]);

  // show file selector by default if
  useEffect(() => {
    if (!selectedDataSource || !mode) return;
    if (
      integrationName &&
      mode == SyncingModes.FILE_PICKER &&
      (openFilesTabTo == "FILE_PICKER" || !selectedDataSource.files_synced_at)
    ) {
      setShowFilePicker(true);
    } else {
      setShowFilePicker(false);
    }
  }, [selectedDataSource?.id, mode]);

  const sendOauthRequest = async (
    mode = "CONNECT",
    dataSourceId: number | null = null,
    extraParams = {}
  ) => {
    if (!processedIntegration) return;
    try {
      const oauthWindow = window.open("", "_blank");
      oauthWindow?.document.write("Loading...");

      let requestId = null;
      if (useRequestIds && processedIntegration) {
        requestId = generateRequestId(20);
        setRequestIds({
          ...requestIds,
          [processedIntegration?.data_source_type]: requestId,
        });
      }

      const requestObject = getConnectRequestProps(
        processedIntegration,
        requestId,
        {
          ...(dataSourceId && { data_source_id: dataSourceId }),
          ...extraParams,
          service: processedIntegration.data_source_type,
          connecting_new_account: mode == "CONNECT",
        },
        carbonProps
      );

      const oAuthURLResponse = await authenticatedFetch(
        `${BASE_URL[environment]}/integrations/oauth_url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Token ${accessToken}`,
          },
          body: JSON.stringify(requestObject),
        }
      );

      const oAuthURLResponseData = await oAuthURLResponse.json();

      if (oAuthURLResponse.status === 200) {
        // setFlag(service?.data_source_type, true);
        onSuccess &&
          onSuccess({
            status: 200,
            data: { request_id: requestId },
            integration: processedIntegration?.data_source_type,
            action: ActionType.INITIATE,
            event: ActionType.INITIATE,
          });
        if (oauthWindow)
          oauthWindow.location.href = oAuthURLResponseData.oauth_url;
      } else {
        if (oauthWindow)
          oauthWindow.document.body.innerHTML = oAuthURLResponseData.detail;
      }
    } catch (err) {
      console.error(
        "[ThirdPartyHome.js] Error in sending Oauth request: ",
        err
      );
    }
  };

  const handleAddAccountClick = async () => {
    if (!integrationName) return;
    if (TWO_STEP_CONNECTORS.indexOf(integrationName) !== -1) {
      setShowAdditionalStep(true);
      setSelectedDataSource(null);
    } else {
      setBannerState({
        message:
          "You will be redirected to the service to connect your account",
        type: "WARN",
      });
      await sendOauthRequest();
    }
  };

  const handleAccountChange = (id: number) => {
    const selectedAccount = connectedDataSources.find(
      (account) => account.id === id
    );

    setSelectedDataSource(selectedAccount || null);
  };

  const handleUploadFilesClick = () => {
    if (!selectedDataSource) return;
    if (mode == SyncingModes.SYNC_URL) {
      const dataSourceType = selectedDataSource.data_source_type;
      const extraParams: any = {};
      if (dataSourceType == IntegrationName.SALESFORCE) {
        extraParams.salesforce_domain = getDataSourceDomain(selectedDataSource);
      } else if (dataSourceType == IntegrationName.ZENDESK) {
        extraParams.zendesk_subdomain = getDataSourceDomain(selectedDataSource);
      } else if (dataSourceType == IntegrationName.CONFLUENCE) {
        extraParams.confluence_subdomain =
          getDataSourceDomain(selectedDataSource);
      } else if (dataSourceType == IntegrationName.SHAREPOINT) {
        const workspace = getDataSourceDomain(selectedDataSource) || "";
        const parts = workspace.split("/");
        if (parts.length == 2) {
          extraParams.microsoft_tenant = parts[0];
          extraParams.sharepoint_site_name = parts[1];
        }
      }
      sendOauthRequest("UPLOAD", selectedDataSource.id, extraParams);
    } else if (mode == SyncingModes.FILE_PICKER) {
      setShowFilePicker(!showFilePicker);
    } else if (mode == SyncingModes.CUSTOM) {
      setStartCustomSync(true);
    } else {
      setBannerState({
        type: "ERROR",
        message: "Unable to start a file sync",
      });
    }
  };

  const revokeDataSource = async (id?: number, bulk: boolean = false) => {
    !bulk && setIsRevokingDataSource(true);
    if (!selectedDataSource && !id) return;

    const revokeAccessResponse = await authenticatedFetch(
      `${BASE_URL[environment]}/revoke_access_token`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data_source_id: id || selectedDataSource?.id }),
      }
    );
    if (!bulk) {
      if (revokeAccessResponse.status === 200) {
        setBannerState({
          type: "SUCCESS",
          message: "Successfully disconnected account",
        });
        setSelectedDataSource(null);
        setActiveStep(entryPoint ? "CONNECT" : "INTEGRATION_LIST");
      } else {
        setBannerState({
          type: "ERROR",
          message: "Error disconnecting account",
        });
      }
    }

    !bulk && setIsRevokingDataSource(false);
    return revokeAccessResponse;
  };

  const resyncDataSource = async (id?: number, bulk: boolean = false) => {
    if (!selectedDataSource && !id) return;
    !bulk && setIsResyncingDataSource(true);
    const requestBody = {
      data_source_id: id || selectedDataSource?.id,
    };

    const resyncDataSourceResponse = await authenticatedFetch(
      `${BASE_URL[environment]}/integrations/items/sync`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!bulk) {
      if (resyncDataSourceResponse.status === 200) {
        setBannerState({
          type: "SUCCESS",
          message: "Your connection is being synced",
        });
      } else {
        setBannerState({
          type: "ERROR",
          message: "Error resyncing connection",
        });
      }
    }

    !bulk && setIsResyncingDataSource(false);
    return resyncDataSourceResponse;
  };

  const performBulkAction = (
    ids: number[],
    message: string,
    func: Function
  ) => {
    setPerformingAction(true);
    const promises: any = [];
    for (let id of ids) {
      promises.push(func(id, true));
    }
    Promise.all(promises).then(function (values) {
      let successCount = 0;
      let failedCount = 0;
      for (let value of values) {
        if (value.status == 200) {
          successCount += 1;
        } else {
          failedCount += 1;
        }
      }
      const state = failedCount > 0 ? "ERROR" : "SUCCESS";
      setBannerState({
        message: message,
        type: state,
        additionalInfo: `${successCount} succeeded, ${failedCount} failed`,
      });
    });
    setPerformingAction(false);
  };

  if (isUploading.state) {
    return (
      <div className="cc-h-[560px] cc-flex-grow cc-flex cc-flex-col cc-items-center cc-justify-center">
        <div className="cc-relative cc-h-14 cc-w-14 cc-rounded-full cc-bg-surface-surface_2 cc-mb-3 cc-p-1">
          <div
            className="cc-absolute cc-top-0 cc-left-0 cc-right-0 cc-bottom-0 cc-rounded-full cc-transform -cc-rotate-90 dark:cc-border-dark-input-bg"
            style={{
              background: `conic-gradient(#0BABFB 0% ${
                isUploading.percentage
              }%, ${systemTheme === "dark" ? "#FFFFFF33" : "transparent"}  ${
                isUploading.percentage
              }% 100%)`,
            }}
          />
          <div className="cc-h-full cc-relative cc-w-full cc-bg-white dark:cc-bg-dark-bg-black cc-rounded-full cc-flex cc-items-center cc-justify-center cc-z-10">
            <p className="cc-items-baseline cc-font-semibold cc-text-low_em cc-text-center cc-text-sm dark:cc-text-dark-text-gray">
              {isUploading.percentage}
              <span className="cc-text-xs">%</span>
            </p>
          </div>
        </div>
        <p className="cc-text-sm cc-text-center cc-font-semibold dark:cc-text-dark-text-white">
          Uploading 12 files...
        </p>
      </div>
    );
  }

  if (!processedIntegration) return null;

  if (startCustomSync) {
    if (integrationName == IntegrationName.SLACK) {
      return (
        <SlackScreen
          setActiveStep={setActiveStep}
          activeStepData={processedIntegration}
          screen="CHANNEL"
          setStartCustomSync={setStartCustomSync}
        />
      );
    }
  }

  return (
    <>
      <DialogHeader closeButtonClass="cc-hidden sm:cc-flex">
        <div className="cc-flex-grow cc-flex cc-gap-3 cc-items-center">
          <button
            className="cc-pr-1 cc-h-10 cc-w-auto cc-shrink-0 "
            onClick={() => {
              if (!entryPoint || entryPoint == "INTEGRATION_LIST")
                setActiveStep("INTEGRATION_LIST");
              else setActiveStep("CONNECT");
            }}
          >
            <img
              src={BackIcon}
              alt="Lock"
              className="cc-h-[18px] cc-w-[18px] dark:cc-invert-[1] dark:cc-hue-rotate-180"
            />
          </button>
          <div className=" dark:cc-bg-custom-gradient-dark cc-h-8 cc-w-8 sm:cc-h-14 sm:cc-w-14 cc-shrink-0 cc-bg-surface-white cc-rounded-lg cc-p-0.5 cc-shadow-e2">
            <div className="cc-h-full cc-w-full dark:cc-bg-[#0000007A] cc-bg-gray-50 cc-flex cc-items-center cc-justify-center cc-rounded-lg">
              <img
                src={activeStepData?.logo}
                alt="Github logo"
                className="cc-h-4 cc-w-4 sm:cc-h-8 sm:cc-w-8"
              />
            </div>
          </div>
          <DialogTitle
            justifyModification={false}
            className="cc-flex-grow cc-text-left "
          >
            {getIntegrationName(processedIntegration)}
          </DialogTitle>
          {/* {step > 1 && ( */}
          <>
            <Button
              size="sm"
              variant="gray"
              className="cc-rounded-xl cc-shrink-0 cc-hidden"
            >
              <img
                src={RefreshIcon}
                alt="User Plus"
                className="cc-h-[18px] md:cc-none cc-w-[18px] cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
              />
            </Button>
            {!showAdditionalStep &&
            connectedDataSources?.length &&
            shouldShowFilesTab ? (
              <>
                <AccountDropdown
                  dataSources={connectedDataSources}
                  selectedDataSource={selectedDataSource}
                  handleAddAccountClick={handleAddAccountClick}
                  handleAccountChange={handleAccountChange}
                />
                <SettingsDropdown
                  revokeDataSource={revokeDataSource}
                  isRevokingDataSource={isRevokingDataSource}
                  resyncDataSource={resyncDataSource}
                  isResyncingDataSource={isResyncingDataSource}
                  showSelectMorePages={
                    mode == SyncingModes.FILE_PICKER &&
                    integrationName == IntegrationName.NOTION
                  }
                  sendOauthRequest={sendOauthRequest}
                  dataSourceId={selectedDataSource?.id}
                />{" "}
              </>
            ) : null}
          </>
        </div>
      </DialogHeader>

      <Banner bannerState={bannerState} setBannerState={setBannerState} />
      {!isLoading &&
      connectedDataSources?.length === 0 &&
      !showAdditionalStep ? (
        <div className="cc-h-full cc-flex cc-flex-col cc-items-center cc-justify-center cc-p-4 sm:cc-h-[500px]">
          <div className="cc-p-2 cc-rounded-md dark:cc-bg-svg-background cc-bg-surface-surface_1 cc-inline-block cc-mb-3">
            <img
              src={UserPlus}
              alt="User Plus"
              className="cc-h-6 cc-w-6 dark:cc-invert-[1] dark:cc-hue-rotate-180"
            />
          </div>
          <div className=" dark:cc-text-dark-text-white cc-text-base cc-font-semibold cc-mb-6 cc-text-center cc-max-w-[206px]">
            No account connected, please connect an account
          </div>
          <Button
            onClick={() => handleAddAccountClick()}
            size="md"
            className="cc-px-6"
          >
            <img
              src={AddCircleIconWhite}
              alt="Add Circle Plus"
              className="cc-h-[18px] cc-w-[18px] cc-shrink-0 dark:cc-invert-initial dark:cc-hue-rotate-180"
            />
            Connect Account
          </Button>
        </div>
      ) : showAdditionalStep && processedIntegration ? (
        (integrationName == IntegrationName.FRESHDESK && (
          <FreshdeskScreen
            processedIntegration={processedIntegration}
            setShowAdditionalStep={setShowAdditionalStep}
          />
        )) ||
        (integrationName == IntegrationName.SALESFORCE && (
          <SalesforceScreen
            processedIntegration={processedIntegration}
            setShowAdditionalStep={setShowAdditionalStep}
          />
        )) ||
        (integrationName == IntegrationName.GITBOOK && (
          <GitbookScreen
            processedIntegration={processedIntegration}
            setShowAdditionalStep={setShowAdditionalStep}
          />
        )) ||
        (integrationName == IntegrationName.CONFLUENCE && (
          <ConfluenceScreen
            processedIntegration={processedIntegration}
            setShowAdditionalStep={setShowAdditionalStep}
          />
        )) ||
        (integrationName == IntegrationName.S3 && (
          <S3Screen
            processedIntegration={processedIntegration}
            setShowAdditionalStep={setShowAdditionalStep}
          />
        )) ||
        (integrationName == IntegrationName.ZENDESK && (
          <ZendeskScreen
            processedIntegration={processedIntegration}
            setShowAdditionalStep={setShowAdditionalStep}
          />
        )) ||
        (integrationName == IntegrationName.SHAREPOINT && (
          <SharepointScreen
            processedIntegration={processedIntegration}
            setShowAdditionalStep={setShowAdditionalStep}
          />
        )) ||
        (integrationName == IntegrationName.GITHUB && (
          <GithubScreen
            processedIntegration={processedIntegration}
            setActiveStep={setActiveStep}
            activeIntegrations={activeIntegrations}
            setShowFilePicker={setShowFilePicker}
            setShowAdditionalStep={setShowAdditionalStep}
            setSelectedDataSource={setSelectedDataSource}
            dataSource={selectedDataSource}
            setPauseDataSourceSelection={setPauseDataSourceSelection}
          />
        ))
      ) : showFilePicker ? (
        <SourceItemsList
          setIsUploading={setIsUploading}
          setShowFilePicker={setShowFilePicker}
          selectedDataSource={selectedDataSource}
          processedIntegration={processedIntegration}
        />
      ) : !shouldShowFilesTab ? (
        <AccountManagement
          accounts={connectedDataSources}
          handleAddAccountClick={handleAddAccountClick}
          resyncDataSource={resyncDataSource}
          revokeDataSource={revokeDataSource}
          performBulkAction={performBulkAction}
          performingAction={performingAction}
        />
      ) : (
        <SyncedFilesList
          selectedDataSource={selectedDataSource}
          handleUploadFilesClick={handleUploadFilesClick}
          mode={mode}
          processedIntegration={processedIntegration}
          setActiveStep={setActiveStep}
          bannerState={bannerState}
          setBannerState={setBannerState}
        />
      )}
    </>
  );
}

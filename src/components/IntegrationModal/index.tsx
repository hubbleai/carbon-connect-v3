import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@components/common/design-system/Dialog";
import { findModifications, getBaseURL } from "@utils/helper-functions";
import IntegrationList from "@components/IntegrationModal/IntegrationList";
import WebScraper from "@components/WebScraper/WebScraper";
import CarbonFilePicker from "@components/CarbonFilePicker/CarbonFilePicker";
import { INTEGRATIONS_LIST } from "@utils/integrationModalconstants";
import { useCarbon } from "../../context/CarbonContext";
import { ActiveStep, IntegrationName } from "../../typing/shared";

import LocalFilesScreen from "../SystemFileUpload/LocalFilesScreen";
import ConnectScreen from "@components/CarbonConnect/ConnectScreen";

export interface ModalProps {}

// todo - better types
export type IntegrationAPIResponse = {
  id: number;
  data_source_type: IntegrationName;
  data_source_external_id: string;
  files: never;
  synced_files: never[];
  sync_status: string;
  last_synced_at: Date;
  last_sync_action: string;
  source_items_synced_at: Date;
  files_synced_at: Date;
  data_source_metadata: any;
  created_at: Date;
};

export function IntegrationModal({ children }: { children: ReactNode }) {
  const {
    orgName,
    accessToken,
    fetchTokens,
    requestIds,
    onSuccess,
    processedIntegrations,
    entryPoint,
    whiteLabelingData,
    showModal,
    environment,
    authenticatedFetch,
    manageModalOpenState,
    dataSourcePollingInterval,
    setLastModifications,
    apiURL,
  } = useCarbon();

  const [activeIntegrations, setActiveIntegrations] = useState<
    IntegrationAPIResponse[]
  >([]);

  const requestIdsRef = useRef(requestIds);
  const activeIntegrationsRef = useRef(activeIntegrations);
  const firstFetchCompletedRef = useRef(false);

  const [carbonActive, setCarbonActive] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<ActiveStep>(
    entryPoint || "CONNECT"
  );

  const fetchUserIntegrations = async () => {
    try {
      const userIntegrationsResponse = await authenticatedFetch(
        `${getBaseURL(apiURL, environment)}/integrations/?${new URLSearchParams(
          {
            include_files: "false",
          }
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        }
      );
      if (userIntegrationsResponse.status === 200) {
        const responseBody = await userIntegrationsResponse.json();
        if (firstFetchCompletedRef.current) {
          const integrationModifications = findModifications(
            responseBody["active_integrations"],
            activeIntegrationsRef.current,
            requestIdsRef
          );

          if (integrationModifications.length > 0) {
            for (let i = 0; i < integrationModifications.length; i++) {
              onSuccess && onSuccess(integrationModifications[i]);
            }
          }
          setLastModifications(integrationModifications);
        } else {
          firstFetchCompletedRef.current = true;
        }
        activeIntegrationsRef.current = responseBody["active_integrations"];
        setActiveIntegrations(responseBody["active_integrations"]);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchUserIntegrations();
    } else {
      fetchTokens();
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken && showModal) {
      const pollingInterval = dataSourcePollingInterval
        ? Math.max(dataSourcePollingInterval, 3000)
        : 8000;
      const intervalId = setInterval(fetchUserIntegrations, pollingInterval);
      // Make sure to clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [accessToken, showModal]);

  useEffect(() => {
    requestIdsRef.current = requestIds || {};
  }, [requestIds]);

  useEffect(() => {
    activeIntegrationsRef.current = activeIntegrations;
  }, [activeIntegrations, carbonActive]);

  useEffect(() => {
    if (whiteLabelingData?.remove_branding && entryPoint) {
      setActiveStep(entryPoint);
    } else {
      setActiveStep("CONNECT");
    }
  }, [whiteLabelingData]);

  const isWhiteLabeledEntryPoint =
    entryPoint && whiteLabelingData?.remove_branding;

  const showActiveContent = (activeStep: ActiveStep) => {
    switch (activeStep) {
      case "CONNECT":
        return (
          <ConnectScreen
            onPrimaryButtonClick={(step) => setActiveStep(step)}
            setCarbonActive={setCarbonActive}
          />
        );
      case "INTEGRATION_LIST":
        return (
          <IntegrationList
            setActiveStep={setActiveStep}
            handleBack={
              isWhiteLabeledEntryPoint
                ? () => manageModalOpenState(false)
                : () => setActiveStep("CONNECT")
            }
            onCloseModal={() => manageModalOpenState(false)}
            activeIntegrations={activeIntegrations}
          />
        );

      case IntegrationName.WEB_SCRAPER:
        return (
          <WebScraper
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            onCloseModal={() => manageModalOpenState(false)}
            isWhiteLabeledEntryPoint={isWhiteLabeledEntryPoint}
          />
        );

      case IntegrationName.LOCAL_FILES:
        return (
          <LocalFilesScreen
            setActiveStep={setActiveStep}
            activeStepData={INTEGRATIONS_LIST.find(
              (item) => item.id === IntegrationName.LOCAL_FILES
            )}
            isWhiteLabeledEntryPoint={isWhiteLabeledEntryPoint}
            onCloseModal={() => manageModalOpenState(false)}
          />
        );
      default:
        return (
          <CarbonFilePicker
            activeStepData={INTEGRATIONS_LIST.find(
              (item) => item.id === activeStep
            )}
            setActiveStep={setActiveStep}
            onCloseModal={() => manageModalOpenState(false)}
            activeIntegrations={activeIntegrations}
            isWhiteLabeledEntryPoint={isWhiteLabeledEntryPoint}
          />
        );
        break;
    }
  };
  return (
    <>
      {children ? <div>{children}</div> : null}
      <Dialog
        open={showModal}
        onOpenChange={(modalOpenState) => manageModalOpenState(modalOpenState)}
      >
        <DialogContent
          activeState={activeStep}
          // className={`${
          //   carbonActive
          //     ? "sm:cc-max-h-[90vh] sm:cc-w-[415px] sm:cc-h-[703px] cc-gap-0 sm:cc-rounded-[20px]"
          //     : ""
          // }`}
        >
          {showActiveContent(activeStep)}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default IntegrationModal;

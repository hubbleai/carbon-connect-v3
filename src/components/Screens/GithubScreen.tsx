import React, { useEffect, useState } from "react";
import { ActiveStep, ProcessedIntegration } from "../../typing/shared";
import { IntegrationAPIResponse } from "../IntegrationModal";
import GithubAuthScreen from "./GithubAuthScreen";
import GithubRepoScreen from "./GithubRepoScreen";

function GithubScreen({
  setActiveStep,
  processedIntegration,
  activeIntegrations,
  setShowFilePicker,
  setShowAdditionalStep,
  setSelectedDataSource,
  dataSource,
  setPauseDataSourceSelection,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<ActiveStep>>;
  processedIntegration: ProcessedIntegration;
  activeIntegrations: IntegrationAPIResponse[];
  setShowFilePicker: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAdditionalStep: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDataSource: React.Dispatch<
    React.SetStateAction<IntegrationAPIResponse | null>
  >;
  setPauseDataSourceSelection: React.Dispatch<React.SetStateAction<boolean>>;
  dataSource: IntegrationAPIResponse | null;
}) {
  const [step, setStep] = useState("credentials");
  const [username, setUsername] = useState("");

  if (step == "credentials") {
    return (
      <GithubAuthScreen
        username={username}
        setUsername={setUsername}
        setStep={setStep}
        processedIntegration={processedIntegration}
      />
    );
  } else {
    return (
      <GithubRepoScreen
        username={username}
        processedIntegration={processedIntegration}
        setActiveStep={setActiveStep}
        activeIntegrations={activeIntegrations}
        setShowFilePicker={setShowFilePicker}
        setShowAdditionalStep={setShowAdditionalStep}
        setSelectedDataSource={setSelectedDataSource}
        dataSource={dataSource}
        setPauseDataSourceSelection={setPauseDataSourceSelection}
      />
    );
  }
}

export default GithubScreen;

import React, { useEffect, useState } from "react";
import IntegrationModal from "./components/IntegrationModal";

import "./styles.css";
import {
  IntegrationName,
  CarbonConnectProps,
  EmbeddingGenerators,
  AutoSyncedSourceTypes,
} from "./typing/shared";
import { CarbonProvider } from "./context/CarbonContext";

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
        <IntegrationModal />
      </CarbonProvider>
    </>
  );
};

export {
  CarbonConnect,
  IntegrationName,
  AutoSyncedSourceTypes,
  EmbeddingGenerators,
};

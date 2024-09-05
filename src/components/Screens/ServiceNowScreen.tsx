import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DialogFooter } from "@components/common/design-system/Dialog";
import InfoFill from "@assets/svgIcons/info_fill.svg";
import UserPlus from "@assets/svgIcons/user-plus.svg";
import { Input } from "@components/common/design-system/Input";
import { Button } from "@components/common/design-system/Button";
import {
  IntegrationName,
  ProcessedIntegration,
  ActionType,
} from "../../typing/shared";
import { useCarbon } from "../../context/CarbonContext";
import {
  generateRequestId,
  getConnectRequestProps,
  getIntegrationDisclaimer,
  wasAccountAdded,
} from "../../utils/helper-functions";
import { BASE_URL, ENV } from "../../constants/shared";
import Banner, { BannerState } from "../common/Banner";
import Loader from "../common/Loader";

export default function ServiceNowScreen({
  processedIntegration,
  setShowAdditionalStep,
}: {
  processedIntegration: ProcessedIntegration;
  setShowAdditionalStep: Dispatch<SetStateAction<boolean>>;
}) {
  const [domain, setDomain] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [redirectUri, setRedirectUri] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [bannerState, setBannerState] = useState<BannerState>({
    message: null,
  });
  const [connectingAccount, setConnectingAccount] = useState(false);

  const carbonProps = useCarbon();
  const {
    onSuccess,
    onError,
    useRequestIds,
    setRequestIds,
    requestIds,
    authenticatedFetch,
    environment = ENV.PRODUCTION,
    accessToken,
    whiteLabelingData,
    orgName,
    lastModifications,
  } = carbonProps;

  useEffect(() => {
    if (wasAccountAdded(lastModifications || [], IntegrationName.SERVICENOW)) {
      setShowAdditionalStep(false);
      setConnectingAccount(false);
    }
  }, [JSON.stringify(lastModifications)]);

  const fetchOauthURL = async () => {
    try {
      if (!domain || !clientId || !clientSecret || !redirectUri) {
        setBannerState({
          type: "ERROR",
          message: "All fields are required",
        });
        return;
      }

      const finalDomain = domain
        .replace("https://www.", "")
        .replace("http://www.", "")
        .replace("https://", "")
        .replace("http://", "")
        .replace(/\/$/, "")
        .replace(".service-now.com", "")
        .trim();

      setIsLoading(true);
      const oauthWindow = window.open("", "_blank");

      if (!oauthWindow) {
        setBannerState({
          type: "ERROR",
          message: "Failed to start Oauth flow",
        });
        return;
      }

      oauthWindow?.document.write("Loading...");

      setIsLoading(true);

      let requestId = null;
      if (useRequestIds) {
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
          servicenow_credentials: {
            instance_subdomain: finalDomain,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
          },
          service: processedIntegration.data_source_type,
          connecting_new_account: true,
        },
        carbonProps
      );

      const response = await authenticatedFetch(
        `${BASE_URL[environment]}/integrations/oauth_url`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestObject),
        }
      );

      const oAuthURLResponseData = await response.json();

      if (response.status === 200) {
        onSuccess &&
          onSuccess({
            status: 200,
            data: { request_id: requestId },
            action: ActionType.INITIATE,
            event: ActionType.INITIATE,
            integration: IntegrationName.SERVICENOW,
          });
        setDomain("");
        setClientId("");
        setClientSecret("");
        setRedirectUri("");

        oauthWindow.location.href = oAuthURLResponseData.oauth_url;
        setConnectingAccount(true);
      } else {
        oauthWindow.document.body.innerHTML = oAuthURLResponseData.detail;
      }
      setIsLoading(false);
    } catch (error) {
      setBannerState({
        type: "ERROR",
        message: "Error getting oAuth URL. Please try again.",
      });
      setIsLoading(false);
      onError &&
        onError({
          status: 400,
          data: [{ message: "Error getting oAuth URL. Please try again." }],
          action: ActionType.ERROR,
          event: ActionType.ERROR,
          integration: IntegrationName.SERVICENOW,
        });
    }
  };

  useEffect(() => {
    if (connectingAccount) {
      setTimeout(() => setConnectingAccount(false), 20000);
    }
  }, [connectingAccount]);

  return (
    <>
      <Banner bannerState={bannerState} setBannerState={setBannerState} />
      <div className="cc-p-4 cc-min-h-0 cc-flex-grow">
        <div className="cc-p-2 cc-rounded-md cc-bg-surface-surface_1 cc-inline-block cc-mb-5 dark:cc-bg-svg-background cc-cursor-pointer">
          <img
            src={UserPlus}
            alt="User Plus"
            className="cc-h-6 cc-w-6 dark:cc-invert-[1] dark:cc-hue-rotate-180"
          />
        </div>
        <div className="cc-text-base cc-font-semibold cc-mb-5 dark:cc-text-dark-text-white">
          Please enter your ServiceNow OAuth credentials
        </div>
        <Input
          type="text"
          placeholder="<instance-subdomain>.service-now.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="cc-mb-4"
        />
        <Input
          type="text"
          placeholder="client id"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="cc-mb-4"
        />
        <Input
          type="password"
          placeholder="client secret"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          className="cc-mb-4"
        />
        <Input
          type="text"
          placeholder="redirect URI"
          value={redirectUri}
          onChange={(e) => setRedirectUri(e.target.value)}
          className="cc-mb-4"
        />
      </div>
      {connectingAccount ? <Loader /> : null}
      <DialogFooter>
        <div className="cc-flex cc-mb-4 cc-gap-2 cc-items-center">
          <img
            src={InfoFill}
            alt="Info Icon"
            className="cc-w-5 cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
          />
          <p className="cc-text-low_em cc-font-semibold cc-text-sm dark:cc-text-dark-text-white">
            {getIntegrationDisclaimer(
              processedIntegration,
              whiteLabelingData,
              orgName
            )}
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          className="cc-w-full"
          onClick={() => fetchOauthURL()}
          disabled={isLoading}
        >
          Submit
        </Button>
      </DialogFooter>
    </>
  );
}

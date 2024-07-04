import React, { useState } from "react";
import { DialogFooter } from "@components/common/design-system/Dialog";
import InfoFill from "@assets/svgIcons/info_fill.svg";
import UserPlus from "@assets/svgIcons/user-plus.svg";
import { Input } from "@components/common/design-system/Input";
import { Button } from "@components/common/design-system/Button";
import {
  ActionType,
  IntegrationName,
  ProcessedIntegration,
} from "../../typing/shared";
import { useCarbon } from "../../context/CarbonContext";
import {
  generateRequestId,
  getConnectRequestProps,
} from "../../utils/helper-functions";
import { BASE_URL, ENV } from "../../constants/shared";
import Banner, { BannerState } from "../common/Banner";

export default function ZendeskScreen({
  processedIntegration,
}: {
  processedIntegration: ProcessedIntegration;
}) {
  const [zendeskDomain, setZendeskDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bannerState, setBannerState] = useState<BannerState>({
    message: null,
  });

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
  } = carbonProps;

  const fetchOauthURL = async () => {
    try {
      if (!zendeskDomain) {
        setBannerState({
          type: "ERROR",
          message: "Please enter your Zendesk domain.",
        });
        return;
      }

      const subdomain = zendeskDomain
        .replace("https://www.", "")
        .replace("http://www.", "")
        .replace("https://", "")
        .replace("http://", "")
        .replace(".zendesk.com", "")
        .replace(/\/$/, "")
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
          zendesk_subdomain: subdomain,
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
            integration: IntegrationName.ZENDESK,
          });
        setZendeskDomain("");

        oauthWindow.location.href = oAuthURLResponseData.oauth_url;
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
          integration: IntegrationName.ZENDESK,
        });
    }
  };

  return (
    <>
      <Banner bannerState={bannerState} setBannerState={setBannerState} />
      <div className="cc-p-4 cc-min-h-0 cc-flex-grow">
        <div className="cc-p-2 cc-rounded-md cc-bg-surface-surface_1 cc-inline-block cc-mb-5 dark:cc-bg-svg-background">
          <img
            src={UserPlus}
            alt="User Plus"
            className="cc-h-6 cc-w-6 dark:cc-invert-[1] dark:cc-hue-rotate-180"
          />
        </div>
        <div className="cc-text-base cc-font-semibold cc-mb-5 dark:cc-text-dark-text-white">
          Please enter the {processedIntegration.name}{" "}
          <span className="cc-px-2 cc-mx-1 cc-bg-surface-info_accent_1 cc-text-info_em cc-rounded-md dark:cc-text-[#88E7FC] dark:cc-bg-[#10284D]">
            domain
          </span>
          of the acount you wish to connect.
        </div>
        <Input
          type="text"
          placeholder="your-subdomain.zendesk.com"
          value={zendeskDomain}
          onChange={(e) => setZendeskDomain(e.target.value)}
          className="cc-mb-4"
        />
      </div>
      <DialogFooter>
        <div className="cc-flex cc-mb-4 cc-gap-2 cc-items-center">
          <img
            src={InfoFill}
            alt="Info Icon"
            className="cc-w-5 cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
          />
          <p className="cc-text-low_em cc-font-semibold cc-text-sm dark:cc-text-dark-text-white">
            By connecting to {processedIntegration.name}, you are providing us
            with access to your {processedIntegration.name} account. We will use
            this access to import your data into Carbon. We will not modify your
            data in any way.
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
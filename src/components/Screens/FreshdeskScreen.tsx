import React, { Dispatch, SetStateAction, useState } from "react";
import { DialogFooter } from "@components/common/design-system/Dialog";
import InfoFill from "@assets/svgIcons/info_fill.svg";
import UserPlus from "@assets/svgIcons/user-plus.svg";
import { Input } from "@components/common/design-system/Input";
import { Button } from "@components/common/design-system/Button";
import { ProcessedIntegration, ActionType } from "../../typing/shared";
import { useCarbon } from "../../context/CarbonContext";
import {
  generateRequestId,
  getBaseURL,
  getConnectRequestProps,
  getIntegrationDisclaimer,
} from "../../utils/helper-functions";
import { ENV } from "../../constants/shared";
import Banner, { BannerState } from "../common/Banner";

export default function FreshdeskScreen({
  processedIntegration,
  setShowAdditionalStep,
}: {
  processedIntegration: ProcessedIntegration;
  setShowAdditionalStep: Dispatch<SetStateAction<boolean>>;
}) {
  const [freshdeskdomain, setFreshdeskdomain] = useState("");
  const [apiKey, setApiKey] = useState("");
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
    whiteLabelingData,
    orgName,
    apiURL,
  } = carbonProps;

  const connectFreshdesk = async () => {
    try {
      if (!freshdeskdomain) {
        setBannerState({
          type: "ERROR",
          message: "Please enter your freshdesk domain",
        });
      }
      if (!apiKey) {
        setBannerState({
          type: "ERROR",
          message: "Please enter an API key",
        });
        return;
      }

      setIsLoading(true);

      onSuccess &&
        onSuccess({
          status: 200,
          data: null,
          action: ActionType.INITIATE,
          event: ActionType.INITIATE,
          integration: processedIntegration.id,
        });
      setIsLoading(true);

      let requestId = null;
      if (useRequestIds) {
        requestId = generateRequestId(20);
        setRequestIds({
          ...requestIds,
          [processedIntegration?.data_source_type]: requestId,
        });
      }

      const domain = freshdeskdomain
        .replace("https://www.", "")
        .replace("http://www.", "")
        .replace("https://", "")
        .replace("http://", "")
        .replace(/\/$/, "")
        .trim();

      const requestObject = getConnectRequestProps(
        processedIntegration,
        requestId,
        { api_key: apiKey, domain: domain },
        carbonProps
      );

      const response = await authenticatedFetch(
        `${getBaseURL(apiURL, environment)}/integrations/freshdesk`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestObject),
        }
      );

      const responseData = await response.json();

      if (response.status === 200) {
        setBannerState({
          type: "SUCCESS",
          message: "Freshdesk sync initiated, you will be redirected shortly!",
        });
        setApiKey("");
        setFreshdeskdomain("");
        setTimeout(() => setShowAdditionalStep(false), 3000);
      } else {
        setBannerState({
          type: "ERROR",
          message: responseData.detail,
        });
        onError &&
          onError({
            status: 400,
            data: [{ message: responseData.detail }],
            action: ActionType.ERROR,
            event: ActionType.ERROR,
            integration: processedIntegration.id,
          });
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setBannerState({
        type: "ERROR",
        message: "Error connecting your Freshdesk. Please try again.",
      });
      setIsLoading(false);
      onError &&
        onError({
          status: 400,
          data: [
            { message: "Error connecting your Freshdesk. Please try again." },
          ],
          action: ActionType.ERROR,
          event: ActionType.ERROR,
          integration: processedIntegration.id,
        });
    }
  };
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
          Please enter {processedIntegration.name}{" "}
          <span className="cc-px-2 cc-mx-1 cc-bg-surface-info_accent_1 cc-text-info_em cc-rounded-md dark:cc-text-[#88E7FC] dark:cc-bg-[#10284D]">
            domain
          </span>
          and
          <span className="cc-px-2 cc-mx-1 cc-bg-surface-info_accent_1 cc-text-info_em cc-rounded-md dark:cc-text-[#88E7FC] dark:cc-bg-[#10284D]">
            api key
          </span>
          of the acount you wish to connect.
        </div>
        <Input
          type="text"
          placeholder="domain.freshdesk.com"
          value={freshdeskdomain}
          onChange={(e) => setFreshdeskdomain(e.target.value)}
          className="cc-mb-4"
        />
        <Input
          type="password"
          placeholder="API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="cc-mb-32"
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
          onClick={() => connectFreshdesk()}
          disabled={isLoading}
        >
          Submit
        </Button>
      </DialogFooter>
    </>
  );
}

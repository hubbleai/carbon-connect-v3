import React, { useState } from "react";
import { DialogFooter } from "@components/common/design-system/Dialog";
import InfoFill from "@assets/svgIcons/info_fill.svg";
import UserPlus from "@assets/svgIcons/user-plus.svg";
import { Input } from "@components/common/design-system/Input";
import { Button } from "@components/common/design-system/Button";
import { useCarbon } from "../../context/CarbonContext";
import {
  generateRequestId,
  getConnectRequestProps,
  getIntegrationDisclaimer,
} from "../../utils/helper-functions";
import { BASE_URL, ENV, SYNC_SOURCE_ITEMS } from "../../constants/shared";
import Banner, { BannerState } from "../common/Banner";
import {
  ProcessedIntegration,
  IntegrationName,
  ActionType,
} from "../../typing/shared";

export default function S3Screen({
  processedIntegration,
}: {
  processedIntegration: ProcessedIntegration;
}) {
  const [accessKey, setAccessKey] = useState("");
  const [accessKeySecret, setAccessKeySecret] = useState("");
  const [endpointUrl, setEndpointUrl] = useState<null | string>(null);
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
  } = carbonProps;

  const connectS3 = async () => {
    try {
      if (!accessKey) {
        setBannerState({
          message: "Please enter your access key.",
          type: "ERROR",
        });
        return;
      }
      if (!accessKeySecret) {
        setBannerState({
          message: "Please enter your access key secret.",
          type: "ERROR",
        });
        return;
      }
      onSuccess &&
        onSuccess({
          status: 200,
          data: null,
          action: ActionType.INITIATE,
          event: ActionType.INITIATE,
          integration: IntegrationName.S3,
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

      const requestObject = {
        access_key: accessKey,
        access_key_secret: accessKeySecret,
        sync_source_items:
          processedIntegration?.syncSourceItems ?? SYNC_SOURCE_ITEMS,
        ...(endpointUrl && { endpoint_url: endpointUrl }),
      };

      const response = await authenticatedFetch(
        `${BASE_URL[environment]}/integrations/s3`,
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
          message: `${processedIntegration.name} sync initiated.`,
          type: "SUCCESS",
        });
        setAccessKey("");
        setAccessKeySecret("");
        setEndpointUrl("");
      } else {
        setBannerState({ type: "ERROR", message: responseData.detail });
        onError &&
          onError({
            status: 400,
            data: [{ message: responseData.detail }],
            action: ActionType.ERROR,
            event: ActionType.ERROR,
            integration: IntegrationName.S3,
          });
      }
      setIsLoading(false);
    } catch (error) {
      setBannerState({
        type: "ERROR",
        message: `Error connecting your ${processedIntegration.name}. Please try again.`,
      });
      setIsLoading(false);
      onError &&
        onError({
          status: 400,
          data: [
            {
              message: `Error connecting your ${processedIntegration.name}. Please try again.`,
            },
          ],
          action: ActionType.ERROR,
          event: ActionType.ERROR,
          integration: IntegrationName.S3,
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
          Please enter
          <span className="cc-px-2 cc-mx-1 cc-bg-surface-info_accent_1 cc-text-info_em cc-rounded-md dark:cc-text-[#88E7FC] dark:cc-bg-[#10284D]">
            access key
          </span>
          and
          <span className="cc-px-2 cc-mx-1 cc-bg-surface-info_accent_1 cc-text-info_em cc-rounded-md dark:cc-text-[#88E7FC] dark:cc-bg-[#10284D]">
            access key secret
          </span>
          of the acount you wish to connect. If you are connecting a
          DigitalOcean Space, please provide the endpoint URL as well.
        </div>
        <Input
          type="text"
          placeholder="Access Key"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          className="cc-mb-4"
        />
        <Input
          type="password"
          placeholder="Access Key Secret"
          value={accessKeySecret}
          onChange={(e) => setAccessKeySecret(e.target.value)}
          className="cc-mb-4"
        />
        <Input
          type="text"
          placeholder="Endpoint URL (<region>.digitaloceanspaces.com)"
          value={endpointUrl || ""}
          onChange={(e) => setEndpointUrl(e.target.value)}
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
          onClick={() => connectS3()}
          disabled={isLoading}
        >
          Submit
        </Button>
      </DialogFooter>
    </>
  );
}

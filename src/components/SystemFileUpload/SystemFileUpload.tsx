import React, { useEffect, useRef, useState } from "react";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/common/design-system/Dialog";
import BackIcon from "@assets/svgIcons/back-icon.svg";
import { IntegrationItemType } from "@utils/integrationModalconstants";
import { Button } from "@components/common/design-system/Button";
import { images } from "@assets/index";

import SuccessScreen from "./SuccessScreen";

import FileExtension from "@components/SystemFileUpload/FileExtension/FileExtension";
import ClickToUpload from "./ClickToUpload";
import { useCarbon } from "../../context/CarbonContext";
import {
  BASE_URL,
  DEFAULT_MAX_FILES,
  DEFAULT_SIZE_MB,
  ENV,
  MAX_FILES_LIMIT,
  ONE_MB,
} from "../../constants/shared";
import { generateFileUploadUrl, getFileSizeLimit } from "../../utils/files";
import Banner, { BannerState } from "../common/Banner";
import {
  ActiveStep,
  IntegrationName,
  ActionType,
  LocalFilesIntegration,
} from "../../typing/shared";

export interface UploadFileData {
  lastModified: number;
  name: string;
  type: string;
  size: number;
}

const defaultSupportedFileTypes = [
  "txt",
  "csv",
  "pdf",
  "docx",
  "pptx",
  "json",
  "html",
];

export default function SystemFileUpload({
  activeStepData,
  setActiveStep,
  bannerState,
  setBannerState,
  setScreen,
}: {
  activeStepData?: IntegrationItemType;
  setActiveStep: (val: ActiveStep) => void;
  bannerState: BannerState;
  setBannerState: React.Dispatch<React.SetStateAction<BannerState>>;
  setScreen: React.Dispatch<React.SetStateAction<"FILES" | "UPLOAD">>;
}) {
  const [step, setStep] = useState<"ADD" | "SUCCESS" | "UPLOAD">("ADD");
  // state variable for file upload
  const [files, setFiles] = useState<UploadFileData[]>([]);

  const [uploading, setUploading] = useState<boolean>(false);

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [filesConfig, setFilesConfig] = useState<
    LocalFilesIntegration | null | undefined
  >(null);
  const [allowedMaxFileSize, setAllowedMaxFileSize] = useState(DEFAULT_SIZE_MB);
  const [allowedMaxFilesCount, setAllowedMaxFilesCount] =
    useState(DEFAULT_MAX_FILES);

  const deleteRef = useRef<HTMLDivElement | null>(null);

  const allowedFileExtensions = filesConfig?.allowedFileTypes
    ? filesConfig.allowedFileTypes.map((config) =>
        config.extension.toLowerCase()
      )
    : defaultSupportedFileTypes;

  const carbonProps = useCarbon();
  const {
    processedIntegrations,
    whiteLabelingData,
    maxFileSize = DEFAULT_SIZE_MB * ONE_MB,
    accessToken,
    authenticatedFetch,
    tags,
    environment = ENV.PRODUCTION,
    onSuccess,
    onError,
  } = carbonProps;

  useEffect(() => {
    const newFilesConfig = processedIntegrations?.find(
      (integration) => integration.id === IntegrationName.LOCAL_FILES
    ) as LocalFilesIntegration;

    const maxAllowedLimit = getFileSizeLimit(
      newFilesConfig,
      whiteLabelingData,
      maxFileSize
    );

    if (newFilesConfig) {
      setAllowedMaxFileSize(Math.floor(maxAllowedLimit / ONE_MB));
      setAllowedMaxFilesCount(
        Math.min(
          newFilesConfig.maxFilesCount || DEFAULT_MAX_FILES,
          MAX_FILES_LIMIT
        )
      );
      setFilesConfig(newFilesConfig);
    }
  }, [processedIntegrations, whiteLabelingData]);

  const handleOutside = (event: MouseEvent) => {
    if (
      deleteRef.current &&
      !deleteRef.current.contains(event.target as Node)
    ) {
      setOpenDropdown(null);
    }
  };

  const handleDropdownClick = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleFileUpload = (selectedFiles: File[]): void => {
    const fileList = Array.from(selectedFiles);
    setFiles(fileList);
    setStep("UPLOAD");
  };

  const handleRemove = (data: UploadFileData) => {
    const newFiles = files.filter(
      (f) => f.name != data.name && f.lastModified != data.lastModified
    );
    setFiles(newFiles);
  };

  const convertBytesToKB = (bytes: number): string => {
    return (bytes / 1024).toFixed(2) + " KB";
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  const uploadSelectedFiles = async () => {
    if (files.length === 0) {
      return;
    }

    try {
      setUploading(true);
      const successfulUploads: any = [];
      const failedUploads: any = [];

      await Promise.all(
        files.map(async (file, index) => {
          try {
            const fileType = file.name.split(".").pop();

            const isExtensionAllowed = allowedFileExtensions.find(
              (configuredType) => configuredType === fileType
            );

            if (!isExtensionAllowed) {
              failedUploads.push({
                name: file.name,
                message: "Unsupported Format",
              });
              return;
            }

            const apiUrl = generateFileUploadUrl(
              fileType,
              filesConfig,
              carbonProps
            );

            const fileSize = file.size / 1000000;

            if (fileSize > allowedMaxFileSize) {
              failedUploads.push({
                name: file.name,
                message: `File size is too large. The maximum size allowed is: ${allowedMaxFileSize} MB`,
              });
              return;
            }

            const formData = new FormData();
            // @ts-ignore
            formData.append("file", file);

            const uploadResponse = await authenticatedFetch(apiUrl.toString(), {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Token ${accessToken}`,
              },
            });

            if (uploadResponse.status === 200 && tags) {
              const uploadResponseData = await uploadResponse.json();

              const appendTagsResponse = await authenticatedFetch(
                `${BASE_URL[environment]}/create_user_file_tags`,
                {
                  method: "POST",
                  body: JSON.stringify({
                    tags: tags,
                    organization_user_file_id: uploadResponseData["id"],
                  }),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${accessToken}`,
                  },
                }
              );

              if (appendTagsResponse.status === 200) {
                const appendTagsResponseData = await appendTagsResponse.json();
                successfulUploads.push(appendTagsResponseData);
              } else {
                failedUploads.push({
                  name: file.name,
                  message: "Failed to add tags to the file.",
                });
              }
            } else {
              const errorData = await uploadResponse.json(); // Get the error response body

              failedUploads.push({
                name: file.name,
                message: errorData.detail || "Failed to upload file.",
              });
            }
          } catch (error) {
            console.error(error);
          }
        })
      );

      if (successfulUploads.length > 0) {
        onSuccess &&
          onSuccess({
            status: 200,
            data: {
              data_source_external_id: null,
              sync_status: null,
              files: successfulUploads,
            },
            action: ActionType.UPDATE,
            event: ActionType.UPDATE,
            integration: IntegrationName.LOCAL_FILES,
          });
      }

      if (failedUploads.length > 0) {
        onError &&
          onError({
            status: 400,
            data: failedUploads,
            action: ActionType.UPDATE,
            event: ActionType.UPDATE,
            integration: IntegrationName.LOCAL_FILES,
          });
        setBannerState({
          message: "Some files were not uploaded",
          type: "ERROR",
          additionalInfo: `${successfulUploads.length} succeeded and ${failedUploads.length} failed`,
        });
        setScreen("FILES");
      } else {
        setStep("SUCCESS");
      }
    } catch (error) {
      onError &&
        onError({
          status: 400,
          data: [{ message: "Error uploading files" }],
          action: ActionType.UPDATE,
          event: ActionType.UPDATE,
          integration: IntegrationName.LOCAL_FILES,
        });
    }
    setUploading(false);
    setFiles([]);
  };

  return (
    <>
      <DialogHeader closeButtonClass="cc-hidden sm:cc-flex">
        <div className="cc-flex-grow cc-flex cc-gap-3 cc-items-center">
          <button
            className="cc-pr-1 cc-h-10 cc-w-auto cc-shrink-0 "
            onClick={() => {
              if (step != "ADD") {
                setStep("ADD");
              } else {
                setScreen("FILES");
              }
            }}
          >
            <img
              src={BackIcon}
              alt="Lock"
              className="cc-h-[18px] cc-w-[18px] dark:cc-invert-[1] dark:cc-hue-rotate-180"
            />
          </button>
          <div className="dark:cc-shadow-[0px_3px_4px_-2px_#0000007A] dark:cc-border-dark-border-color md:cc-hidden cc-h-8 cc-w-8 sm:cc-h-14 sm:cc-w-14 cc-shrink-0 cc-bg-surface-white cc-rounded-lg cc-p-0.5 cc-shadow-e2">
            <div className="cc-h-full cc-w-full cc-bg-gray-50 cc-flex cc-items-center cc-justify-center cc-rounded-lg">
              <img
                src={activeStepData?.logo}
                alt="logo"
                className="cc-h-4 cc-w-4 sm:cc-h-8 sm:cc-w-8"
              />
            </div>
          </div>
          <DialogTitle className="cc-flex-grow cc-text-left">
            {activeStepData?.name}
          </DialogTitle>
        </div>
        {step === "UPLOAD" ? (
          <div
            className="cc-text-[#0BABFB] md:cc-ml-[-34px] hover:cc-text-[#067BF9]  cc-cursor-pointer cc-font-semibold cc-text-[14px] cc-leading-[24px] cc-border-b-[2px] cc-border-[#0BABFB] "
            onClick={() => {
              setStep("ADD");
            }}
          >
            Add files
          </div>
        ) : null}
      </DialogHeader>
      {step === "ADD" && (
        <>
          <Banner bannerState={bannerState} setBannerState={setBannerState} />
          <ClickToUpload
            onSubmit={handleFileUpload}
            maxFileSize={allowedMaxFileSize}
            maxFiles={allowedMaxFilesCount}
            allowedFileExtensions={allowedFileExtensions}
            setBannerState={setBannerState}
          />
        </>
      )}
      {step === "UPLOAD" && (
        <>
          <Banner bannerState={bannerState} setBannerState={setBannerState} />
          <div className="cc-flex cc-flex-col cc-h-full cc-grow cc-overflow-hidden">
            <div className="cc-hidden md:cc-block">
              {/* <ClickToUpload onSubmit={handleFileUpload} /> */}
            </div>
            <div className=" cc-overflow-scroll">
              <div className="cc-flex cc-w-full  cc-flex-wrap cc-p-2.5  cc-gap-[10px]  cc-pb-[90px] ">
                {files.map((data, index) => (
                  <div
                    key={index}
                    className="uploadFileWrapper md:cc-w-full dark:cc-border-dark-input-bg cc-cursor-pointer group cc-relative  cc-flex cc-border cc-border-solid cc-border-[#0000001F] cc-p-[16px] cc-rounded-xl cc-items-center cc-w-[368px] cc-justify-between dark:hover:cc-shadow-[0px_3px_4px_-2px_#FFFFFF29] hover:cc-shadow-[0_3px_4px_-2px_#00000029]"
                  >
                    <FileExtension fileName={data.type} />
                    <div>
                      <div className="cc-w-[201px] cc-whitespace-nowrap cc-text-ellipsis cc-overflow-hidden cc-text-[#100C20] cc-font-semibold cc-text-base dark:cc-text-dark-text-white">
                        {data.name}
                      </div>
                      <div className="cc-text-xs cc-font-medium cc-text-[#0000007A] dark:cc-text-dark-text-gray">
                        {convertBytesToKB(data.size)}
                      </div>
                    </div>
                    <div>
                      {/* {uploading && (
                        <div className="cc-w-[48] cc-h-[48] md:cc-w-[40px] md:cc-h-[40px]">
                          <CircularProgressbarWithChildren
                            value={uploadProgress}
                            styles={buildStyles({
                              textSize: "23px",
                              pathColor: `#0BABFB, ${uploadProgress / 100})`,
                              textColor: "#8C8A94",
                              trailColor: "#d6d6d6",
                              backgroundColor: "#3e98c7",
                            })}
                          >
                            <div className=" cc-text-[10px] cc-text-[#8C8A94] cc-font-medium cc-absolute cc-top-2/4 cc-left-1/2 cc-translate-x-[-50%] cc-translate-y-[-50%]">{`${Math.round(
                              uploadProgress
                            )}%`}</div>
                          </CircularProgressbarWithChildren>
                        </div>
                      )} */}

                      <div>
                        <img
                          className="delete cc-hidden md:cc-w-[40px] md:cc-h-[40px] "
                          src={images.deleteIcon}
                          alt="delete"
                          onClick={() => handleRemove(data)}
                        />
                        <img
                          className=" success cc-block md:cc-w-[40px] md:cc-h-[40px] "
                          src={images.fileUploadSuccess}
                          alt="success"
                        />
                      </div>
                    </div>
                    <div className="cc-hidden md:cc-block ">
                      <img
                        className="cc-hidden md:cc-block cc-cursor-pointer dark:cc-invert-[1] dark:cc-hue-rotate-180"
                        onClick={() => handleDropdownClick(index)}
                        src={images.menudot}
                        alt=""
                      />
                      {openDropdown === index && (
                        <div
                          ref={deleteRef}
                          className="mobileCta cc-absolute cc-flex cc-w-[157px]  cc-py-[8px] cc-px-[20px] cc-bg-[#FFFFFF] cc-border-[1px] cc-border-[#F3F3F4] cc-border-solid cc-rounded-[12px] cc-shadow-[0px_8px_24px_-4px_#0000001F] cc-right-[0] cc-top-[61px] cc-z-[2]  cc-justify-between cc-items-center"
                          onClick={() => handleRemove(data)}
                        >
                          <p className="cc-text-[14px] cc-leading-[24px] cc-text-[#100C20] cc-font-semibold">
                            Delete
                          </p>
                          <img
                            src={images.deleteIconBlack}
                            className="cc-w-[18px] cc-h-[18px]"
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className=" cc-fixed cc-bottom-[0px] cc-w-full dark:cc-bg-dark-bg-black">
            <DialogFooter>
              <Button
                variant="primary"
                size="lg"
                className="cc-w-full"
                onClick={() => uploadSelectedFiles()}
                disabled={uploading}
              >
                Submit
              </Button>
            </DialogFooter>
          </div>
        </>
      )}
      {step === "SUCCESS" && (
        <SuccessScreen
          addMoreFiles={() => {
            setStep("ADD");
          }}
        />
      )}
    </>
  );
}

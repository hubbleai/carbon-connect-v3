import React, { Dispatch, SetStateAction, useContext } from "react";

import { Button } from "../design-system/Button";
import { images } from "@assets/index";
import CarbonContext from "src/context/CarbonContext";

type PropsInfo = {
  setStep: Dispatch<SetStateAction<string>>;
  setSelectedConversations: Dispatch<SetStateAction<string[]>>;
  setSelectFilesMessage: Dispatch<SetStateAction<string[]>>;
  totalConversations: number;
  setStartCustomSync: React.Dispatch<React.SetStateAction<boolean>>;
};
const SuccessScreenSlack = ({
  setStep,
  setSelectFilesMessage,
  setSelectedConversations,
  totalConversations,
  setStartCustomSync,
}: PropsInfo) => {
  const { setSlackActive } = useContext(CarbonContext);
  return (
    <>
      <div>
        <div className="  cc-p-[32px] md:cc-p-[16px] md:cc-mt-[188px]">
          <img
            className="cc-w-[50px]"
            src={images.successIcon}
            alt="successIcon"
          />
          <p className="cc-text-[26px] cc-leading-[40px] cc-font-medium cc-tracking-[-0.26px] cc-text-[#100C20] cc-mt-[24px] md:cc-mt-[16px] md:cc-text-[20px] md:cc-leading-[32px]  dark:cc-text-dark-text-white ">
            {totalConversations} Conversation(s) have been added.
          </p>
          <p className="cc-text-lg cc-font-semibold cc-text-[#8C8A94] cc-mt-[8px] md:cc-mt-[6px] md:cc-text-[14px] md:cc-leading-[24px]">
            Close this tab if you're done, or select more conversations to add.
          </p>
        </div>
        <div className="dark:cc-shadow-[0px_-3px_8px_-2px_#ffffff1F] dark:cc-border-t-[0px] cc-p-[32px] md:cc-fixed md:cc-bottom-[0px] md:cc-left-[0px] md:cc-w-full cc-border-t-[1px] cc-border-t-[#F3F3F4]">
          <Button
            variant="primary"
            className="cc-w-full  cc-text-base cc-h-[48px] cc-font-extrabold "
            onClick={() => {
              // add this function setSlackActive when you redirect from this screen
              setStartCustomSync(false);
              setSlackActive(false);
            }}
          >
            Got it
          </Button>
          <Button
            variant="neutral-white-fix"
            size="lg"
            className="cc-w-full cc-mt-[20px]"
            onClick={() => {
              setSlackActive(false);
              setSelectFilesMessage([]);
              setSelectedConversations([]);
              setStep("sync");
            }}
          >
            Select more conversations from Slack
          </Button>
        </div>
      </div>
    </>
  );
};

export default SuccessScreenSlack;

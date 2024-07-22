import React, {  useEffect, useState } from 'react';
import SlackLogo from "../../assets/logos/slack.svg";
import { Button } from '@components/common/design-system/Button';
import { useCarbon } from 'src/context/CarbonContext';
import { ActiveStep, IntegrationName } from 'src/typing/shared';
import AddAccount from '@components/common/AddAccount';
import { IntegrationItemType, INTEGRATIONS_LIST } from '@utils/integrationModalconstants';

import Channel from '@components/common/Slack/Channel';


const SlackScreen = ({
    setActiveStep,
    activeStepData,
  }: {
    setActiveStep: React.Dispatch<React.SetStateAction<ActiveStep>>;
    activeStepData?: IntegrationItemType;
  }) => {
    const [active , setActive] = useState(0);
    const { entryPoint , setSlackActive , slackActive } = useCarbon();
    const [openAccounts , setOpenAccounts] = useState<boolean>(false);
  
    
    const handleClick = () =>{
           setSlackActive(false);
           setActive(1)
    }
    useEffect(()=>{
      
    },[slackActive, active])
  return (
    <>
    {
        active === 0 &&
        <div >
        <div className='  cc-p-[32px] md:cc-p-[16px] md:cc-mt-[188px]'>
            <img className='cc-w-[50px]' src={SlackLogo} alt="logo" />
            <p className='cc-text-[26px] cc-leading-[40px] cc-font-medium cc-tracking-[-0.26px] cc-text-[#100C20] cc-mt-[24px]  md:cc-mt-[16px] md:cc-text-[20px] md:cc-leading-[32px]'>Your Slack account is connected.</p>
            <p className='cc-text-lg cc-font-semibold cc-text-[#8C8A94] cc-mt-[8px] md:cc-mt-[6px] md:cc-text-[14px] md:cc-leading-[24px]'>You can select from channels and direct messages to sync with your account</p>

        </div>
        <div className='cc-p-[32px] md:cc-p-[16px] md:cc-border-none cc-border-t-[1px] cc-border-b-[#F3F3F4] md:cc-fixed md:cc-bottom-[0px] md:cc-left-[0px] md:cc-w-full'>
           <Button variant='primary' className='cc-w-full  cc-text-base cc-h-[48px] cc-font-extrabold' onClick={handleClick}>
           {openAccounts?'Select more accounts': "Select conversations from Slack"}
           </Button>
           <Button
            onClick={() => {
                if (!entryPoint) setActiveStep("INTEGRATION_LIST");
                else setActiveStep("CONNECT");
                setSlackActive(true)
              }}
                variant="neutral-white-fix"
                size="lg"
                className='cc-w-full cc-mt-[20px]'
              >
                { openAccounts? 'View connected accounts':"Go back"}
              </Button>
        </div>
    </div>

    }
        
    {
        active === 1 && (
         
        
           <>
            <Channel
            setActiveStep={setActiveStep}
            setActive = {setActive}
            openAccount = {openAccounts}
            active= {active}
            activeStepData={INTEGRATIONS_LIST.find(
              (item) => item.id === IntegrationName.SLACK
            )}
            />
           
           </>
        )
    }
   
    </>
  )
}

export default SlackScreen
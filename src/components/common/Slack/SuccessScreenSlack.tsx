import React, { Dispatch, SetStateAction, useContext } from 'react';

  import { Button } from '../design-system/Button';
  import { images } from '@assets/index';
import CarbonContext from 'src/context/CarbonContext';
  
type PropsInfo = {
   setStep: Dispatch<SetStateAction<number>>;
   setSelectedFiles: Dispatch<SetStateAction<number[]>>
   setSelectFilesMessage:  Dispatch<SetStateAction<number[]>>
}
const SuccessScreenSlack = ({setStep , setSelectFilesMessage , setSelectedFiles}:PropsInfo) => {
    const { setSlackActive } = useContext(CarbonContext);
  return (
    <>
    <div >
        <div className=' cc-border-b-[1px] cc-border-b-[#F3F3F4] cc-p-[32px]'>
            <img className='cc-w-[50px]' src={images.successIcon} alt="successIcon" />
            <p className='cc-text-[26px] cc-leading-[40px] cc-font-medium cc-tracking-[-0.26px] cc-text-[#100C20] cc-mt-[24px]'>12 Channels have been added.</p>
            <p className='cc-text-lg cc-font-semibold cc-text-[#8C8A94] cc-mt-[8px] '>Close this tab if you're done, or select more conversations to add.</p>

        </div>
        <div className=' cc-p-[32px] '>
           <Button variant='primary'  className='cc-w-full  cc-text-base cc-h-[48px] cc-font-extrabold' onClick={()=>{
            // add this function setSlackActive when you redirect from this screen
            // setSlackActive(false);
            
           }} >
            Got it
           </Button>
           <Button
           
                variant="neutral-white-fix"
                size="lg"
                className='cc-w-full cc-mt-[20px]'
                onClick={()=>{
                    setSlackActive(false);
                    setSelectFilesMessage([]);
                    setSelectedFiles([]);
                    setStep(1)
                }}
              >
                Select more conversations from Slack
              </Button>
        </div>
    </div>
   
    </>
  
  )
}

export default SuccessScreenSlack






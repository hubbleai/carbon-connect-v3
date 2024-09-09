import React, { useEffect } from 'react';

type PropsInfo ={
    leftPosTip: string
}

const ErrorTooltip = ({leftPosTip}:PropsInfo) => {

   

  return (
    <span className="cc-block cc-bg-white cc-text-black cc-p-[12px]  cc-border cc-border-[#FEF2F2]  cc-text-[11px] cc-font-medium cc-leading-[16px] cc-rounded-[12px] cc-max-w-[150px] cc-w-[150px] cc-break-words cc-shadow-tooltipShadow">
    The system has panicked due to a critical error. Please
    restart your computer.
    <span className={`cc-absolute cc-rotate-180 -cc-top-[8px] ${leftPosTip === '21' ? 'cc-left-[21px]':'cc-left-[116px]'} cc-flex cc-flex-col-reverse`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="7"
        viewBox="0 0 16 7"
        fill="none"
      >
        <path
          d="M3.13511 3.13511C5.04057 5.04057 5.99331 5.99331 7.12743 6.24681C7.70205 6.37526 8.29795 6.37526 8.87257 6.24681C10.0067 5.99331 10.9594 5.04057 12.8649 3.1351L16 0H0L3.13511 3.13511Z"
          fill="#FEF2F2"
          stroke="#FEF2F2"
          strokeWidth="1"
        />
      </svg>
    </span>
  </span>
  )
}

export default ErrorTooltip
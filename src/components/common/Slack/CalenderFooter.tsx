import React, { Dispatch, SetStateAction } from 'react';


type PropsInfo = {
    selected:Date | undefined
    setOpen: Dispatch<SetStateAction<boolean>>
    setStoreDate: Dispatch<string | undefined>;
}

const CalenderFooter = ({selected , setOpen , setStoreDate}:PropsInfo) => {
  return (
    <div className='footerWrapper'>
      <div className=' bottomArea gap-[16px]'>
        <input type="text" value={selected?.toLocaleDateString()} className='inputfooter w-[112px] text-[#494656] rounded-[12px] bg-[#F3F3F4]' readOnly />
        <button className='cancelCta' onClick={()=>setOpen(false)}>cancel</button>
        <button className='startDate' onClick={()=>{
          setStoreDate(selected?.toLocaleDateString())
        }}>Set start date</button>
    </div>
    <div className='footerNote'>
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.5003 3.33366C6.81843 3.33366 3.83366 6.31843 3.83366 10.0003C3.83366 13.6822 6.81843 16.667 10.5003 16.667C14.1822 16.667 17.167 13.6822 17.167 10.0003C17.167 6.31843 14.1822 3.33366 10.5003 3.33366ZM2.16699 10.0003C2.16699 5.39795 5.89795 1.66699 10.5003 1.66699C15.1027 1.66699 18.8337 5.39795 18.8337 10.0003C18.8337 14.6027 15.1027 18.3337 10.5003 18.3337C5.89795 18.3337 2.16699 14.6027 2.16699 10.0003Z" fill="#8C8A94"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.66699 14.167V9.16699H11.3337V14.167H9.66699Z" fill="#8C8A94"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.66699 7.50033V5.83366H11.3337V7.50033H9.66699Z" fill="#8C8A94"/>
</svg>
<p>Syncing will start from {selected?.toLocaleDateString()}</p>
    </div>
  </div>
  )
}

export default CalenderFooter
import React, { Dispatch, SetStateAction, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import CalenderFooter from './CalenderFooter'


type PropsInfo ={
    setOpen: Dispatch<SetStateAction<boolean>>;
    selected: Date | undefined; 
    setSelected: Dispatch<SetStateAction<Date | undefined>>;
    setStoreDate: Dispatch<string | undefined>;
}
const DatePicker = ({setOpen , selected ,setSelected , setStoreDate}:PropsInfo) => {

  const [currentDate , setCurrentDate] = useState(new Date());
    
  return (
    <>
     <DayPicker mode="single" selected={selected} showOutsideDays onSelect={setSelected}   footer={ <CalenderFooter selected={selected} setOpen={setOpen} setStoreDate={setStoreDate} currentDate={currentDate}/> } />
    </>
  )
}

export default DatePicker
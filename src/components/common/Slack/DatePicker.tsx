import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DayClickEventHandler, DayPicker } from "react-day-picker";
import CalenderFooter from "./CalenderFooter";

type PropsInfo = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  selected: Date | undefined;
  setSelected: Dispatch<SetStateAction<Date | undefined>>;
  setStoreDate: (date: string) => void;
};
const DatePicker = ({
  setOpen,
  selected,
  setSelected,
  setStoreDate,
}: PropsInfo) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const mainContainer = document.querySelector(".rdp");
    const newElement = document.createElement("div");
    newElement.setAttribute("class", "innerLayer");
    mainContainer?.appendChild(newElement);

    const innerLayer = document.querySelector(".innerLayer");
    innerLayer?.addEventListener("click", () => {
      setOpen(false);
    });
  }, []);

  return (
    <>
      <DayPicker
        mode="single"
        selected={selected}
        showOutsideDays
        onSelect={setSelected}
        toDate={new Date()}
        footer={
          <CalenderFooter
            selected={selected}
            setOpen={setOpen}
            setStoreDate={setStoreDate}
            currentDate={currentDate}
          />
        }
      />
    </>
  );
};

export default DatePicker;

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@components/common/design-system/Dialog";
import { Button } from "./design-system/Button";
import { images } from "@assets/index";
import { FilterData } from "@components/WebScraper/WebScraper";
import { Input } from "./design-system/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

export default function WebsiteFilterBottomSheet({
  isOpen,
  onOpenChange,
  filterData,
  idx,
  handleFilterData,
}: {
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  filterData: FilterData[];
  idx: number;
  handleFilterData: (
    idx: number,
    fieldName: keyof FilterData,
    fieldValue: number | string
  ) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        activeState={"INTEGRATION_LIST"}
        className="cc-h-auto sm:cc-h-fit sm:cc-max-h-[90vh] cc-top-auto  cc-gap-0 sm:cc-rounded-[20px] cc-translate-y-0 -sm:cc-translate-y-1/2 cc-bottom-0 cc-rounded-t-2xl sm:cc-bottom-auto sm:top-1/2 cc-overflow-visible"
        style={{ height: "auto" }}
      >
        <DialogClose asChild>
          <button
            className="cc-absolute -cc-top-14 cc-left-1/2 -cc-translate-x-1/2 cc-bg-white cc-rounded-xl cc-h-10 cc-w-10 cc-flex cc-items-center cc-justify-center cc-cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            <img
              src={images.crossIcon}
              alt="CrossIcon"
              className="cc-h-[18px] cc-w-[18px]"
            />
          </button>
        </DialogClose>
        <div className="cc-p-4 sm:cc-p-8">
          <div className="cc-text-xlxt cc-font-bold cc-mb-2">Configure</div>
          <div>
            <div className="cc-py-3 cc-flex cc-justify-between cc-items-center">
              <div className="cc-flex">
                <label>
                  <input
                    type="radio"
                    name="tab"
                    checked={filterData[idx]?.filterType === "Recursion depth"}
                    onChange={() =>
                      handleFilterData(idx, "filterType", "Recursion depth")
                    }
                    className="cc-hidden"
                  />
                  <span
                    className={`cc-custom-radio cc-text-base cc-font-semibold cc-text-high_em ${
                      filterData[idx]?.filterType === "Recursion depth"
                        ? "cc-custom-radio-checked"
                        : ""
                    }`}
                  >
                    Recursion depth
                  </span>
                </label>
              </div>

              <div className="cc-w-[51px]">
                <Input
                  type="text"
                  placeholder=""
                  className="cc-h-8 cc-text-xs !cc-pl-2"
                  value={filterData[idx]?.maxPages}
                  onChange={(e) =>
                    handleFilterData(idx, "maxPages", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="cc-py-3 cc-flex cc-justify-between cc-items-center">
              <div className="cc-flex">
                <label>
                  <input
                    type="radio"
                    name="tab"
                    checked={
                      filterData[idx]?.filterType === "Max pages to scrape"
                    }
                    onChange={() =>
                      handleFilterData(idx, "filterType", "Max pages to scrape")
                    }
                    className="cc-hidden"
                  />
                  <span
                    className={`cc-custom-radio cc-text-base cc-font-semibold cc-text-high_em ${
                      filterData[idx]?.filterType === "Max pages to scrape"
                        ? "cc-custom-radio-checked"
                        : ""
                    }`}
                  >
                    Max pages to scrape
                  </span>
                </label>
              </div>
              <div className="cc-w-[51px]">
                <Input
                  type="text"
                  placeholder=""
                  className="cc-h-8 cc-text-xs !cc-pl-2"
                  value={filterData[idx]?.maxPages}
                  onChange={(e) =>
                    handleFilterData(idx, "maxPages", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="p-4 sm:cc-px-8 sm:cc-pb-8 sm:cc-pt-6 cc-border-t-0">
          <Button
            variant="primary"
            size="lg"
            className="cc-w-full cc-mb-2 sm:cc-mb-5"
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

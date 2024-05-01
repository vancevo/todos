import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useCallback, useEffect, useState } from "react";

export interface IProps {
  date: string;
  setOpeningList: (value: string[] | unknown) => void;
}

export default function AccordionExpand(props: IProps) {
  const { date, setOpeningList } = props;
  const handleOpenEdit = useCallback((date: string) => {
    setOpeningList((prev: string[]) => {
      if (!prev.includes(date)) {
        return [...prev, date];
      }
      return prev.filter((_date) => _date !== date);
    });
  }, []);

  useEffect(() => {
    console.log("re-render Accordion component");
  }, []);

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<KeyboardArrowDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
          onClick={() => handleOpenEdit(date)}
        >
          <Typography className="font-bold">{date}</Typography>
        </AccordionSummary>
      </Accordion>
    </div>
  );
}

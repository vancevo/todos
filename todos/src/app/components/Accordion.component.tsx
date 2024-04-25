import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useCallback, useEffect, useState } from "react";
import { ITodo } from "../types";
import Checkbox from "@mui/material/Checkbox";
import EditIcon from "@mui/icons-material/Edit";

export interface IProps {
  date: string;
  data: Record<string, ITodo[]>;
  setOpen: ({ isOpen, type }: { isOpen: boolean; type?: string }) => void;
  dispatch: (value: any) => void;
}

export default function AccordionExpand(props: IProps) {
  const { date, data, dispatch, setOpen } = props;
  const [checkedTodo, setChecked] = useState<any>({});
  const handleDropdown = useCallback((date: string) => {}, []);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = event.target;
    console.log({ id });
    setChecked({
      ...checkedTodo,
      [id]: event.target.checked,
    });
  };
  const handleOpenEdit = useCallback((id: number) => {
    // dispatch({
    //   type: "edit",
    //   payload: {
    //     id,
    //     date,
    //   },
    // });
    // console.log({ id });
  }, []);

  useEffect(() => {
    console.log("re-render-component");
  }, []);

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<KeyboardArrowDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
          onClick={() => handleDropdown(date)}
        >
          <Typography className="font-bold">{date}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.keys(data)?.length &&
            data[date].map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex gap-1 items-center">
                    <Checkbox
                      id={`${item.id}`}
                      checked={checkedTodo[item.id] || false}
                      onChange={handleChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <p>{item.text}</p>
                  </div>
                  <EditIcon
                    onClick={() =>
                      setOpen({
                        isOpen: true,
                        type: "edit",
                      })
                    }
                    className="w-4 h-4 hover:opacity-70 cursor-pointer"
                  />
                </div>
              );
            })}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

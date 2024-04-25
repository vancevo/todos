"use client";
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import SimpleDialog from "../components/SimpleDialog.component";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Toaster } from "react-hot-toast";
import { getTxt } from "../apis/todos";
import { ITodo } from "../types";
import AccordionExpand from "../components/Accordion.component";
import { EmptyPage } from "../components/Empty.component";
import { useImmerReducer } from "use-immer";
import dayjs from "dayjs";

const Dashboard = () => {
  const [openStatus, setOpen] = useState<{ isOpen: boolean; type?: string }>({
    isOpen: false,
    type: "new",
  });
  const [todoItems, setTodoItems] = useState<ITodo[]>([]);
  const [crudState, crudDispatch] = useImmerReducer<any[]>(
    crudReducer,
    todoItems
  );

  const getTodoItems = useCallback(async () => {
    const res = await getTxt();
    setTodoItems(res);
  }, [setTodoItems]);

  const handleAddNew = useCallback(() => {
    setOpen({
      isOpen: true,
      type: "new",
    });
  }, [setOpen]);

  const dateList = useMemo(() => {
    return mappingDate(todoItems);
  }, [todoItems]);

  const dataByDate = useMemo(() => {
    return mappingDataByDate(todoItems, dateList);
  }, [dateList, todoItems]);

  useEffect(() => {
    getTodoItems();
  }, [crudState, getTodoItems]);

  useEffect(() => {
    console.log("re-render");
  }, []);

  return (
    <>
      <Container className="min-h-[100vh] my-10 p-4 border-[2px]">
        <Button
          variant="contained"
          className="float-right w-fit block"
          onClick={handleAddNew}
        >
          Add new
        </Button>
        <br />
        {/* Table List Todo */}
        <div className="mt-4">
          <h1 className="font-bold text-2xl mb-4">To Do List</h1>

          {dateList.length ? (
            dateList.map((date, index) => {
              return (
                <div key={index} className="mb-4 last:mb-0">
                  <AccordionExpand
                    date={date}
                    data={dataByDate}
                    dispatch={crudDispatch}
                  />
                </div>
              );
            })
          ) : (
            <EmptyPage />
          )}
        </div>
      </Container>

      <SimpleDialog
        open={openStatus.isOpen}
        onClose={() =>
          setOpen({
            isOpen: false,
          })
        }
        dispatch={crudDispatch}
      />

      <Toaster />
    </>
  );
};

function crudReducer(state: any, action: any) {
  console.log("reducer running");
  switch (action.type) {
    case "add":
      state.push(action.payload);
      break;
    case "edit":
      let tmp = action.pay;
      break;
    default:
      break;
  }
}

function mappingDate(data: ITodo[]) {
  let tmp = {} as any;
  data.forEach((item) => {
    let _date = dayjs(item.date).format("DD/MM/YYYY");
    if (!tmp.hasOwnProperty(_date)) {
      tmp[_date] = new Array();
    }
  });
  return Object.keys(tmp);
}

function mappingDataByDate(data: ITodo[], dateList: string[]) {
  let obj = dateList.reduce((a, c) => ({ ...a, [c]: [] }), {}) as any;
  data.forEach((item) => {
    let _date = dayjs(item.date).format("DD/MM/YYYY");
    obj[_date] = [...obj[_date], item];
  });
  return obj;
}

export default Dashboard;

"use client";
import { Checkbox, Container } from "@mui/material";
import Button from "@mui/material/Button";
import SimpleDialog from "../components/SimpleDialog.component";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Toaster } from "react-hot-toast";
import { deleteTxt, getTxt } from "../apis/todos";
import { ITodo } from "../types";
import AccordionExpand from "../components/Accordion.component";
import { EmptyPage } from "../components/Empty.component";
import { useImmerReducer } from "use-immer";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AlertDialog from "../components/ConfirmationDialog.component";

const Dashboard = () => {
  const [openStatus, setOpen] = useState<{ isOpen: boolean; type?: string }>({
    isOpen: false,
    type: "new",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openingList, setOpeningList] = useState<any>([]);
  
  const [todoItems, setTodoItems] = useState<ITodo[]>([]);
  const [crudState, crudDispatch] = useImmerReducer<unknown, unknown>(
    crudReducer,
    todoItems
  );
  const [checkedTodo, setChecked] = useState<any>({});
  
  const [originalList, setOriginalList] = useState<
    Record<string, string | number>
  >({});


  const [idDialog, setIdDialog] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = event.target;
    setChecked({
      ...checkedTodo,
      [id]: event.target.checked,
    });
  };
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

  const handleEditModal = ({
    id,
    date,
    text,
  }: {
    id: number;
    date: string;
    text: string;
  }) => {
    setOpen({
      isOpen: true,
      type: "edit",
    });
    setOriginalList({ id, text, date: dayjs(date).toISOString() });
  };

  const handleDeleteTodo = ({ e, id }: { e: any; id: number }) => {
    setOpenDialog(true);
    setIdDialog(id);
  };

  useEffect(() => {
    getTodoItems();
  }, [crudState, getTodoItems, openDialog]);

  useEffect(() => {
    console.log("re-render");
  }, [openStatus]);

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
          <>
            {dateList.length ? (
              dateList.map((date, index) => {
                return (
                  <div key={index} className="mb-4 last:mb-0">
                    <AccordionExpand
                      date={date}
                      setOpeningList={setOpeningList}
                    />
                    {openingList?.includes(date) && (
                      <div className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiAccordion-root MuiAccordion-rounded Mui-expanded MuiAccordion-gutters css-1086bdv-MuiPaper-root-MuiAccordion-root bg-[#FDEBF8]">
                        {dataByDate[date].map((item: any) => {
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between border-b-[2px] border-[#D3D3D3] last:border-[0px]"
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
                              <div>
                                <EditIcon
                                  className="w-4 h-4 hover:opacity-70 cursor-pointer text-[#6892FA]"
                                  onClick={() =>
                                    handleEditModal({
                                      id: item.id,
                                      date: item.date,
                                      text: item.text,
                                    })
                                  }
                                />
                                <DeleteOutlineIcon
                                  className="w-4 h-4 hover:opacity-70 text-[#DC5E5E] cursor-pointer mr-5"
                                  onClick={(e) =>
                                    handleDeleteTodo({
                                      e,
                                      id: item.id,
                                    })
                                  }
                                ></DeleteOutlineIcon>
                              </div>

                              <AlertDialog
                                id={idDialog}
                                title="Delete this item?"
                                description="Are u sure to delete?"
                                openDialog={openDialog}
                                setOpenDialog={setOpenDialog}
                                fnDelete={() => deleteTxt}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <EmptyPage />
            )}
          </>
        </div>
      </Container>

      <SimpleDialog
        open={openStatus.isOpen}
        type={openStatus.type}
        originalList={originalList}
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

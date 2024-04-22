"use client";
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import SimpleDialog from "../components/SimpleDialog.component";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { getTxt } from "../apis/todos";
import { ITodo } from "../types";
import AccordionExpand from "../components/Accordion.component";
import AddIcon from "@mui/icons-material/Add";

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  const [todos, setTodos] = useState<ITodo[]>([]);

  const handleAddNew = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  //one-mount
  useEffect(() => {
    //setup
    const callApi = async () => {
      const res = await getTxt();
      setTodos(res);
    };
    callApi();
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

          {todos.length ? (
            todos.map((item) => {
              return (
                <div key={item.id} className="mb-4 last:mb-0">
                  <AccordionExpand />
                </div>
              );
            })
          ) : (
            <Container  onClick={handleAddNew} className="w-full min-h-[600px] border-[2px] flex items-center justify-center hover:cursor-pointer hover:text-red-500">
              <p className="text-[40px]">Empty List, pls add todo more</p>
              <AddIcon className="ml-4 rounded-full border-[2px] w-[60px] h-[60px]" />
            </Container>
          )}
        </div>
      </Container>

      <SimpleDialog open={open} onClose={() => setOpen(false)} />

      <Toaster />
    </>
  );
};

export default Dashboard;

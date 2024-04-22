import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  Button,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import { addNewTxt } from "../apis/todos";
import toast from "react-hot-toast";
import generateUniqueId from "generate-unique-id";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: boolean) => void;
}

export default function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [text, setText] = useState("");

  const handleClose = () => {
    onClose(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoadingSubmit(true);

    //CALL API
    const _id = (await generateUniqueId({
      useNumbers: true,
      useLetters: false,
    })) as any;
    const result = await addNewTxt({ id: _id, text: "okie ban hoi" });

    try {
      if (result) {
        setLoadingSubmit(false);
        handleClose();
        toast.success("Create Successful!!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    console.log(text);
  }, [text]);

  //Unmount
  useEffect(() => {
    setLoadingSubmit(false);
    setText("");
  }, [open]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle className="w-[450px] h-[200px]">
        <h1 className="text-center font-bold capitalize text-xl">Add new</h1>
        <form>
          <TextField
            className="w-full"
            id="standard-multiline-flexible"
            label="Description"
            multiline
            maxRows={4}
            variant="standard"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              variant="contained"
              className="mt-6 w-full bg-neutral-300"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              className="mt-6 w-full"
              loading={loadingSubmit}
              onClick={handleSubmit}
            >
              Submit
            </LoadingButton>
          </div>
        </form>
      </DialogTitle>
    </Dialog>
  );
}

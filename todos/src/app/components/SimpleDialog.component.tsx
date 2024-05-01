import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useCallback, useEffect, useMemo, useState } from "react";
import { addNewTxt, editTxt } from "../apis/todos";
import toast from "react-hot-toast";
import generateUniqueId from "generate-unique-id";

export interface SimpleDialogProps {
  open: boolean;
  type: string | any;
  originalList: Record<string, string | number | any>;
  onClose: ({ isOpen, type }: { isOpen: boolean; type?: string }) => void;
  dispatch: (value: any) => void;
}

export default function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open, type = "new", dispatch, originalList } = props;

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [text, setText] = useState<string>("");

  const handleClose = () => {
    console.log({ type });
    // dispatch({ type: "close" });
    onClose({
      type,
      isOpen: false,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoadingSubmit(true);
      validateText();

      const _id = (await generateUniqueId({
        useNumbers: true,
        useLetters: false,
      })) as any;
      //CALL API
      const result =
        type === "new"
          ? await addNewTxt({ id: _id, text, date: new Date() })
          : await editTxt({
              text,
              id: originalList.id,
              date: originalList.date,
            });

      if (result) {
        handleSuccess(_id);
      }
    } catch (e: any) {
      handleError(e);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const validateText = useCallback(() => {
    console.log("validate");
    if (!text.trim().length) {
      throw new Error("Text is Empty");
    }
  }, [text]);

  const handleSuccess = (_id: string) => {
    console.log("success render");
    dispatch({ type: "add", payload: { id: _id, text, date: new Date() } });
    handleClose();
    toast.success("Create Successful!!");
  };

  const handleError = (error: any) => {
    console.log("success error");
    toast.error(error.message);
  };

  useEffect(() => {
    originalList.text?.length && type === "edit"
      ? setText(originalList.text)
      : setText("");
    // Unmount
    return () => {
      setLoadingSubmit(false);
      setText("");
    };
  }, [open, originalList, type]);

  useEffect(() => {
    console.log("re-render SimpleDialog");
  }, []);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle className="w-[450px] h-[200px]">
        <p className="text-center font-bold capitalize text-xl">
          {type === "new" ? "Add new" : "Edit"}
        </p>
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

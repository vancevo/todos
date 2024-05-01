import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import toast from "react-hot-toast";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { deleteTxt } from "../apis/todos";

interface IProps {
  title: string;
  description: string;
  confirmTxt?: string;
  cancelTxt?: string;
  openDialog: boolean;
  id: number;
  setOpenDialog: (value: boolean) => void;
  fnDelete: (id: number) => any;
}

export default function AlertDialog(props: IProps) {
  const {
    id,
    title,
    description,
    confirmTxt = "confirm",
    cancelTxt = "cancel",
    openDialog = false,
    setOpenDialog,
    fnDelete,
  } = props;

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSuccess = () => {
    handleClose();
    toast.success("Create Successful!!");
  };
  const handleError = (error: any) => {
    console.log("success error");
    toast.error(error.message);
  };

  const handleConfirm = async (e: any) => {
    try {
      setLoadingSubmit(true);
      let result = await deleteTxt({ id });
      if (result) {
        handleSuccess();
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent className="pb-2">
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="flex gap-1 justify-center mb-2">
          <Button
            className="capitalize w-6 h-6 p-2"
            onClick={handleClose}
            variant="contained"
          >
            {cancelTxt}
          </Button>
          {/* <Button className="capitalize" onClick={handleConfirm} autoFocus>
            {confirmTxt}
          </Button> */}
          <LoadingButton
            type="submit"
            variant="contained"
            className="w-6 h-6 p-2 capitalize"
            loading={loadingSubmit}
            onClick={handleConfirm}
          >
            {confirmTxt}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

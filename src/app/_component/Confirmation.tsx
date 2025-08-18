import { Dialog, DialogContentText, PaperProps, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { Paper } from "@mui/material";

export default function Confirmation({ title, content, open, setOpen, onConfirm }: {
  title: string,
  content: string,
  open: boolean,
  setOpen: (open: boolean) => void,
  onConfirm: () => void,
}) {

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    handleClose();
    onConfirm();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      sx={{
        '& .MuiDialog-paper': {
          width: '30%',
        },
      }}
    >
      <DialogTitle style={{ cursor: 'move' }} sx={{
        textTransform: 'none',
        fontWeight: 'bold',
      }} id="draggable-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} sx={{
          textTransform: 'none',
          fontSize: '1.1rem',
          fontWeight: 'bold',

        }}>
          Cancel
        </Button>
        <Button autoFocus sx={{
          textTransform: 'none',
          fontSize: '1.1rem',
          fontWeight: 'bold',
        }}
          onClick={handleConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}


function PaperComponent(props: PaperProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}
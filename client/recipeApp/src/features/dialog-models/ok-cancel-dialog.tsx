import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

type OkCancelDialogProps = {
    open: boolean;
    header: React.ReactNode;
    content: React.ReactNode;
    onClose: (result: boolean) => void;
    okText?: string;
    cancelText?: string;
    disableBackdropClose?: boolean;
};

export function OkCancelDialog({
    open,
    header,
    content,
    onClose,
    okText = "אישור",
    cancelText = "ביטול",
    disableBackdropClose = false,
}: OkCancelDialogProps) {
    const handleClose = (_event: object, reason?: string) => {
        if (disableBackdropClose && (reason === "backdropClick" || reason === "escapeKeyDown")) return;
        onClose(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} dir="rtl" PaperProps={{
            sx: {
                minWidth: 400,
            },
        }}>
            <DialogTitle dir="rtl">
                {typeof header === "string" ? <Typography fontWeight={800}>{header}</Typography> : header}
            </DialogTitle>

            <DialogContent dir="rtl">
                {typeof content === "string" ? (
                    <DialogContentText sx={{ whiteSpace: "pre-wrap" }}>{content}</DialogContentText>
                ) : (
                    content
                )}
            </DialogContent>

            <DialogActions dir="rtl" sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={() => onClose(false)}>
                    {cancelText}
                </Button>
                <Button variant="contained" onClick={() => onClose(true)}>
                    {okText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
